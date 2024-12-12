"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navlinks } from "@/constants";
import { nm } from "@/public/icons";
import Icon from "../ui/Icon";
import ShareDialogBox from "../models/ShareDialogBox";
import { Sun, Moon } from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("mydark");

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "mylight" ? "mydark" : "mylight";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "mydark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <aside className="flex justify-between items-center flex-col sticky top-5 h-[89vh]">
      <Link href="/">
        <Icon styles="w-[60px] h-[60px] bg-neutral" imgUrl={nm} imgStyles="w-[60px] h-[60px]" />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-base-300 rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((menu) => {
            const isActive = pathname === menu.link;
            const IconComponent = menu.icon;

            return (
              <div
                key={menu.name}
                className="tooltip tooltip-right"
                data-tip={menu.name}
              >
                <Link
                  href={menu.link}
                  className="flex flex-col items-center p-2 hover:bg-base-200 rounded-lg transition-colors"
                  onClick={(e) => {
                    if (menu.btn) {
                      e.preventDefault();
                      setIsOpen(true);
                    }
                  }}
                >
                  <IconComponent
                    className={`w-6 h-6 ${
                      isActive ? "text-teal-500" : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-xs mt-1 ${
                      isActive ? "text-teal-500" : "text-gray-500"
                    }`}
                  >
                    {menu.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 hover:bg-base-200 rounded-lg transition-colors"
        >
          {theme === "mydark" ? (
            <Sun className="w-6 h-6 text-gray-500" />
          ) : (
            <Moon className="w-6 h-6 text-gray-500" />
          )}
        </button>

        {isOpen && (
          <ShareDialogBox isOpen={isOpen} setIsOpen={handleCloseDialog} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
