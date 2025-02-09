import Razorpay from 'razorpay';
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";

export async function POST(req) {
  const { amount, currency = 'INR' } = await req.json();
  const session = await getServerSession(authOptions);

  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt: `receipt_${Date.now()}`,
    prefill: {
      name: session.user.name,
      email: session.user.email,
      
      
    }
  };

  try {
    const order = await razorpay.orders.create(options);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
