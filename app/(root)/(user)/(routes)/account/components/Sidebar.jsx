import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import {
  User,
  CreditCard,
  FolderUp,
  Bell,
  Settings,
  LogOut,
} from 'lucide-react'

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-4">
      <ul className="space-y-4">
        <li>
          <Link
            href="/profile"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <User className="w-5 h-5" />
            <span>Profile</span>
          </Link>
        </li>
        <li>
          <Link
            href="/billing"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <CreditCard className="w-5 h-5" />
            <span>Billing</span>
          </Link>
        </li>
        <li>
          <Link
            href="/uploads"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <FolderUp className="w-5 h-5" />
            <span>Uploads</span>
          </Link>
        </li>
        <li>
          <Link
            href="/notifications"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded"
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </li>
        <li>
          <button
            onClick={() => signOut()}
            className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar
