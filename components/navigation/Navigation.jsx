"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Home, BookMarked, Upload, Wallet, User, Bell, Brain, Search } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Floating Social Buttons */}
      <div className="fixed bottom-20 right-4 lg:right-6 flex flex-col items-end gap-2 z-50">
        <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          <a
            href="/whatsapp1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110"
            onClick={() => setIsMenuOpen(false)}
            aria-label="1st Year WhatsApp"
          >
            <span className="text-sm font-medium">1st</span>
          </a>
          <a
            href="/whatsapp2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-all hover:scale-110"
            onClick={() => setIsMenuOpen(false)}
            aria-label="2nd Year WhatsApp"
          >
            <span className="text-sm font-medium">2nd</span>
          </a>
          <a
            href="/instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-12 h-12 bg-pink-600 text-white rounded-full shadow-lg hover:bg-pink-700 transition-all hover:scale-110"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>

        {/* Main Floating Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center justify-center w-14 h-14 bg-primary rounded-full shadow-xl hover:bg-primary/90 transition-all"
          aria-label="Social media links"
        >
          <FaWhatsapp className={`w-6 h-6 text-white transition-transform ${isMenuOpen ? 'rotate-45 scale-0' : 'rotate-0 scale-100'}`} />
          <span className={`absolute text-2xl text-white transition-transform ${isMenuOpen ? 'rotate-0 scale-100' : 'rotate-45 scale-0'}`}>×</span>
        </button>
      </div>

      {/* Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg py-3 px-6 rounded-t-xl flex justify-between items-center">
        {Menus.map((menu, i) => {
          const isActive = currentPath === menu.path;
          return (
            <Link href={menu.path} key={i} aria-label={menu.name} className="flex flex-col items-center">
              <button
                className={`text-2xl ${isActive ? "text-primary/80" : "text-secondary/80"}`}
              >
                <menu.icon className="w-6 h-6" />
              </button>
              <span
                className={`text-xs ${isActive ? "text-primary/80" : "text-secondary/80"} mt-1`}
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