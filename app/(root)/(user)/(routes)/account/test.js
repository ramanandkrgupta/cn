import React from 'react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

const ProfileCard = () => {
  const handleSubscribe = async () => {
    try {
      // Create an order on the server
      const { data: order } = await axios.post('/api/razorpay', {
        amount: 50000, // Amount in smallest currency unit (e.g., 50000 paise = 500 INR)
        currency: 'INR',
        receipt: `receipt_${new Date().getTime()}`
      });

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Plan Upgrade',
        order_id: order.id,
        handler: async (response) => {
          const paymentResponse = await axios.post('/api/razorpay?action=verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          if (paymentResponse.data.status === 'success') {
            alert('Payment successful!');
            // Update plan in your database
          } else {
            alert('Payment verification failed!');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  };

  return (
    <div className="bg-[#2c2f32] p-6 md:p-8 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <img
            src="img/profile.jpg"
            alt="Profile Picture"
            className="w-16 h-16 rounded-full mr-4"
          />
          <div>
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold text-white">Neelesh Chaudhary</h2>
              <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
            </div>
            <p className="text-gray-400">Premium Member</p>
          </div>
        </div>
        <div className="flex space-x-6 md:space-x-4">
          <div className="text-center">
            <p className="text-white font-medium">Download</p>
            <p className="text-lg font-bold text-white">23</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Like</p>
            <p className="text-lg font-bold text-white">326</p>
          </div>
          <div className="text-center">
            <p className="text-white font-medium">Refer</p>
            <p className="text-lg font-bold text-white">10</p>
          </div>
        </div>
      </div>
      <div>
        <p className="text-white font-medium mb-2">About</p>
        <p className="text-gray-400 text-sm md:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ornare
          pretium placerat ut platea. Purus blandit integer sagittis massa vel
          est hac.
        </p>
      </div>
      <button onClick={handleSubscribe} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Upgrade to Premium
      </button>
    </div>
  );
};

export default ProfileCard;