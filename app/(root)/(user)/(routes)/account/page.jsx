"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const userAccountPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return; // Do nothing while loading
    if (status === 'unauthenticated') {
      router.push('/login'); // Redirect to login if not authenticated
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/account');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Failed to load account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [status]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Account Details</h1>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone Number:</strong> {user.phoneNumber}</p>
        <p><strong>Role:</strong> {user.userRole}</p>
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
    </div>
  );
};

export default userAccountPage;