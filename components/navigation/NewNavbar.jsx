"use client"
// components/StickyNavbar.js
import { useState } from 'react';
import { HomeIcon, ReceiptRefundIcon, PlusCircleIcon, BellIcon, UserIcon } from '@heroicons/react/24/outline';

const NewNavbar = () => {
    const [activeIndex, setActiveIndex] = useState(0); // default active is the third item

    const menuItems = [
        { title: 'Home', icon: HomeIcon },
        { title: 'Receipt', icon: ReceiptRefundIcon },
        { title: 'Add', icon: PlusCircleIcon },
        { title: 'Noti', icon: BellIcon },
        { title: 'Account', icon: UserIcon },
    ];

    const handleItemClick = (index) => {
        setActiveIndex(index);
    };

    return (
        <div className="fixed bottom-0 left-0 w-full bg-indigo-800 h-20 flex items-center justify-around shadow-lg rounded-t-2xl z-50">
            {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = index === activeIndex;
                
                return (
                    <div
                        key={index}
                        className={`relative flex flex-col items-center text-center cursor-pointer transition-transform duration-500 ${isActive ? 'transform -translate-y-3 text-white' : 'text-indigo-400'}`}
                        onClick={() => handleItemClick(index)}
                    >
                        <Icon className={`h-7 w-7 ${isActive ? 'text-white' : 'text-indigo-400'}`} />
                        {isActive && <span className="text-sm mt-1">{item.title}</span>}
                    </div>
                );
            })}
        </div>
    );
};


export default NewNavbar;