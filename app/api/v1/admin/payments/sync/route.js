import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import Razorpay from 'razorpay';

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { limit = 1000 } = await req.json();

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        // 1. Fetch captured payments from Razorpay with pagination
        let allPayments = [];
        let fetchedCount = 0;
        let skip = 0;

        while (fetchedCount < limit) {
            const batchSize = Math.min(100, limit - fetchedCount);
            const batch = await razorpay.payments.all({
                count: batchSize,
                skip: skip
            });

            if (!batch.items || batch.items.length === 0) break;

            allPayments = [...allPayments, ...batch.items];
            fetchedCount += batch.items.length;
            skip += batch.items.length;

            if (batch.items.length < batchSize) break; // End of list
        }

        const payments = { items: allPayments };

        let syncedCount = 0;
        let errors = [];
        let stats = {
            synced: 0,
            skipped_not_captured: 0,
            skipped_filter_mismatch: 0,
            skipped_no_email: 0,
            skipped_user_not_found: 0,
            skipped_already_exists: 0
        };

        // 2. Iterate and Sync
        for (const payment of payments.items) {
            if (payment.status !== 'captured') {
                stats.skipped_not_captured++;
                continue;
            }

            // Check filters: (k1 === 'NM') OR (description === 'Upgrade to PRO Plan')
            const isNoteMatch = payment.notes?.k1 === 'NM';
            const isDescMatch = payment.description === 'Upgrade to PRO Plan';

            if (!isNoteMatch && !isDescMatch) {
                stats.skipped_filter_mismatch++;
                continue;
            }

            const email = payment.email || payment.notes?.email;
            if (!email) {
                stats.skipped_no_email++;
                continue;
            }

            // Find User
            const user = await prisma.user.findUnique({
                where: { email: email }
            });

            if (!user) {
                stats.skipped_user_not_found++;
                continue;
            }

            // Check if PaymentHistory already exists
            const existingHistory = await prisma.paymentHistory.findFirst({
                where: { razorpayPaymentId: payment.id }
            });

            if (existingHistory) {
                stats.skipped_already_exists++;
                continue;
            }

            // ... (rest of logic)
            // Check if this payment corresponds to a PRO upgrade
            // We assume captured payments of relevant amounts are upgrades. 
            // Could also check payment.notes for 'plan' info if we saved it there reliably.
            // For backfilling, we assume these are valid subscriptions.

            const planId = 'pro';

            const amount = payment.amount / 100;
            const paymentDate = new Date(payment.created_at * 1000);
            const expiresAt = new Date(paymentDate);
            expiresAt.setDate(expiresAt.getDate() + 30); // Default 30 days validity from payment date

            // Extract UTR and Mobile
            const mobile = payment.contact || payment.notes?.contact || null;
            const utr = payment.acquirer_data?.rrn || payment.acquirer_data?.upi_transaction_id || null;

            try {
                await prisma.paymentHistory.create({
                    data: {
                        userId: user.id,
                        razorpayPaymentId: payment.id,
                        razorpayOrderId: payment.order_id || `import_${payment.id}`, // If order_id missing (direct payment), make one up
                        amount: amount,
                        currency: payment.currency,
                        status: 'paid',
                        planId: planId,
                        receipt: payment.receipt,
                        startDate: paymentDate,
                        endDate: expiresAt,
                        notes: payment.notes,
                        mobile: mobile,
                        utr: utr
                    }
                });

                // Update User Expiry if it's not set or if this payment is newer/extends it
                let shouldUpdateUser = false;
                if (!user.planExpiresAt || expiresAt > user.planExpiresAt) {
                    shouldUpdateUser = true;
                }

                if (shouldUpdateUser) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            planExpiresAt: expiresAt
                        }
                    });
                }

                syncedCount++;
                stats.synced++;

            } catch (err) {
                console.error(`Failed to sync payment ${payment.id}:`, err);
                errors.push(payment.id);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${syncedCount} payments.`,
            totalChecked: payments.items.length,
            stats: stats
        });

    } catch (error) {
        console.error("Error syncing payments:", error);
        return NextResponse.json({
            error: "Error syncing payments",
            details: error.message
        }, { status: 500 });
    }
}
