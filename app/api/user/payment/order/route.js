import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import prisma from "@/libs/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const POST = async (req) => {
  try {
    const { amount, currency, receipt, notes } = await req.json();

    if (!amount || !currency || !receipt) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
      notes,
      payment_capture: 1, // auto capture
    };

    const order = await razorpay.orders.create(options);

    // Attempt to get session
    const session = await getServerSession(authOptions);
    let userId = session?.user?.id;

    if (userId) {
      // Create PaymentHistory record
      await prisma.paymentHistory.create({
        data: {
          userId,
          razorpayOrderId: order.id,
          amount: amount,
          currency: currency,
          status: 'created',
          planId: receipt?.split('_')[1] || 'unknown', // receipt format: plan_{planId}_{timestamp}
          receipt: receipt,
          notes: notes,
        }
      });
    }

    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message, details: error.response ? error.response.data : 'No additional details' }, { status: error.response ? error.response.status : 500 });
  }
};