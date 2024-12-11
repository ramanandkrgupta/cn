"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";
import {
  User,
  CreditCard,
  FolderUp,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  LayoutDashboard,
  Crown,
  Star,
  Sparkles,
  Zap,
  Shield,
  Gift,
  Download,
  BookMarked,
  Bot,
  History,
  Check,
} from "lucide-react";
import AppVersion from "@/app/(root)/(home)/(routes)/about/components/AppVersion";
import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";

// Dynamically import AppVersion with no SSR
// const AppVersion =  import("@/app/(root)/(home)/(routes)/about/components/AppVersion");

// Add stats for the profile
const getProfileStats = (userData) => ({
  uploads: userData?.uploads || 0,
  downloads: userData?.downloads || 0,
  reputation: userData?.reputation || 0,
});

// Enhanced menu items with badges and descriptions
const getMenuItems = (router, userRole, session) => {
  const baseMenuItems = [
    {
      icon: <User size={24} className="text-gray-500" />,
      title: "My Profile",
      description: "Manage your personal information",
      path: "/account/profile",
    },
    {
      icon: <CreditCard size={24} className="text-gray-500" />,
      title: "Plans",
      description:
        userRole === "PRO" ? "Manage your PRO subscription" : "Upgrade to PRO",
      path: "/account/plans",
      badge:
        userRole === "PRO" ? (
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
            <Crown size={12} /> PRO
          </span>
        ) : (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
            Upgrade
          </span>
        ),
    },
    {
      icon: <FolderUp size={24} className="text-gray-500" />,
      title: "Your Uploads",
      description: "Manage your uploaded content",
      path: "/account/uploads",
      badge:
        session?.uploads > 0 ? (
          <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
            {session.uploads} files
          </span>
        ) : null,
    },
    {
      icon: <Bell size={24} className="text-gray-500" />,
      title: "Notification",
      description: "Manage your notifications",
      path: "/account/notifications",
      badge:
        session?.notifications > 0 ? (
          <span className="px-2 py-1 bg-error/10 text-error text-xs rounded-full">
            {session.notifications} new
          </span>
        ) : null,
    },
    {
      icon: <Settings size={24} className="text-gray-500" />,
      title: "Settings",
      description: "Customize your experience",
      path: "/account/settings",
    },
  ];

  return userRole === "ADMIN"
    ? [
        {
          icon: <LayoutDashboard size={24} className="text-primary" />,
          title: "Admin Panel",
          description: "Manage site content and users",
          path: "/dashboard",
          badge: (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              Admin
            </span>
          ),
        },
        ...baseMenuItems,
      ]
    : baseMenuItems;
};

// Add these new menu items for PRO users
const getProMenuItems = (userRole) => {
  if (userRole !== "PRO") return [];

  return [
    {
      icon: <Download size={24} className="text-primary" />,
      title: "Batch Download",
      description: "Download multiple files at once",
      path: "/account/batch-download",
      badge: (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
          PRO
        </span>
      ),
    },
    {
      icon: <BookMarked size={24} className="text-primary" />,
      title: "Study Collections",
      description: "Create and share study materials collections",
      path: "/account/collections",
      badge: (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
          PRO
        </span>
      ),
    },
    {
      icon: <Bot size={24} className="text-primary" />,
      title: "AI Study Assistant",
      description: "Get help with your studies using AI",
      path: "/account/ai-assistant",
      badge: (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
          PRO
        </span>
      ),
    },
    {
      icon: <History size={24} className="text-primary" />,
      title: "Revision Tracker",
      description: "Track your study progress",
      path: "/account/revision-tracker",
      badge: (
        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
          PRO
        </span>
      ),
    },
  ];
};

