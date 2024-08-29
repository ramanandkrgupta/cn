"use client";
import React, { useState } from "react";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  personOutline,
  chatbubbleOutline,
  cameraOutline,
  settingsOutline,
} from "ionicons/icons";

const NewNavBar = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleActiveLink = (index) => {
    setActiveIndex(index);
  };

  const menuItems = [
    { icon: homeOutline, text: "Home" },
    { icon: personOutline, text: "Profile" },
    { icon: chatbubbleOutline, text: "Messages" },
    { icon: cameraOutline, text: "Photos" },
    { icon: settingsOutline, text: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center bg-white rounded-t-lg p-4 shadow-md">
      <ul className="flex w-full justify-between max-w-md mx-auto">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={`relative list-none w-16 h-16 z-10 ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleActiveLink(index)}
          >
            <a href="#" className="flex flex-col items-center justify-center h-full text-center">
              <span className={`block text-3xl transition-transform duration-500 ${activeIndex === index ? 'transform -translate-y-8' : ''}`}>
                <IonIcon icon={item.icon} />
              </span>
              <span className={`absolute text-sm font-medium transition-opacity duration-500 ${activeIndex === index ? 'opacity-100 translate-y-2' : 'opacity-0'}`}>
                {item.text}
              </span>
            </a>
          </li>
        ))}
      </ul>
      <div
        className="absolute top-0 left-0 w-16 h-16 bg-green-500 rounded-full border-8 border-gray-900 transition-transform duration-500"
        style={{ transform: `translateX(${activeIndex * 100}%)`, left: `calc(100% / ${menuItems.length} / 2)` }}
      >
        <div className="absolute top-1/2 left-[-22px] w-5 h-5 bg-transparent rounded-tr-[20px] shadow-[0px_-10px_0_0_#222327]"></div>
        <div className="absolute top-1/2 right-[-22px] w-5 h-5 bg-transparent rounded-tl-[20px] shadow-[0px_-10px_0_0_#222327]"></div>
      </div>
    </div>
  );
};

export default NewNavBar;