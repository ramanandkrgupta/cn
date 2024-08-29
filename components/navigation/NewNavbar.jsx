"use client"
import React, { useState } from 'react';
import { IonIcon } from 'react-ionicons';
import {
  homeOutline,
  folderOutline,
  addCircleOutline,
  personOutline,
  imageOutline,
} from 'ionicons/icons';

const NewNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Default active icon (index 2)

  const menuItems = [
    { icon: homeOutline, name: 'Home' },
    { icon: folderOutline, name: 'Folder' },
    { icon: addCircleOutline, name: 'Add' },
    { icon: personOutline, name: 'Profile' },
    { icon: imageOutline, name: 'Images' },
  ];

  const handleActiveLink = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 text-center max-w-xl mx-auto rounded-t-2xl p-2">
      <div className="flex justify-around">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleActiveLink(index)}
            className={`flex flex-col items-center cursor-pointer transition-transform duration-500 ${
              activeIndex === index
                ? 'transform scale-125 -translate-y-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-full p-2'
                : 'text-gray-700'
            }`}
          >
            <IonIcon icon={item.icon} className="text-3xl" />
            <span className={`text-xs ${activeIndex === index ? 'block' : 'hidden'}`}>
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default NewNavbar;