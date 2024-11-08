"use client"
import React, { useState } from 'react';
import {
  HomeIcon,
  ArrowUpOnSquareIcon,
  UserIcon,
  ShareIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import {House, CircleUser, FileUp, Hexagon, BookMarked} from 'lucide-react'

const StickyBottomMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { icon: House, text: 'Home', },
    { icon: BookMarked, text: 'Your Library' },
    { icon: FileUp, text: 'Upload Notes' },
    { icon: Hexagon, text: 'Earn Coins' },
    { icon: CircleUser, text: 'Profile' },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-[#1c1c24] shadow-lg rounded-t-lg z-50">
      <ul className="flex justify-around">
        {menuItems.map((item, index) => (
          <li key={index} className="w-full">
            <button
              onClick={() => setActiveIndex(index)}
              className="flex flex-col items-center justify-center w-full py-2"
            >
              <item.icon
                className={`h-6 w-6 mb-1 transition-transform ${
                  index === activeIndex ? 'text-primary transform -translate-y-2' : 'text-white'
                }`}
              />
              <span
                className={`text-xs transition-opacity ${
                  index === activeIndex ? 'text-primary opacity-100' : 'opacity-0'
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