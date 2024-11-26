"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        {paths.slice(1).map((path, index) => (
          <li key={path}>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/${paths.slice(0, index + 2).join('/')}`}>
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
} 