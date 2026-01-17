import { NextResponse } from "next/server";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import crypto from 'crypto';
import Razorpay from 'razorpay';

// Define plan prices for validation
// We will fetch from DB now

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan: planName, paymentDetails } = await req.json();

    if (!planName || !paymentDetails) {
      return NextResponse.json({ error: "Missing plan or payment details" }, { status: 400 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;

    // 1. Signature Verification
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // 2. Amount Verification (Prevent manipulating amount)
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await razorpay.orders.fetch(razorpay_order_id);

    // Fetch plan price from DB
    const subscriptionPlan = await prisma.subscriptionPlan.findUnique({
      where: { planId: planName.toLowerCase() }, // Assuming 'pro' is stored as lowercase based on subscription route
    });

    if (!subscriptionPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Expected amount in paise (DB stores in rupees)
    const expectedAmount = subscriptionPlan.price * 100;

    // Check if paid amount matches the plan price
    // We strictly check >= to allow for potential small rounding issues or overpayment (unlikely but safer than strict ===)
    // Actually strict equality is better for security, but float math might be tricky.
    // However, Razorpay returns integer paise. database price is likely integer or float.
    // We'll use Math.round to safely convert DB price.

    if (order.amount < Math.round(expectedAmount)) {
      console.warn(`Payment mismatch: Order ${order.amount}, Expected ${expectedAmount}`);
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    if (order.status !== 'paid' && order.status !== 'attempted') {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      if (payment.status !== 'captured') {
        return NextResponse.json({ error: "Payment not captured" }, { status: 400 });
      }
    }

    // Calculate expiration date (e.g., 30 days)
    // You might want to make this dynamic based on the plan (e.g. yearly vs monthly)
    // For now assuming 30 days for 'pro'
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Fetch payment details to get UTR and Mobile
    let mobile = null;
    let utr = null;
    try {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      mobile = paymentDetails.contact;
      utr = paymentDetails.acquirer_data?.rrn || paymentDetails.acquirer_data?.upi_transaction_id;
    } catch (e) {
      console.error("Failed to fetch extra payment details", e);
    }

    // Update PaymentHistory
    await prisma.paymentHistory.update({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        startDate: new Date(),
        endDate: expiresAt,
        mobile: mobile,
        utr: utr
      }
    });

    // Update user with new role and expiration
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        userRole: planName.toUpperCase(),
        planExpiresAt: expiresAt
      },
      select: {
        id: true,
        name: true,
        email: true,
        userRole: true,
        avatar: true,
        isEmailVerified: true,
        planExpiresAt: true,
      }
    });

    // Format response with role mapping
    const formattedUser = {
      ...updatedUser,
      role: updatedUser.userRole // Add role field for consistency
    };

    return NextResponse.json({
      success: true,
      user: formattedUser
    });

  } catch (error) {
    console.error("Error in upgrade process:", error);
    return NextResponse.json({
      error: "Error upgrading user",
      details: error.message
    }, { status: 500 });
  }
} 