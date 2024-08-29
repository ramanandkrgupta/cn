"use client"
import React, { useState } from 'react';
import {
  HomeIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
  ShareIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

const StickyBottomMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { icon: HomeIcon, text: 'Home' },
    { icon: UserIcon, text: 'Profile' },
    { icon: ShareIcon, text: 'Messages' },
    { icon: ArrowUpOnSquareIcon, text: 'Photos' },
    { icon: DocumentTextIcon, text: 'Settings' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-lg z-50">
      <ul className="flex justify-around">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            <button
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center justify-center w-full py-2"
            >
              <item.icon
                className={`h-6 w-6 mb-1 transition-transform ${
                  index === activeIndex ? 'text-green-500 transform -translate-y-2' : 'text-gray-600'
                }`}
              />
              <span
                className={`text-xs transition-opacity ${
                  index === activeIndex ? 'text-green-500 opacity-100' : 'opacity-0'
                }`}
              >
                {item.text}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StickyBottomMenu;