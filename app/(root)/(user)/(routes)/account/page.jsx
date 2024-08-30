"use client";

import { Tab } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Navbar from '@/components/navigation/Navbar'; // Adjust the import path
import AccountSidebar from '@/components/user/AccountSidebar'; // Adjust the import path
import { CheckBadgeIcon } from '@heroicons/react/24/outline';
import ChangePassword from '@/components/admin/components/ChangePassword';

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 flex gap-6">
        <AccountSidebar userRole={user.userRole} />
        <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
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
                      <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
                      <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
                      <p className="text-gray-700"><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                      <p className="text-gray-700"><strong>Role:</strong> {user.userRole || 'N/A'}</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <CheckBadgeIcon className="h-24 w-24 text-green-500" />
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