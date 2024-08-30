"use client";

import { Tab } from "@headlessui/react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import AddSubject from '@/components/admin/components/AddSubject';
import ShowData from '@/components/admin/components/ShowData';
import ChangePassword from '@/components/admin/components/ChangePassword';

const Tabs = ["Account Details", "Playground", "Show Data"];

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
    <div className="container mx-auto p-4">
      <Tab.Group>
        <Tab.List className="flex space-x-1 sm:w-2/5">
          {Tabs.map((tab, index) => (
            <Tab
              key={index}
              className={({ selected }) =>
                `w-full py-2.5 text-base font-semibold text-white outline-none ${
                  selected && "border-b-4 border-green-400 "
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-3">
          <Tab.Panel>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone Number:</strong> {session.user.phoneNumber} || Na</p>
              <p><strong>Role:</strong> {session.user.userRole} || Na</p>
            </div>

            {user.userRole === 'MANAGER' || user.userRole === 'ADMIN' ? (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">Admin Actions</h2>
                <p>Here you can add admin-specific actions and details.</p>
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">User Actions</h2>
                <p>Here you can add user-specific actions and details.</p>
              </div>
            )}
          </Tab.Panel>
          <Tab.Panel>
            <div className="space-y-3">
              <AddSubject userEmail={user.email} />
              <ChangePassword sessionData={user.email} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <ShowData userID={user.sub} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AccountPage;