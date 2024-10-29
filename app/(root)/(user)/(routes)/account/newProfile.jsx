import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { User, Lock, Download, Heart, CreditCard, LogOut } from 'lucide-react'

const ProfilePage = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [plan, setPlan] = useState('free')
  const [downloads, setDownloads] = useState([])
  const [favorites, setFavorites] = useState([])
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      // Fetch user data, downloads, and favorites
      fetchUserData()
      fetchDownloads()
      fetchFavorites()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/data')
      setPlan(response.data.plan)
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const fetchDownloads = async () => {
    try {
      const response = await axios.get('/api/user/downloads')
      setDownloads(response.data.downloads)
    } catch (error) {
      console.error('Error fetching downloads:', error)
    }
  }

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('/api/user/favorites')
      setFavorites(response.data.favorites)
    } catch (error) {
      console.error('Error fetching favorites:', error)
    }
  }

  const handlePlanChange = async (newPlan) => {
    try {
      await axios.post('/api/user/change-plan', { plan: newPlan })
      setPlan(newPlan)
      alert('Plan updated successfully!')
    } catch (error) {
      console.error('Error changing plan:', error)
      alert('Failed to update plan. Please try again.')
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match!')
      return
    }
    try {
      await axios.post('/api/user/change-password', { oldPassword, newPassword })
      alert('Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      alert('Failed to change password. Please try again.')
    }
  }

  const handleLogout = async () => {
    // Implement logout logic here
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!session || !session.user) {
    return null
  }

  const { user } = session

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <img className="h-20 w-20 rounded-full" src={user.image || '/placeholder-avatar.png'} alt={user.name} />
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Current Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</h4>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePlanChange('free')}
                    className={`px-4 py-2 rounded-md ${plan === 'free' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Free
                  </button>
                  <button
                    onClick={() => handlePlanChange('premium')}
                    className={`px-4 py-2 rounded-md ${plan === 'premium' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      case 'security':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Change Password</h2>
            <form onSubmit={handlePasswordChange} className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <div>
                <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
              <button type="submit" className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-200">
                Change Password
              </button>
            </form>
          </div>
        )
      case 'downloads':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Download History</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {downloads.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {downloads.map((download, index) => (
                    <li key={index} className="py-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{download.title}</p>
                        <p className="text-sm text-gray-500">{new Date(download.date).toLocaleDateString()}</p>
                      </div>
                      <a href={download.url} className="text-purple-600 hover:text-purple-800" download>
                        Download Again
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No downloads yet.</p>
              )}
            </div>
          </div>
        )
      case 'favorites':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Favorites</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {favorites.length > 0 ? (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((favorite, index) => (
                    <li key={index} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                      <div className="w-full flex items-center justify-between p-6 space-x-6">
                        <div className="flex-1 truncate">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-gray-900 text-sm font-medium truncate">{favorite.title}</h3>
                          </div>
                          <p className="mt-1 text-gray-500 text-sm truncate">{favorite.description}</p>
                        </div>
                        <img className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0" src={favorite.image} alt="" />
                      </div>
                      <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                          <div className="w-0 flex-1 flex">
                            <a
                              href={favorite.url}
                              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                            >
                              <span className="ml-3">View</span>
                            </a>
                          </div>
                          <div className="-ml-px w-0 flex-1 flex">
                            <button
                              onClick={() => {/* Implement remove from favorites */}}
                              className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                            >
                              <span className="ml-3">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No favorites yet.</p>
              )}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">{user.name}</span>
              <img className="h-8 w-8 rounded-full" src={user.image || '/placeholder-avatar.png'} alt={user.name} />
            </div>
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
              <div className="pb-8 space-y-1">
                {[
                  { name: 'Profile', href: '#', icon: User, current: activeTab === 'profile' },
                  { name: 'Security', href: '#', icon: Lock, current: activeTab === 'security' },
                  { name: 'Downloads', href: '#', icon: Download, current: activeTab === 'downloads' },
                  { name: 'Favorites', href: '#', icon: Heart, current: activeTab === 'favorites' },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    aria-current={item.current ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault()
                      setActiveTab(item.name.toLowerCase())
                    }}
                  >
                    <item.icon className={`${
                      item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                    } flex-shrink-0 -ml-1 mr-3 h-6 w-6`} aria-hidden="true" />
                    <span className="truncate">{item.name}</span>
                  </a>
                ))}
              </div>
              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6" aria-hidden="true" />
                  <span className="truncate">Log out</span>
                </button>
              </div>
            </nav>
          </div>
          <main className="lg:col-span-9 xl:col-span-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage