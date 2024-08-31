"use client";

import { Tab } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import ChangePassword from '@/components/admin/components/ChangePassword';
import axios from 'axios';

const Tabs = ["Account Details", "Settings"];

const AccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login'); // Redirect to login if not authenticated
    return null;
  }

  if (!session || !session.user) {
    return <div>No user data found.</div>;
  }

  const { user } = session;

  const handleSubscribe = async () => {
    if (user.userRole === 'PRO') {
      return;
    }
  
    try {
      const order_id = `order_${new Date().getTime()}`;
      const response = await axios.post('https://khilaadixpro.shop/api/create-order', {
        customer_mobile: user.phoneNumber,
        user_token: '4a213056d570c6930f3ee43f44010cfb',
        amount: 1,
        order_id: order_id,
        redirect_url: 'https://v1.collegenotes.tech/payment-success',
        remark1: 'Subscription',
        remark2: 'PRO Plan',
        route: 1
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded' // Ensure the Content-Type matches the PHP implementation
 'Host': 'v1.collegenotes.tech'
        },
        transformRequest: [(data) => {
          return Object.entries(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
        }]
      });
  
      if (response.data.status) {
        window.location.href = response.data.result.payment_url;
      } else {
        console.error('Payment URL creation failed:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto p-1 flex gap-6">
        <div className="flex-1 p-1 rounded-lg shadow-md">
          <Tab.Group>
            <Tab.List className="flex space-x-1 border-b-2">
              {Tabs.map((tab, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    `py-2 px-4 text-lg font-semibold ${
                      selected ? "border-b-4 border-green-500" : "text-gray-500"
                    }`
                  }
                >
                  {tab}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 flex"><strong>Name:</strong> {user.name} <CheckBadgeIcon className="h-5 w-25 text-green-500" /></p>
                      <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                      <p className="text-gray-700"><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                      <p className="text-gray-700"><strong>Plan:</strong> {user.userRole || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {user.userRole === 'MANAGER' || user.userRole === 'ADMIN' ? (
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">Admin Actions</h2>
                    <p className="text-gray-700">Here you can add admin-specific actions and details.</p>
                  </div>
                ) : (
                  <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-bold mb-4">User Actions</h2>
                    <p className="text-gray-700">Here you can add user-specific actions and details.</p>
                  </div>
                )}

                <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Plan Subscription</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700"><strong>FREE:</strong> Basic access with limited features.</p>
                      <p className="text-gray-700"><strong>PRO:</strong> Full access with premium features for <strong>49rs</strong>.</p>
                      {user.userRole === 'PRO' ? (
                        <button className="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg" disabled>You already subscribed</button>
                      ) : (
                        <button onClick={handleSubscribe} className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg">Subscribe</button>
                      )}
                    </div>
                  </div>
                </div>
              </Tab.Panel>
              <Tab.Panel>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm space-y-6">
                  <ChangePassword sessionData={user.email} />
                </div>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;