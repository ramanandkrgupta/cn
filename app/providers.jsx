"use client";

import { SessionProvider } from "next-auth/react";

export function AuthProvider({ children }) {
    return (
        <SessionProvider 
            refetchInterval={0} // Disable automatic refetching
            refetchOnWindowFocus={false} // Disable refetch on window focus
        >
            {children}
        </SessionProvider>
    );
}