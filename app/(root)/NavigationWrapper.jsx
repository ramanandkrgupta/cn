"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";

export function NavigationWrapper() {
    const pathname = usePathname();

    // Don't show navigation on dashboard routes
    if (pathname?.startsWith("/dashboard")) {
        return null;
    }

    return <Navigation />;
}
