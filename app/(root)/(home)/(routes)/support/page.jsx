'use client';

import { Goal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const Crowdfunding = () => {
  const [amount, setAmount] = useState('');
  const [raised, setRaised] = useState(0);
  const [goal] = useState("10000");

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (amount) => {
    try {
      const res = await fetch('/api/razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const order = await res.json();
      if (!order || order.error) {
        alert('Error creating order. Please try again.');
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Notesmates Crowdfunding',
        description: 'Support Our Mission!',
        order_id: order.id,
        handler: function (response) {
          toast(`Thank you for your support! Payment ID: ${response.razorpay_payment_id}`);
          setRaised((prev) => prev + amount); // Update the raised amount
        },
        theme: { color: '#3399cc' },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert('Payment failed. Try again.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center bg-gray-100 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">Support Notesmates</h1>
        <p className="text-lg mt-4">
          Join us in building a comprehensive platform for free engineering notes and resources!
        </p>
      </div>

      {/* Goal Section */}
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-semibold">Our Crowdfunding Goal</h2>
        <p className="mt-2">₹{raised.toLocaleString()} raised out of ₹{goal}</p>
        <div className="w-full bg-gray-300 h-4 rounded-lg mt-4">
          <div
            className="bg-green-500 h-4 rounded-lg"
            style={{ width: `${(raised / goal) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-8 text-center">
        <h3 className="text-xl font-medium">Choose Your Donation Amount</h3>
        <div className="flex justify-center mt-4 gap-4">
          <button
            onClick={() => handlePayment(100)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Donate ₹100
          </button>
          <button
            onClick={() => handlePayment(500)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Donate ₹500
          </button>
          <button
            onClick={() => handlePayment(1000)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Donate ₹1000
          </button>
        </div>
        <div className="mt-4">
          <input
            type="number"
            placeholder="Custom Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border px-4 py-2 rounded-md mr-2"
          />
          <button
            onClick={() => handlePayment(amount)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Donate
          </button>
        </div>
      </div>

      {/* Rewards Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Rewards for Donors</h3>
        <ul className="list-disc pl-6 mt-4">
          <li>₹100: Thank you email.</li>
          <li>₹500: Early access to premium notes.</li>
          <li>₹1000+: Name listed on the "Supporters Wall" of the website.</li>
          <li>₹5000+: Lifetime free access to resources.</li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">FAQ</h3>
        <div className="mt-4">
          <h4 className="font-medium">What if the goal isn't achieved?</h4>
          <p>Funds will still be used to implement the planned features to the best extent possible.</p>
        </div>
        <div className="mt-4">
          <h4 className="font-medium">Can I get a refund?</h4>
          <p>Donations are non-refundable.</p>
        </div>
      </div>
    </div>
  );
};

export default Crowdfunding;
