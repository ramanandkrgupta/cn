"use client"
import React, { useState } from 'react';
import { HomeIcon, ArrowUpOnSquareIcon, UserIcon, ShareIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const StickyBottomMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const menuItems = [
    { icon: 'HomeIcon', text: 'Home' },
    { icon: 'UserIcon', text: 'Profile' },
    { icon: 'ArrowUpOnSquareIcon', text: 'Upload' },
    { icon: 'DocumentTextIcon', text: 'Blog' },
    { icon: 'ShareIcon', text: 'Share' }
  ];

  const handleClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="navigation">
      <ul>
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`list ${index === activeIndex ? 'active' : ''}`}
            onClick={() => handleClick(index)}
          >
            <a href="#">
              <span className="icon">
                <IonIcon name={item.icon} />
              </span>
              <span className="text">{item.text}</span>
            </a>
          </li>
        ))}
        <div className="indicator" style={{ transform: `translateX(calc(70px * ${activeIndex}))` }}></div>
      </ul>
    </div>
  );
};

export default StickyBottomMenu;