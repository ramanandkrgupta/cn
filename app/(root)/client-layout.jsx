"use client";
import { Toaster } from "sonner";
import { Navigation } from "@/components/navigation";
import FloatingAIButton from "@/components/ai/FloatingAIButton";

export default function ClientLayout({ children }) {
  return (
    <>
      <Toaster richColors closeButton position="top-center" />
      <main className="pb-3">{children}</main>
      <Navigation />
      <FloatingAIButton />
    </>
  );
} 