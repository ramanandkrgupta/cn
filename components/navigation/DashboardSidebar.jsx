"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bell, 
  Users, 
  FileText, 
  Settings, 
  Home 
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    href: "/dashboard/notifications",
  },
  {
    title: "Users",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/users",
  },
  {
    title: "Posts",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/posts",
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen sticky top-0">
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-content" 
                      : "hover:bg-base-300"
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <p className="text-sm text-gray-500">© 2024 Admin Panel</p>
        </div>
      </div>
    </aside>
  );
} 