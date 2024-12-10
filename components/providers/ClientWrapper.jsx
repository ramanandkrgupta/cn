"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientWrapper({ children, requirePro = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (requirePro && session?.user?.role !== "PRO") {
      router.push("/account/plans");
    }
  }, [status, session, router, requirePro]);

  if (status === "loading") return null;
  if (status === "unauthenticated") return null;
  if (requirePro && session?.user?.role !== "PRO") return null;

  return <>{children}</>;
} 