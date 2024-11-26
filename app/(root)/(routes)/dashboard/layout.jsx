"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen,
  Settings,
  Menu,
  X,
  LogOut,
  Bell
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

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
      title: "Settings",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-circle btn-ghost"
        >
          {isSidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-base-200 hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="p-4 border-b bg-base-300">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300 transition-colors"
                >
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t bg-base-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
                {session.user.name?.[0] || 'U'}
              </div>
              <div className="flex-1">
                <p className="font-medium truncate">{session.user.name}</p>
                <p className="text-xs text-base-content/70 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="btn btn-ghost btn-block mt-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />

          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-screen w-64 bg-base-200">
            <div className="flex flex-col h-full">
              {/* Logo/Brand */}
              <div className="p-4 border-b bg-base-300">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>

              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-base-300 transition-colors"
                    >
                      {item.icon}
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  ))}
                </div>
              </nav>

              {/* User Info */}
              <div className="p-4 border-t bg-base-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content">
                    {session.user.name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium truncate">{session.user.name}</p>
                    <p className="text-xs text-base-content/70 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="btn btn-ghost btn-block mt-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
} 