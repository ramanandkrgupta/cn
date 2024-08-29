"use client";
import React, { useState, useEffect } from "react";
import { IonIcon } from "@ionic/react";
import {
  homeOutline,
  personOutline,
  chatbubbleOutline,
  cameraOutline,
  settingsOutline,
} from "ionicons/icons";

const NewNavBar = () => {
  // Set the first item as active by default
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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 md:hidden">
      <div className="relative flex justify-center items-center bg-white rounded-t-lg p-2 w-full">
        <ul className="flex w-full justify-between">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="relative list-none flex-1 z-10"
              onClick={() => handleActiveLink(index)}
            >
              <a
                href="#"
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <span
                  className={`block text-2xl transition-transform duration-300 ${
                    activeIndex === index ? "transform -translate-y-4" : ""
                  }`}
                >
                  <IonIcon icon={item.icon} />
                </span>
                <span
                  className={`absolute text-sm font-medium transition-opacity duration-300 ${
                    activeIndex === index
                      ? "opacity-100 translate-y-2"
                      : "opacity-0"
                  }`}
                >
                  {item.text}
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div
          className="absolute top-0 left-0 w-16 h-16 bg-green-500 rounded-full border-8 border-gray-900 transition-transform duration-500 ease-in-out"
          style={{
            left: `calc(${activeIndex} * 20%)`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute top-1/2 left-[-22px] w-5 h-5 bg-transparent rounded-tr-[20px] shadow-[0px_-10px_0_0_#222327]"></div>
          <div className="absolute top-1/2 right-[-22px] w-5 h-5 bg-transparent rounded-tl-[20px] shadow-[0px_-10px_0_0_#222327]"></div>
        </div>
      </div>
    </div>
  );
};

export default NewNavBar;