"use client";
import { Navbar, Sidebar } from "@/components/navigation";
import { ProtectedLayout } from "@/components/layouts/protectLayouts";
import Script from "next/script";

export default function AccountLayout({ children }) {
  return (
  
    <ProtectedLayout>
    <section>
      <div className="relative sm:p-8 p-4  flex flex-row">
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>
        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />
          {children}
          <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
          
        </div>

      </div>
      
    </section>
    </ProtectedLayout>
  );
}