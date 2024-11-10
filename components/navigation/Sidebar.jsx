"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { navlinks } from "@/constants";
import { logo, sun } from "@/public/assets";
import Icon from "../ui/Icon";
import ShareDialogBox from "../models/ShareDialogBox";

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
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3 ">
          {navlinks.map((data) => {
            const isActive = pathname === data.link;
            return (
              <div
                key={data.name}
                className="tooltip tooltip-right"
                data-tip={data.name}
              >
                <Icon
                  {...data}
                  isActive={isActive}
                  handleClick={() => {
                    data.btn ? setIsOpen(true) : router.push(data.link);
                  }}
                  activeStyle={isActive ? "text-teal-500" : "text-gray-500"}
                />
              </div>
            );
          })}
        </div>
        
        {/* Theme Toggle */}
        <label className="grid cursor-pointer place-items-center mt-4">
          <input
            type="checkbox"
            value="synthwave"
            onClick={toggleTheme}
            className="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
          />
          <svg
            className="stroke-base-100 fill-base-100 col-start-1 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
          </svg>
          <svg
            className="stroke-base-100 fill-base-100 col-start-2 row-start-1"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </label>

        {isOpen && (
          <ShareDialogBox isOpen={isOpen} setIsOpen={handleCloseDialog} />
        )}
      </div>
    </aside>
  );
};

export default Sidebar;