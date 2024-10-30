import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const POST = async (req) => {
  try {
    const { amount, currency, receipt } = await req.json();

    if (!amount || !currency || !receipt) {
      return NextResponse.json({ error: 'Missing required parameters.' }, { status: 400 });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt,
      payment_capture: 1 // auto capture
    };
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order, { status: 200 });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: error.message, details: error.response ? error.response.data : 'No additional details' }, { status: error.response ? error.response.status : 500 });
  }
};