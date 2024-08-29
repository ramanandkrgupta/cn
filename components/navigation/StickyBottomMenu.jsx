"use client"
import React, { useState } from 'react';
import { IonIcon } from 'ionicons';

const StickyBottomMenu = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const menuItems = [
    { icon: 'home-outline', text: 'Home' },
    { icon: 'person-outline', text: 'Profile' },
    { icon: 'chatbubble-outline', text: 'Messages' },
    { icon: 'camera-outline', text: 'Photos' },
    { icon: 'settings-outline', text: 'Settings' }
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