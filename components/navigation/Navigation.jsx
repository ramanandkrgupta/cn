"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-base-100 shadow-lg py-3 px-6 rounded-t-xl flex justify-between items-center">
      {Menus.map((menu, i) => {
        const isActive = currentPath === menu.path;
        return (
          <Link href={menu.path} key={i} className="flex flex-col items-center">
            <button
              className={`text-2xl ${
                isActive ? "text-primary/80" : "text-seconadry/80"
              }`}
            >
              <menu.icon className="w-6 h-6" /> {/* Icon component */}
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
  );
};

export default Navigation;