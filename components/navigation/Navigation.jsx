"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Home, BookMarked, Upload, Wallet, User, Bell, Brain ,Search} from "lucide-react"; // import icons

const Navigation = () => {
  const Menus = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Quiz", icon: Brain, path: "/quiz" },
    { name: "Upload", icon: Upload, path: "/upload" },
    { name: "Search", icon: Search, path: "/search" },
    { name: "Profile", icon: User, path: "/account" },
  ];


  const currentPath = usePathname();


  return (
<>
    <div className="fixed bottom-24 right-5 lg:right-10 flex flex-col items-end gap-3 z-50">
          {/* WhatsApp Button */}
          <div className="flex flex-row items-end gap-3">
          <a 
            href="/whatsapp1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all duration-300 hover:scale-110"
          >
            <FaWhatsapp className="w-6 h-6" />
            <span className="text-sm font-medium">1st year</span>
          </a>
          <a 
            href="/whatsapp2" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700 transition-all duration-300 hover:scale-110"
          >
            <FaWhatsapp className="w-6 h-6" />
            <span className="text-sm font-medium">2nd year</span>
          </a>
          </div>
    
          {/* Instagram Button */}
          <a 
            href="/instagram" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-full shadow-md hover:bg-pink-700 transition-all duration-300 hover:scale-110"
          >
            <FaInstagram className="w-6 h-6" />
            <span className="text-sm font-medium">Follow Instagram</span>
          </a>
        </div>
        


    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg py-3 px-6 rounded-t-xl flex justify-between items-center">
      {Menus.map((menu, i) => {
        const isActive = currentPath === menu.path;
        return (
          <Link href={menu.path} key={i}  aria-label={menu.name} className="flex flex-col items-center">
            <button
              className={`text-2xl ${
                isActive ? "text-primary/80" : "text-seconadry/80"
              }`}
            >
              <menu.icon className="w-6 h-6" aria-label="{menu.name}" /> {/* Icon component */}
            </button>
            <span
              className={`text-xs ${
                isActive ? "text-primary/80" : "text-seconadry/80"
              } mt-1`}
            >
              {menu.name}
            </span>
          </Link>
        );
      })}
    </div>
    </>
  );
};

export default Navigation;