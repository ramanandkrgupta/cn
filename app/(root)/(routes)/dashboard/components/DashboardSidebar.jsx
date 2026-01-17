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
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

const menuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: "/dashboard"
  },
  {
    title: "Users",
    icon: <Users className="w-4 h-4" />,
    href: "/dashboard/users"
  },
  {
    title: "Payments",
    icon: <Briefcase className="w-4 h-4" />, // Reusing Briefcase or any suitable icon
    href: "/dashboard/payments"
  },
  {
    title: "Documents",
    icon: <FileText className="w-4 h-4" />,
    href: "/dashboard/posts"
  },
  {
    title: "Subjects",
    icon: <BookOpen className="w-4 h-4" />,
    href: "/dashboard/subjects"
  },
  {
    title: "Notifications",
    icon: <Bell className="w-4 h-4" />,
    href: "/dashboard/notifications"
  },
  {
    title: "Moderation",
    icon: <ShieldCheck className="w-4 h-4" />,
    href: "/dashboard/moderation"
  },
  {
    title: "Settings",
    icon: <Settings className="w-4 h-4" />,
    href: "/dashboard/settings"
  },
  // inters
  {
    title: "Internships",
    icon: <Briefcase className="w-4 h-4" />,
    href: "/dashboard/internships"
  },
  {
    title: "Back to Home",
    icon: <ArrowLeft className="w-4 h-4" />,
    href: "/"
  }
];

export default function DashboardSidebar({ user, collapsed = false, setCollapsed }) {
  const pathname = usePathname();

  return (
    <div className={`h-full flex flex-col bg-base-100 border-r border-base-200 ${collapsed ? 'items-center' : ''}`}>
      {/* Logo/Brand */}
      <div className="h-14 flex items-center px-4 border-b border-base-200">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center w-full' : 'w-full justify-between'}`}>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg tracking-tight">Nexus</span>
            )}
          </div>
          {!collapsed && setCollapsed && (
            <button onClick={() => setCollapsed(!collapsed)} className="btn btn-ghost btn-square btn-xs hidden lg:flex">
              <ChevronLeft className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${collapsed ? 'justify-center px-2' : 'px-3'} py-2 rounded-md transition-colors ${isActive
                  ? "bg-base-200 text-primary font-medium"
                  : "text-base-content/70 hover:bg-base-100 hover:text-base-content"
                  }`}
                title={collapsed ? item.title : ""}
              >
                <div className={`${collapsed ? '' : 'mr-3'}`}>
                  {item.icon}
                </div>
                {!collapsed && <span className="text-sm">{item.title}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info / Collapse Toggle for Mobile logic if needed, or footer */}
      <div className="p-2 border-t border-base-200 bg-base-50">
        {/* Toggle button for collapsed state if no header button */}
        {collapsed && setCollapsed && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-square btn-xs w-full mb-2 hidden lg:flex items-center justify-center"
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}

        <div className={`flex items-center gap-2 ${collapsed ? 'justify-center flex-col' : 'px-2 py-1'}`}>
          <div className="avatar placeholder">
            <div className="w-8 h-8 rounded bg-neutral text-neutral-content flex items-center justify-center">
              <span className="text-sm font-medium">{user?.name?.[0] || 'A'}</span>
            </div>
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="font-medium text-xs truncate">{user?.name}</p>
              <p className="text-[10px] text-base-content/50 truncate font-mono">{user?.email}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={() => signOut()} className="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-error" title="Logout">
              <LogOut className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}