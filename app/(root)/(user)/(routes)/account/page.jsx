"use client";
import dynamic from 'next/dynamic';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import {
  User,
  CreditCard,
  FolderUp,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import AppVersion from '@/app/(root)/(home)/(routes)/about/components/AppVersion';

// Dynamically import AppVersion with no SSR
// const AppVersion =  import("@/app/(root)/(home)/(routes)/about/components/AppVersion");
  

// Memoized menu items to prevent unnecessary re-renders
const getMenuItems = (router, userRole) => {
  const baseMenuItems = [
    {
      icon: <User size={24} className="text-gray-500" />,
      title: "My Profile",
      path: "/account/profile",
    },
    {
      icon: <CreditCard size={24} className="text-gray-500" />,
      title: "Plans",
      path: "/account/plans",
    },
    {
      icon: <FolderUp size={24} className="text-gray-500" />,
      title: "Your Uploads",
      path: "/account/uploads",
    },
    {
      icon: <Bell size={24} className="text-gray-500" />,
      title: "Notification",
      path: "/account/notifications",
    },
    {
      icon: <Settings size={24} className="text-gray-500" />,
      title: "Settings",
      path: "/account/settings",
    },
  ];

  return userRole === "ADMIN"
    ? [
        {
          icon: <LayoutDashboard size={24} className="text-primary" />,
          title: "Admin Panel",
          path: "/dashboard",
        },
        ...baseMenuItems,
      ]
    : baseMenuItems;
};

// Skeleton component optimized
const SkeletonLoading = () => (
  <div className="animate-pulse space-y-6">
    <div className="block mt-4 p-4 bg-base-300 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-600"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-3 bg-gray-600 rounded w-3/4"></div>
          <div className="h-3 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 bg-base-300 rounded-lg"></div>
      ))}
    </div>
  </div>
);

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  // Early return for loading state
  if (isLoading) {
    return (
      <div className="bg-base-100 min-h">
        <div className="mx-auto px-4 max-w-lg py-6">
          <SkeletonLoading />
        </div>
      </div>
    );
  }

  // Early return for unauthenticated users
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const menuItems = getMenuItems(router, session?.user?.role);

  return (
    <div className="bg-base-100 min-h">
      <div className="mx-auto px-4 max-w-lg py-6">
        {/* Profile Card */}
        <div className="block mt-4 p-4 bg-base-300 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-base-200">
              <Image
                src={session?.user?.avatar || '/icons/icon.png'}
                alt="profile"
                width={64}
                height={64}
                className="object-cover w-full h-full"
                priority
                loading="eager"
              />
            </div>
            <div>
              <div className="text-lg font-semibold text-secondary">
                {session?.user?.name}
              </div>
              <div className="text-sm text-gray-500">{session?.user?.email}</div>
              <span
                className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block
                  ${
                    session?.user?.role === 'PRO'
                      ? 'bg-green-100 text-green-800'
                      : session?.user?.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
              >
                {session?.user?.role || 'FREE'} User
              </span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-3">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center justify-between p-3 bg-base-300 rounded-lg shadow cursor-pointer hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {item.icon}
                <span className="text-secondary font-medium">{item.title}</span>
              </div>
              <ChevronRight size={24} className="text-gray-500" />
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 bg-base-300 rounded-lg shadow mt-6 cursor-pointer hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center space-x-4 text-red-500">
              <LogOut size={24} />
              <span className="font-medium">Logout</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </button>
        </div>
      </div>
      <AppVersion />
    </div>
  );
}
