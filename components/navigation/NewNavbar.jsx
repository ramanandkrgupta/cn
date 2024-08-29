"use client"
import React, { useState } from 'react';
import 'ionicons/icons';

const NewNavbar = () => {
  const [activeIndex, setActiveIndex] = useState(2); // Default active icon (index 2)

  const menuItems = [
    { name: 'home-outline' },
    { name: 'folder-outline' },
    { name: 'add-circle-outline' },
    { name: 'person-outline' },
    { name: 'image-outline' },
  ];

  const handleActiveLink = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="bg-gray-200 mx-auto text-center mt-80 max-w-xl rounded-t-2xl p-2">
      {menuItems.map((item, index) => (
        <ion-icon
          key={index}
          name={item.name}
          onClick={() => handleActiveLink(index)}
          className={`text-3xl p-2 transition-transform duration-500 rounded-full ${
            activeIndex === index
              ? 'transform scale-125 -translate-y-4 bg-gradient-to-br from-blue-500 to-purple-500 text-white border-4 border-gray-300'
              : 'border-4 border-gray-200'
          }`}
        ></ion-icon>
      ))}
    </div>
  );
};


export default NewNavbar;