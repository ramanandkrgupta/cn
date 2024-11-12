"use client";
// import React from 'react';
import Image from 'next/image';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  CreditCard,
  FolderUp,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch user data, downloads, and favorites
      // fetchUserData();
      
    }
  }, [status, router]);

  
  const { user } = session;
  return (
    <div className="bg-base-100">
      <div className="mx-auto px-4 min-h-min">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/team/member-1.jpeg"
              alt="profile"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
          <div className="text-2xl font-semibold text-secondary mt-1">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>

        <div className="mt-2 space-y-4">
          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <User size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">My Profile</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <CreditCard size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Plans</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <FolderUp size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Your Uploads</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Bell size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Notification</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Settings size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Settings</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-base-300 rounded-lg shadow mt-8">
            <div className="flex items-center space-x-4 text-red-500">
              <LogOut size={24} className="text-red-500" />
              <span className="font-medium">Logout</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}