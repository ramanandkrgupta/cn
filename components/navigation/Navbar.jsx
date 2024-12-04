// File: components/navigation/Navbar.jsx

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { handleSignOutButton } from "@/libs/utils";
import Search from "../Search";
import { navlinks } from "@/constants";
import { close, logo, menu, logout } from "@/public/assets";
import ShareDialogBox from "../models/ShareDialogBox";
import PostViewDialogBox from "../models/PostViewDialogBox";
import { newlogo } from "@/public/icons";

const NavBar = ({ showSearch = true }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [post, setPost] = useState("");
  const [isActive, setIsActive] = useState("");

  const [theme, setTheme] = useState("mydark");

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

  const handleToggleDrawer = () => {
    setToggleDrawer((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setToggleDrawer(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        handleCloseSidebar();
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const currentPath = router.pathname;
  const activeLink = navlinks.find((link) => link.link === currentPath);

  return (
    <nav
      className={`flex md:flex-row flex-col-reverse justify-between gap-6`}
    >
      <p className="text-primary align-middle text-center subpixel-antialiased text-3xl font-bold hidden sm:block">
        Notes <span className="text-secondary">Mates</span>{" "}
        <span className="badge">.in</span>
      </p>

      {showSearch && (
        <Search
          setIsPostOpen={setIsPostOpen}
          setPost={setPost}
        />
      )}

      <div className="sm:hidden flex justify-between items-center relative">
        <div
          className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer"
          onClick={() => router.push("/")}
        >
          <Image
            src={newlogo}
            alt="user icon"
            className="w-[95%] h-[95%] "
          />
        </div>
        <p className="text-primary align-middle text-center subpixel-antialiased text-2xl font-bold">
          Notes <span className="text-secondary">Mates</span>
          <span className="badge">.in</span>
        </p>

        <label className="swap swap-rotate">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            onClick={toggleTheme}
            className="theme-controller"
            value="synthwave"
          />

          {/* sun icon */}
          <svg
            className="swap-off h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-on h-8 w-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
        <div
          className={`w-[34px] h-[34px] object-contain cursor-pointer transition-transform transform ${
            toggleDrawer ? "rotate-90" : "rotate-0"
          }`}
          onClick={handleToggleDrawer}
          ref={menuButtonRef}
        >
          {toggleDrawer ? (
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block h-8 w-8 stroke-current"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </label>
          ) : (
            <label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-8 w-8 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          )}
        </div>
        <div
          className={`${
            toggleDrawer ? "translate-x-0" : "-translate-x-full"
          } fixed top-0 bottom-0 left-0 rounded-r-[10px] bg-[#1c1c24] z-10 py-5 w-[250px] transition-transform duration-1000`}
          ref={sidebarRef}
        >
          <ul className="mb-4 p-3">
            {navlinks.map((data) => (
              <li
                key={data.name}
                className={`flex p-4 ${
                  isActive === data.name && "bg-[#3a3a43]"
                } hover:bg-[#2c2f32] rounded-full`}
                onClick={() => {
                  setIsActive(data.name);
                  setToggleDrawer(false);
                  data.btn ? setIsOpen(true) : router.push(data.link);
                }}
              >
                <Image
                  src={data.imgUrl}
                  alt={data.name}
                  className={`w-[24px] h-[24px] object-contain ${
                    activeLink && activeLink.name === data.name
                      ? "grayscale-0"
                      : "grayscale"
                  }`}
                />
                <p
                  className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                    activeLink && activeLink.name === data.name
                      ? "text-primary"
                      : "text-[#808191]"
                  }`}
                >
                  {data.name}
                </p>
              </li>
            ))}
            {session && session.user ? (
              <li
                className="flex p-4 hover:bg-[#2c2f32] rounded-full cursor-pointer"
                onClick={handleSignOutButton}
              >
                <Image
                  src={logout}
                  alt="Logout"
                  className="w-[24px] h-[24px] object-contain grayscale"
                />
                <p className="ml-[20px] font-epilogue font-semibold text-[14px] text-[#808191]">
                  Logout
                </p>
              </li>
            ) : (
              <li
                className="flex p-4 hover:bg-[#2c2f32] rounded-full cursor-pointer"
                onClick={() => signIn()}
              >
                <Image
                  src={logout}
                  alt="Login"
                  className="w-[24px] h-[24px] object-contain grayscale"
                />
                <p className="ml-[20px] font-epilogue font-semibold text-[14px] text-[#808191]">
                  Login
                </p>
              </li>
            )}
          </ul>
        </div>
      </div>
      {isOpen && <ShareDialogBox isOpen={isOpen} setIsOpen={setIsOpen} />}
      {isPostOpen && (
        <div className="relative z-50">
          <PostViewDialogBox
            isOpen={isPostOpen}
            setIsOpen={setIsPostOpen}
            data={post}
          />
        </div>
      )}
    </nav>
  );
};

export default NavBar;
