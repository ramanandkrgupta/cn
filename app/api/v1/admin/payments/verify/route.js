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

        const { paymentId } = await req.json();

        if (!paymentId) {
            return NextResponse.json({ error: "Missing payment ID" }, { status: 400 });
        }

        // 1. Fetch local record
        const paymentRecord = await prisma.paymentHistory.findUnique({
            where: { id: paymentId },
            include: { user: true }
        });

        if (!paymentRecord) {
            return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
        }

        // If already paid, no need to check
        if (paymentRecord.status === 'paid') {
            return NextResponse.json({ message: "Payment already verified as paid", record: paymentRecord });
        }

        // 2. Fetch order status from Razorpay
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpay.orders.fetch(paymentRecord.razorpayOrderId);

        // 3. Logic to determine if paid
        let isPaid = false;
        let paymentDetails = {};

        if (order.status === 'paid') {
            isPaid = true;
            // If order is paid, we need to find the payment ID associated with it properly
            // Razorpay API: fetching payments for an order
            const payments = await razorpay.orders.fetchPayments(paymentRecord.razorpayOrderId);
            const successfulPayment = payments.items.find(p => p.status === 'captured');
            if (successfulPayment) {
                paymentDetails = {
                    razorpayPaymentId: successfulPayment.id,
                    // We can't generate signature here easily without client interaction, but for admin override it's okay to skip exact sig check if we trust Razorpay API directly.
                };
            }
        } else if (order.status === 'attempted') {
            // Check if there is any captured payment
            const payments = await razorpay.orders.fetchPayments(paymentRecord.razorpayOrderId);
            const successfulPayment = payments.items.find(p => p.status === 'captured');
            if (successfulPayment) {
                isPaid = true;
                paymentDetails = {
                    razorpayPaymentId: successfulPayment.id,
                };
            }
        }

        if (isPaid) {
            // Calculate expiration
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            // Update PaymentHistory
            const updatedPayment = await prisma.paymentHistory.update({
                where: { id: paymentId },
                data: {
                    razorpayPaymentId: paymentDetails.razorpayPaymentId || "admin_verified",
                    status: 'paid',
                    startDate: new Date(),
                    endDate: expiresAt,
                }
            });

            // Update user
            await prisma.user.update({
                where: { id: paymentRecord.userId },
                data: {
                    userRole: paymentRecord.planId.toUpperCase(),
                    planExpiresAt: expiresAt
                }
            });

            return NextResponse.json({ success: true, message: "Payment verified and user upgraded", record: updatedPayment });
        } else {
            return NextResponse.json({ success: false, message: "Payment not found or not captured in Razorpay", razorpayStatus: order.status });
        }

    } catch (error) {
        console.error("Error verifying payment:", error);
        return NextResponse.json({
            error: "Error verifying payment",
            details: error.message
        }, { status: 500 });
    }
}
