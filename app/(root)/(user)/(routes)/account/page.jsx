"use client";

import { toast } from "sonner";
import { Tab } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import ChangePassword from '@/components/admin/components/ChangePassword';
import ProfileCard from './ProfileCard';
import axios from 'axios';
import { useState } from 'react';
import Radio, { RadioGroup } from '@/components/Radio.jsx';
import Plan from '@/components/Plan.jsx';
import { BadgePercent, Sparkle, Gem, Crown, ArrowRight } from 'lucide-react';

const Tabs = ["Account Details", "Settings"];

const AccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState("");

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
      const order_id = `order${new Date().getTime()}`;
      const data = {
        customer_mobile: user.phoneNumber,
        user_token: '271a4848bbd962e07b62466ec7fec8ae',
        amount: '1',
        order_id: order_id,
        redirect_url: 'https://v1.collegenotes.tech/account',
        remark1: 'Subscription',
        remark2: 'PRO Plan',
        route: '1'
      };

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/user/create-order',
        headers: { 
          'Access-Control-Allow-Origin': '*/*', 
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      };

      const response = await axios.request(config);

      if (response.data.status) {
        toast.success("Order created successfully! Redirecting to payment...");
        window.location.href = response.data.result.payment_url;
      } else {
        console.error('Payment URL creation failed:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data.message);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div className="min-h-screen">
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
            <ProfileCard />
            <Tab.Panels className="mt-6">
              <Tab.Panel>
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Account Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-700 flex">
                        <strong>Name:</strong> {user.name} 
                        <CheckBadgeIcon className="h-5 w-5 text-green-500 ml-2" />
                      </p>
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
                  <h2 className="text-2xl font-bold mb-4">Choose Your Plan</h2>
                  <RadioGroup value={plan} onChange={(e) => setPlan(e.target.value)}>
                    <div className="flex gap-4 flex-col">
                      <Radio value="free">
                        <Plan
                          icon={<BadgePercent />}
                          title="Free"
                          features={["SD (480p)", "Mobile", "Ads"]}
                          price={0}
                        />
                      </Radio>
                      <Radio value="basic">
                        <Plan
                          icon={<Sparkle />}
                          title="Basic"
                          features={["HD (720p)", "1 Device"]}
                          price={4.99}
                        />
                      </Radio>
                      <Radio value="standard">
                        <Plan
                          icon={<Gem />}
                          title="Standard"
                          features={["Full HD (1080p)", "2 Devices"]}
                          price={9.99}
                        />
                      </Radio>
                      <Radio value="premium">
                        <Plan
                          icon={<Crown />}
                          title="Premium"
                          features={["Ultra HD (4K) + HDR", "4 Devices"]}
                          price={14.99}
                        />
                      </Radio>
                    </div>
                  </RadioGroup>
                  <button
                    className="mt-4 flex gap-4 items-center px-6 py-3 rounded-lg bg-violet-800 hover:bg-violet-700 font-semibold text-lg text-white"
                    onClick={handleSubscribe}
                  >
                    Proceed with {plan} plan
                    <ArrowRight />
                  </button>
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