"use client";

import { toast } from "sonner";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import ChangePassword from '@/components/admin/components/ChangePassword';
import ProfileCard from './ProfileCard';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Radio, { RadioGroup } from '@/components/Radio.jsx';
import Plan from '@/components/Plan.jsx';
import { BadgePercent, Sparkle, Gem, Crown, ArrowRight } from 'lucide-react';

const AccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [plan, setPlan] = useState("premium");

  useEffect(() => {
    if (session && session.user) {
      setPlan(session.user.userRole === 'free' ? 'premium' : session.user.userRole);
    }
  }, [session]);

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
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
    if (plan === 'free') {
      toast.info("You are already subscribed to the free plan.");
      return;
    }

    try {
      const order_id = `order${new Date().getTime()}`;
      const data = {
        customer_mobile: user.phoneNumber,
        amount: plan === 'premium' ? '1' : '0',
        order_id,
        redirect_url: 'https://v1.collegenotes.tech/account',
        remark1: 'Subscription',
        remark2: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
        route: '1'
      };

      const response = await axios.post('/api/user/create-order', data);

      if (response.data.status) {
        toast.success("Order created successfully! Redirecting to payment...");
        window.location.href = response.data.result.payment_url;
      } else {
        toast.error("Failed to create payment URL: " + response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred during subscription.");
      console.error('Error:', error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-1 flex gap-6">
        <div className="flex-1 p-1 rounded-lg shadow-md">
          <ProfileCard />

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

                <Radio value="premium">
                  <Plan
                    icon={<Crown />}
                    title="Premium"
                    features={["Access All Content", "Premium Support", "Early Access"]}
                    price={49}
                  />
                </Radio>
              </div>
            </RadioGroup>
            <button
              className={`mt-4 flex gap-4 items-center px-6 py-3 rounded-lg ${plan === 'free' ? 'bg-gray-500' : 'bg-violet-800 hover:bg-violet-700'} font-semibold text-lg text-white`}
              onClick={handleSubscribe}
              disabled={plan === 'free'}
            >
              {plan === 'free' ? 'Already Subscribed' : `Proceed with ${plan} plan`}
              <ArrowRight />
            </button>
          </div>

          <div className="mt-8 bg-[#2c2f32] p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            <ChangePassword sessionData={user.email} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;