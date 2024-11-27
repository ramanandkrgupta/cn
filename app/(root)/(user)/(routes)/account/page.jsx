"use client";
import Image from 'next/image';
import React, { useState, useEffect } from "react";
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
  LayoutDashboard
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/login');
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const baseMenuItems = [
    {
      icon: <User size={24} className="text-gray-500" />,
      title: "My Profile",
      onClick: () => router.push('/account/profile'),
    },
    {
      icon: <CreditCard size={24} className="text-gray-500" />,
      title: "Plans",
      onClick: () => router.push('/plans'),
    },
    {
      icon: <FolderUp size={24} className="text-gray-500" />,
      title: "Your Uploads",
      onClick: () => router.push('/account/uploads'),
    },
    {
      icon: <Bell size={24} className="text-gray-500" />,
      title: "Notification",
      onClick: () => router.push('/account/notifications'),
    },
    {
      icon: <Settings size={24} className="text-gray-500" />,
      title: "Settings",
      onClick: () => router.push('/account/settings'),
    },
  ];

  const menuItems = session?.user?.role === "ADMIN" 
    ? [
        {
          icon: <LayoutDashboard size={24} className="text-primary" />,
          title: "Admin Panel",
          onClick: () => router.push('/dashboard'),
        },
        ...baseMenuItems
      ]
    : baseMenuItems;

  if (!session || !userData) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="bg-base-100">
      <div className="mx-auto px-4 min-h-min">
        {/* Profile Header */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image
              src={userData.avatar || "/team/member-1.jpeg"}
              alt="profile"
              width={100}
              height={100}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="text-2xl font-semibold text-secondary mt-1">
            {userData.name}
          </div>
          <div className="text-sm text-gray-500">{userData.email}</div>
          
          {/* User Role Badge */}
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium
              ${userData.userRole === 'PRO' ? 'bg-green-100 text-green-800' : 
                userData.userRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                'bg-blue-100 text-blue-800'}`}>
              {userData.userRole || 'FREE'} User
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-6 space-y-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={item.onClick}
              className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow cursor-pointer hover:bg-base-200 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {item.icon}
                <span className="text-secondary font-medium">{item.title}</span>
              </div>
              <ChevronRight size={24} className="text-gray-500" />
            </div>
          ))}

          {/* Logout Button */}
          <div
            onClick={handleLogout}
            className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow mt-8 cursor-pointer hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center space-x-4 text-red-500">
              <LogOut size={24} />
              <span className="font-medium">Logout</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}