'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useUserStore from '@/store/useUserStore';
import { initializeUserData } from '@/store/useUserStore';

const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const setUserData = useUserStore(state => state.setUserData);

  useEffect(() => {
    if (session?.user) {
      initializeUserData();
    }
  }, [session]);

  return children;
};

export default UserProvider; 