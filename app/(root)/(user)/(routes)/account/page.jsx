import React from 'react';
import Image from 'next/image';
import {
  User,
  CreditCard,
  MapPin,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Profile() {
  return (
    <div className="bg-base-100">
      <div className="mx-auto px-4 min-h-min">
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg">
            <Image
              src="/img/profile.jpg"
              alt="profile"
              width={150}
              height={150}
              className="object-cover"
            />
          </div>
          <div className="text-2xl font-semibold text-secondary mt-4">Carter Schleifer</div>
          <div className="text-sm text-gray-500">ID 12012010</div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <User size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">My Profile</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <CreditCard size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Saldo</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Address</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Bell size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Notification</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <Settings size={24} className="text-gray-500" />
              <span className="text-secondary font-medium">Settings</span>
            </div>
            <ChevronRight size={24} className="text-gray-500" />
          </div>

          <div className="flex items-center justify-between p-4 bg-base-300 rounded-lg shadow mt-8">
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