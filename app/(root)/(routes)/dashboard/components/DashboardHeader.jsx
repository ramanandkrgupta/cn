"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardHeader({ onMenuClick }) {
    const { data: session } = useSession();

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-md sticky top-0 z-40 border-b border-base-200 px-4 gap-4">
            <div className="flex-none lg:hidden">
                <button className="btn btn-square btn-ghost" onClick={onMenuClick}>
                    <Menu className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1">
                <div className="relative w-full max-w-md hidden md:block">
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="input input-sm input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-all rounded-full"
                    />
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
                </div>
                {/* Mobile Title */}
                <span className="text-lg font-bold md:hidden">Nexus Admin</span>
            </div>

            <div className="flex-none gap-2">
                <button className="btn btn-ghost btn-circle btn-sm">
                    <div className="indicator">
                        <Bell className="w-5 h-5" />
                        <span className="indicator-item badge badge-primary badge-xs"></span>
                    </div>
                </button>

                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-base-200">
                        <div className="w-9 rounded-full">
                            {session?.user?.image ? (
                                <img src={session.user.image} alt={session.user.name} />
                            ) : (
                                <div className="bg-primary/10 w-full h-full flex items-center justify-center text-primary font-bold">
                                    {session?.user?.name?.[0] || "A"}
                                </div>
                            )}
                        </div>
                    </label>
                    <ul
                        tabIndex={0}
                        className="mt-3 z-50 p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200"
                    >
                        <div className="px-4 py-2 border-b border-base-200 mb-2">
                            <p className="font-semibold truncate">{session?.user?.name}</p>
                            <p className="text-xs text-base-content/60 truncate">
                                {session?.user?.email}
                            </p>
                        </div>
                        <li>
                            <Link href="/account/profile">
                                <User className="w-4 h-4" />
                                Profile
                            </Link>
                        </li>
                        <li>
                            <button onClick={() => signOut()} className="text-error">
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
