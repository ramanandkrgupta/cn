"use client"
import React from 'react';
import { useRouter } from 'next/navigation';  // Correct import
import { HomeIcon, ArrowUpOnSquareIcon, UserIcon, ShareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const BottomMenuBar = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { name: 'Blog', icon: DocumentTextIcon, path: '/blog' },
    { name: 'Share', icon: ShareIcon, path: '/share' },
    { name: 'Home', icon: HomeIcon, path: '/' },
    { name: 'Upload', icon: ArrowUpOnSquareIcon, path: '/upload' },
    { name: 'Account', icon: UserIcon, path: '/account' },
  ];

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white flex justify-between items-center pr-10 pl-10 py-2 shadow-lg z-10">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPath === item.path;
        return (
          <div
            key={item.name}
            className={`flex flex-col items-center cursor-pointer ${isActive ? 'bg-gray-700' : ''}`}
            onClick={() => router.push(item.path)}
          >
            <Icon className="h-6 w-6" />
            <span className={`text-xs ${isActive ? 'font-bold' : ''}`}>{item.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomMenuBar;