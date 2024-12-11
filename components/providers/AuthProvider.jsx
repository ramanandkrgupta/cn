'use client';

import { SessionProvider } from 'next-auth/react';

const AuthProvider = ({ children }) => {
  return (
    <SessionProvider
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
};

export default AuthProvider; 