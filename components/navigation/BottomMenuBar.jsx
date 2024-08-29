"use client"
import React, { useState } from 'react';
import { HomeIcon, ArrowUpOnSquareIcon, UserIcon, ShareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const StickyBottomMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems = [
    { icon: HomeIcon, text: 'Home' },
    { icon: UserIcon, text: 'Profile' },
    { icon: ShareIcon, text: 'Messages' },
    { icon: ArrowUpOnSquareIcon, text: 'Photos' },
    { icon: DocumentTextIcon, text: 'Settings' }
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className={styles.navigation}>
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`${styles.list} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => handleClick(index)}
          >
            <a href="#">
              <span className={styles.icon}>
                <item.icon className="h-6 w-6 text-gray-800" />
              </span>
              <span className={styles.text}>{item.text}</span>
            </a>
          </li>
        ))}
        <div className={styles.indicator} style={{ transform: `translateX(calc(70px * ${activeIndex}))` }}></div>
      </ul>
    </div>
  );
};

export default StickyBottomMenu;