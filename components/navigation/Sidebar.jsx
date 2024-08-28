"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { navlinks } from "@/constants";
import { logo, sun } from "@/public/assets";
import Icon from "../ui/Icon";
import ShareDialogBox from "../models/ShareDialogBox";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState("Home");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Always set "Home" as active if the user is on the home page
    if (pathname === "/") {
      setIsActive("Home");
    } else {
      // Update the active state based on the current pathname
      const activeLink = navlinks.find((link) => pathname.startsWith(link.link));
      if (activeLink) {
        setIsActive(activeLink.name);
      }
    }
  }, [pathname]);

  return (
    <aside className="flex justify-between items-center flex-col sticky top-5 h-[89vh]">
      <Link href="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3 ">
          {navlinks.map((data) => {
            return (
              <div
                key={data.name}
                className="tooltip tooltip-right"
                data-tip={data.name}
              >
                <Icon
                  {...data}
                  isActive={isActive === data.name}
                  handleClick={() => {
                    setIsActive(data.name);
                    data.btn ? setIsOpen(true) : router.push(data.link);
                  }}
                />
              </div>
            );
          })}
        </div>
        <Icon className="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
        {isOpen && <ShareDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
    </aside>
  );
};

export default Sidebar;