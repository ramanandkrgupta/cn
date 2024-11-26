"use client";
import { Menu, Bell, Search } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function AdminHeader({ onMenuClick, title = "Dashboard" }) {
  const { data: session } = useSession();

  return (
    <header className="bg-base-200 border-b">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="btn btn-ghost btn-square lg:hidden">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-base-300 rounded-lg px-3 py-2">
            <Search className="w-5 h-5 text-base-content/70" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none px-2 w-40 lg:w-60"
            />
          </div>

          {/* Notifications */}
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-5 h-5" />
              <span className="badge badge-xs badge-primary indicator-item"></span>
            </div>
          </button>

          {/* User Menu */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary flex items-center justify-center text-primary-content">
                {session?.user?.name?.[0] || 'U'}
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52">
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li><a onClick={() => signOut()}>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
} 