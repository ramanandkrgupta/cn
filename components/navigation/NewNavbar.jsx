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
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900">
      <div className="flex justify-center items-center bg-white rounded-t-lg p-2 w-full h-20">
        <ul className="flex w-full justify-between">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={`relative list-none flex-1 flex justify-center items-center h-full z-10 ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => handleActiveLink(index)}
            >
              <a
                href="#"
                className="flex flex-col items-center justify-center text-center"
              >
                <span
                  className={`block text-2xl transition-transform duration-500 ${
                    activeIndex === index ? "transform -translate-y-2" : ""
                  }`}
                >
                  <IonIcon icon={item.icon} />
                </span>
                <span
                  className={`text-sm font-medium transition-opacity duration-500 ${
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
      </div>
    </div>
  );
};

export default NewNavBar;