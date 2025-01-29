import React from 'react'
import Link from 'next/link'
import { User, CreditCard, FolderUp, Bell, Settings, Crown } from 'lucide-react'
import { useSession } from 'next-auth/react'

const MainContent = () => {
  const { data: session } = useSession()
  const userRole = session?.user?.role || 'FREE'

  const sections = [
    {
      icon: <User size={24} className="text-gray-500" />,
      title: 'Profile',
      description: 'Manage your profile information',
      path: '/account/profile',
    },
    {
      icon: <CreditCard size={24} className="text-gray-500" />,
      title: 'Billing',
      description: 'Manage your billing information',
      path: '/account/billing',
    },
    {
      icon: <FolderUp size={24} className="text-gray-500" />,
      title: 'Your Uploads',
      description: 'Manage your uploaded content',
      path: '/account/uploads',
      badge:
        session?.uploads > 0 ? (
          <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">
            {session.uploads} files
          </span>
        ) : null,
    },
    {
      icon: <Bell size={24} className="text-gray-500" />,
      title: 'Notifications',
      description: 'Manage your notifications',
      path: '/account/notifications',
    },
    {
      icon: <Settings size={24} className="text-gray-500" />,
      title: 'Settings',
      description: 'Manage your account settings',
      path: '/account/settings',
    },
    {
      icon: <Crown size={24} className="text-gray-500" />,
      title: 'Plans',
      description:
        userRole === 'PRO' ? 'Manage your PRO subscription' : 'Upgrade to PRO',
      path: '/account/plans',
      badge:
        userRole === 'PRO' ? (
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full flex items-center gap-1">
            <Crown size={12} /> PRO
          </span>
        ) : (
          <span className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
            Upgrade
          </span>
        ),
    },
  ]

  return (
    <div className="flex-1 p-8">
      <h2 className="text-xl font-bold mb-4">Welcome to your account</h2>
      <p className="text-gray-700 mb-8">
        Here you can manage your profile, billing, uploads, notifications, and
        settings.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <Link key={index} href={section.path}>
            <a className="block p-4 bg-white shadow rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                {section.icon}
                <div>
                  <h3 className="text-lg font-semibold">{section.title}</h3>
                  <p className="text-gray-500">{section.description}</p>
                </div>
                {section.badge && (
                  <div className="ml-auto">{section.badge}</div>
                )}
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MainContent
