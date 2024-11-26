"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Bell, 
  Users, 
  FileText, 
  Settings, 
  Home,
  Upload,
  LayoutDashboard,
  LogOut,
  BookOpen
} from "lucide-react";

// Dashboard menu items (for regular users)
const dashboardMenuItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    title: "My Uploads",
    icon: <Upload className="w-5 h-5" />,
    href: "/dashboard/upload",
  },
  {
    title: "My Notes",
    icon: <BookOpen className="w-5 h-5" />,
    href: "/admin",
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
];

// Admin menu items
const adminMenuItems = [
  {
    title: "Admin Panel",
    icon: <LayoutDashboard className="w-5 h-5" />,
    href: "/admin",
  },
  {
    title: "Users",
    icon: <Users className="w-5 h-5" />,
    href: "/admin/users",
  },
  {
    title: "Posts",
    icon: <FileText className="w-5 h-5" />,
    href: "/admin/posts",
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    href: "/admin/notifications",
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/admin/settings",
  },
];

export default function AdminSidebar({ type = "dashboard", collapsed = false }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const menuItems = type === "admin" ? adminMenuItems : dashboardMenuItems;

  return (
    <aside className={`h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full bg-base-200">
        {/* Logo/Brand */}
        <div className="p-4 border-b bg-base-300">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <Home className="w-8 h-8 text-primary" />
            {!collapsed && (
              <h1 className="text-xl font-bold">
                {type === "admin" ? "Admin Panel" : "Dashboard"}
              </h1>
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-content" 
                      : "hover:bg-base-300"
                  }`}
                >
                  <div className={collapsed ? 'mx-auto' : ''}>
                    {item.icon}
                  </div>
                  {!collapsed && <span className="font-medium">{item.title}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t bg-base-300">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
              {session?.user?.name?.[0] || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-base-content/70 truncate">{session?.user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
} 