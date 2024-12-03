"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen,
  Settings,
  Bell,
  ArrowLeft,
  LogOut,
  ShieldCheck
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard"
  },
  {
    title: "Users",
    icon: <Users className="w-5 h-5" />,
    href: "/dashboard/users"
  },
  {
    title: "Documents",
    icon: <FileText className="w-5 h-5" />,
    href: "/dashboard/posts"
  },
  {
    title: "Subjects",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/dashboard/subjects"
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    href: "/dashboard/notifications"
  },
  {
    title: "Moderation",
    icon: <ShieldCheck className="w-5 h-5" />,
    href: "/dashboard/moderation"
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings"
  },
  {
    title: "Back to Home",
    icon: <ArrowLeft className="w-5 h-5" />,
    href: "/"
  }
];

export default function DashboardSidebar({ user, collapsed = false }) {
  const pathname = usePathname();

  return (
    <div className={`h-full bg-base-200 ${collapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="flex flex-col h-full">
        {/* Logo/Brand */}
        <div className="p-4 border-b bg-base-300">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <LayoutDashboard className="w-8 h-8 text-primary" />
            {!collapsed && (
              <h1 className="text-xl font-bold">Admin Panel</h1>
            )}
          </div>
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
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-content" 
                      : "hover:bg-base-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </div>
                  {!collapsed && isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary-content" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t bg-base-300">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
              {user?.name?.[0] || 'A'}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{user?.name}</p>
                <p className="text-xs text-base-content/70 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => signOut()}
              className="btn btn-ghost btn-block mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 