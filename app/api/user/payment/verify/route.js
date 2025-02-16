import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await req.json();

  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
  }

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    // Save subscription details in the database
    await prisma.subscriptionDetail.create({
      data: {
        userId,
        paymentId: razorpay_payment_id,
        orderStatus: 'completed',
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ status: 'failed' }), { status: 400 });
  }
};