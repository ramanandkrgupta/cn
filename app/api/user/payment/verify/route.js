import crypto from 'crypto';

export const POST = async (req) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');

  if (generated_signature === razorpay_signature) {
    return new Response(JSON.stringify({ status: 'success' }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ status: 'failed' }), { status: 400 });
  }
}