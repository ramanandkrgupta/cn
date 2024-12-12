// File: components/navigation/Navbar.jsx

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import { handleSignOutButton } from "@/libs/utils";
import Search from "../Search";
import { navlinks } from "@/constants";
import ShareDialogBox from "../models/ShareDialogBox";
import PostViewDialogBox from "../models/PostViewDialogBox";
import { nm } from "@/public/icons";
import { Sun, Moon, Menu, X, LogOut, LogIn, User2, Bell } from "lucide-react";
import Image from "next/image";
import UserProfile from "./UserProfile";

const NavBar = ({ showSearch = true }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const sidebarRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [post, setPost] = useState("");
  const [isActive, setIsActive] = useState("");
  const [theme, setTheme] = useState("mydark");
  const [wavePosition, setWavePosition] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const waveRef = useRef(null);

  // Add this helper function to check if a link is active
  const isLinkActive = (link) => {
    if (!pathname) return false;
    if (link === "/") {
      return pathname === link;
    }
    return pathname.startsWith(link);
  };

  // Toggle theme between light and dark
  const toggleTheme = (e) => {
    e.preventDefault();
    setIsAnimating(true);

    // Change theme immediately
    const newTheme = theme === "mylight" ? "mydark" : "mylight";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Reset animation after it's done
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); // Reduced from 1000ms to 500ms
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

  // Menu Panel Content
  const MenuPanel = () => (
    <div className="flex flex-col h-full">
      {/* Header with Logo */}
      <div className="flex items-center justify-between p-4 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Image src={nm} alt="Notes Mates Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">Notes Mates</span>
        </div>
        <button className=""></button>
      </div>

      {/* User Profile Section - Show only if logged in */}
      {session && (
        <div className="p-4 bg-base-300/50">
          <div className="flex items-center gap-4 mb-3">
            {session.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={48}
                height={48}
                className="rounded-full ring-2 ring-primary/20"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User2 className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">
                {session.user?.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {session.user?.email}
              </p>
            </div>
          </div>

          {/* Quick Stats/Actions */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-base-300 p-2 rounded-lg text-center">
              <div className="text-primary font-semibold">0</div>
              <div className="text-xs text-gray-500">Uploads</div>
            </div>
            <div className="bg-base-300 p-2 rounded-lg text-center">
              <div className="text-primary font-semibold">0</div>
              <div className="text-xs text-gray-500">Downloads</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Navigation
        </div>

        {navlinks.map((menu) => {
          const isActive = isLinkActive(menu.link);
          const IconComponent = menu.icon;

          return (
            <Link
              key={menu.name}
              href={menu.link}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-500 hover:bg-base-300 hover:text-gray-700"
              }`}
              onClick={() => {
                setIsActive(menu.name);
                setToggleDrawer(false);
                if (menu.btn) setIsOpen(true);
              }}
            >
              <IconComponent
                className={`w-5 h-5 ${isActive ? "text-primary" : ""}`}
              />
              <span>{menu.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-4 space-y-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center w-full gap-3 p-3 rounded-lg text-gray-500 hover:bg-base-300 transition-colors"
        >
          {theme === "mydark" ? (
            <>
              <Sun className="w-5 h-5" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-5 h-5" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {/* Auth Button */}
        <button
          className={`flex items-center w-full gap-3 p-4 rounded-xl transition-all duration-200 transform hover:scale-[0.98] active:scale-[0.95] ${
            session
              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
              : "bg-primary/10 text-primary hover:bg-primary/20"
          }`}
          onClick={() => {
            setToggleDrawer(false);
            if (session) {
              handleSignOutButton();
            } else {
              const button = document.activeElement;
              button.classList.add("animate-press");
              setTimeout(() => {
                signIn();
                button.classList.remove("animate-press");
              }, 200);
            }
          }}
        >
          {session ? (
            <>
              <LogOut className="w-5 h-5" />
              <span className="font-semibold flex-1">Sign Out</span>
              <span className="text-xs opacity-60">ESC</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span className="font-semibold flex-1">Sign In</span>
              <span className="text-xs opacity-60">↵</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  // Add this component inside your NavBar component
  const ThemeWave = () =>
    isAnimating && (
      <div
        className="fixed inset-0 pointer-events-none z-[60]"
        aria-hidden="true"
      >
        <div
          className={`absolute inset-0 transition-colors duration-300
            ${theme === "mydark" ? "bg-base-100" : "bg-base-300"}`}
          style={{
            opacity: "0.5",
            animation: "fade-theme 300ms ease-out forwards",
          }}
        />
      </div>
    );

  // Update the ThemeToggleButton component
  const ThemeToggleButton = ({ mobile = false }) => (
    <button
      onClick={(e) => {
        e.preventDefault(); // Prevent any default behavior
        e.stopPropagation(); // Stop event propagation
        toggleTheme(e);
      }}
      className={`p-2 hover:bg-base-200 rounded-lg transition-colors relative overflow-hidden
        ${
          mobile
            ? "flex items-center justify-center"
            : "w-full gap-3 p-3 flex items-center"
        }`}
    >
      {theme === "mydark" ? (
        <>
          <Sun
            className={`w-${mobile ? "6" : "5"} h-${
              mobile ? "6" : "5"
            } text-gray-500`}
          />
          {!mobile && <span>Light Mode</span>}
        </>
      ) : (
        <>
          <Moon
            className={`w-${mobile ? "6" : "5"} h-${
              mobile ? "6" : "5"
            } text-gray-500`}
          />
          {!mobile && <span>Dark Mode</span>}
        </>
      )}
    </button>
  );

  return (
    <>
      <nav className="flex md:flex-row flex-col-reverse justify-between gap-6">
        <p className="text-primary align-middle text-center subpixel-antialiased text-3xl font-bold hidden sm:block">
          Notes <span className="text-secondary">Mates</span>{" "}
          <span className="badge">.in</span>
        </p>

        {showSearch && (
          <Search setIsPostOpen={setIsPostOpen} setPost={setPost} />
        )}
        <div className=" hidden md:block">
          <div className="items-center flex p-1">
            {session && session.user ? (
              <UserProfile user={session.user} />
            ) : (
              <UserProfile user={null} />
            )}
          </div>
        </div>

        {/* mobile version starts from here */}
        <div className="sm:hidden flex justify-between items-center relative">
          <div
            className="w-[40px] h-[40px] rounded-[10px] bg-neutral flex justify-center items-center cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
          >
            <Image
              src={nm}
              alt="user icon"
              className="w-[95%] h-[95%]"
              priority
            />
          </div>

          <p className="text-primary align-middle text-center subpixel-antialiased text-2xl font-bold">
            Notes <span className="text-secondary">Mates</span>
            <span className="badge">.in</span>
          </p>

          <div className="flex items-center justify-center">
            {/* <ThemeToggleButton mobile /> */}
            <Link href="/account/notifications">
              <Bell />
            </Link>
          </div>

          <button
            className="p-2 hover:bg-base-200 rounded-lg transition-colors relative z-50"
            onClick={handleToggleDrawer}
            ref={menuButtonRef}
            aria-label="Toggle Menu"
          >
            <Menu
              className={`w-6 h-6 text-gray-500 absolute transition-opacity duration-200 ${
                toggleDrawer ? "opacity-0" : "opacity-100"
              }`}
            />
            <X
              className={`w-6 h-6 text-gray-500 transition-opacity duration-200 ${
                toggleDrawer ? "opacity-100" : "opacity-0"
              }`}
            />
          </button>

          <div
            className="fixed inset-0 z-40 pointer-events-none"
            aria-hidden={!toggleDrawer}
          >
            {/* Backdrop */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                toggleDrawer ? "opacity-50 pointer-events-auto" : "opacity-0"
              }`}
              onClick={handleCloseSidebar}
            />

            {/* Menu Panel */}
            <div
              ref={sidebarRef}
              className={`absolute inset-y-0 left-0 w-[280px] bg-base-200 transform transition-transform duration-300 ease-out pointer-events-auto
                ${toggleDrawer ? "translate-x-0" : "-translate-x-full"}`}
            >
              <MenuPanel />
            </div>
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

      {/* Add the wave effect */}
      <ThemeWave />
    </>
  );
};

export default NavBar;