// Add PRO benefits section for non-PRO users
const ProBenefitsTeaser = ({ onUpgrade, session }) => {
  if (session?.user?.role === "PRO") return null;

  return (
    <div className="mb-4 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/10">
      <h3 className="text-sm font-medium text-primary flex items-center gap-2">
        <Crown size={16} />
        PRO FEATURES
      </h3>
      <ul className="mt-3 space-y-2">
        <li className="flex items-center gap-2 text-sm">
          <Check size={14} className="text-primary" />
          Unlimited downloads & collections
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check size={14} className="text-primary" />
          AI-powered study assistant
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check size={14} className="text-primary" />
          Advanced revision tracking
        </li>
        <li className="flex items-center gap-2 text-sm">
          <Check size={14} className="text-primary" />
          Premium study materials
        </li>
      </ul>
      <button
        onClick={onUpgrade}
        className="mt-4 w-full btn btn-primary btn-sm"
      >
        Upgrade to PRO
      </button>
    </div>
  );
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

// Add MenuItem component
const MenuItem = ({ item, router }) => (
  <button
    onClick={() => router.push(item.path)}
    className="w-full flex items-center justify-between p-4 bg-base-300 hover:bg-base-200 rounded-xl shadow-sm transition-all duration-200 group border border-transparent hover:border-primary/10"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-base-200 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
        {item.icon}
      </div>
      <div>
        <span className="text-secondary font-medium block">{item.title}</span>
        <span className="text-xs text-gray-500">{item.description}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      {item.badge}
      <ChevronRight
        size={18}
        className="text-gray-500 group-hover:transform group-hover:translate-x-1 transition-transform"
      />
    </div>
  </button>
);

// Add ProFeaturesSection component
const ProFeaturesSection = ({ items, router }) => (
  <div className="mb-4">
    <h3 className="text-sm font-medium text-primary flex items-center gap-2 px-2 mb-2">
      <Crown size={14} />
      PRO FEATURES
    </h3>
    <div className="space-y-2">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => router.push(item.path)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 rounded-xl shadow-sm transition-all duration-200 group border border-primary/10"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {item.icon}
            </div>
            <div>
              <span className="text-secondary font-medium block">
                {item.title}
              </span>
              <span className="text-xs text-gray-500">{item.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {item.badge}
            <ChevronRight
              size={18}
              className="text-gray-500 group-hover:transform group-hover:translate-x-1 transition-transform"
            />
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { userData, isLoading: storeLoading } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  // Use userData from Zustand store
  useEffect(() => {
    if (userData) {
      setIsLoading(false);
    }
  }, [userData]);

  // Early return for loading state
  if (isLoading || storeLoading || status === "loading") {
    return <SkeletonLoading />;
  }

  // Early return for unauthenticated users
  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  // Get user role from Zustand store or session
  const userRole = userData?.userRole || userData?.role || session?.user?.role;

  // Get stats from userData
  const stats = getProfileStats(userData || session);

  // Get menu items with updated role
  const menuItems = getMenuItems(router, userRole, {
    ...session,
    user: {
      ...session?.user,
      role: userRole,
    },
  });

  // Get pro menu items with updated role
  const proMenuItems = getProMenuItems(userRole);

  // Add logout handler
  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="bg-base-100 min-h">
      <div className="mx-auto px-4 max-w-lg py-6">
        {/* Enhanced Profile Card */}
        <div className="block mt-4 p-6 bg-base-300 rounded-lg shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-base-200">
                <Image
                  src={userData?.avatar || "/icons/icon.png"}
                  alt="profile"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  priority
                  loading="eager"
                  onError={(e) => {
                    e.target.src = "/icons/icon.png";
                  }}
                />
              </div>
              {userData?.role === "PRO" && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Crown size={14} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-secondary">
                {userData?.name || session?.user?.name}
              </div>
              <div className="text-sm text-gray-500">
                {userData?.email || session?.user?.email}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1
                  ${
                    userRole === "PRO"
                      ? "bg-primary/10 text-primary"
                      : userRole === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {userRole === "PRO" && <Sparkles size={12} />}
                  {userRole || "FREE"} User
                </span>
                {userRole === "PRO" && (
                  <span className="text-xs text-gray-500">Lifetime</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-base-200 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.uploads}
              </div>
              <div className="text-xs text-gray-500">Uploads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">
                {stats.downloads}
              </div>
              <div className="text-xs text-gray-500">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {stats.reputation}
              </div>
              <div className="text-xs text-gray-500">Reputation</div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="mt-6 space-y-4">
          {/* Account Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">
              ACCOUNT
            </h3>
            <div className="space-y-2">
              {menuItems.slice(0, 2).map((item, index) => (
                <MenuItem key={index} item={item} router={router} />
              ))}
            </div>
          </div>

          {/* PRO Features Section - Only show if user is PRO */}
          {userRole === "PRO" && (
            <ProFeaturesSection items={proMenuItems} router={router} />
          )}

          {/* Show PRO Benefits Teaser for non-PRO users */}
          {userRole !== "PRO" && (
            <ProBenefitsTeaser
              onUpgrade={() => router.push("/account/plans")}
            />
          )}

          {/* Content Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">
              CONTENT
            </h3>
            <div className="space-y-2">
              {menuItems.slice(2, 3).map((item, index) => (
                <MenuItem key={index} item={item} router={router} />
              ))}
            </div>
          </div>

          {/* Preferences Section */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 px-2 mb-2">
              PREFERENCES
            </h3>
            <div className="space-y-2">
              {menuItems.slice(3).map((item, index) => (
                <MenuItem key={index} item={item} router={router} />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 bg-base-300 rounded-xl shadow-sm cursor-pointer hover:bg-red-50 transition-all duration-200 group border border-transparent hover:border-red-200"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut size={20} className="text-red-500" />
            </div>
            <div>
              <span className="font-medium block text-red-500">Logout</span>
              <span className="text-xs text-gray-500">
                Sign out of your account
              </span>
            </div>
          </div>
          <ChevronRight
            size={18}
            className="text-gray-500 group-hover:transform group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
      <AppVersion />
    </div>
  );
}
