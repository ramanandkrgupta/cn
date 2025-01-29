'use client' // Ensure client-side rendering

import React, { useEffect, useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Users, UserPlus } from 'lucide-react'
import {
  Header,
  UserAvatar,
  ProfileStats,
  ProfileDetails,
  Achievements,
  Uploads,
} from '@/components/profile'


const ProfileLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Section Skeleton */}
        <div className="w-full lg:w-[40%] bg-base-200 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col">
            {/* Profile Info Skeleton */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>

            {/* Edit Profile Button Skeleton */}
            <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse my-4" />

            {/* Stats Skeleton - Reduced */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>

            {/* Profile Details Skeleton - Reduced */}
            <div className="space-y-2 mt-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Section Skeleton - Simplified */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Achievements Skeleton */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Uploads Skeleton */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


const ProfilePage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/v1/members/users/profile')
          if (!response.ok) {
            throw new Error('Failed to fetch user data')
          }
          const data = await response.json()
          setUserData(data)
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('Failed to load user data')
        } finally {
          setLoading(false)
        }
      } else if (status === 'unauthenticated') {
        toast.error('Please sign in to access your profile')
        signIn() // Redirect to sign-in
      }
    }

    fetchUserData()
  }, [status])

  // In ProfilePage component
  if (loading) {
    return <ProfileLoadingSkeleton /> // Use the new loading skeleton
  }

  if (!userData) {
    return <div>No user data available.</div> // Show fallback UI
  }

  const userStats = {
    location: userData.location || 'Not specified',
    semester: userData.semester || 'Not specified',
    year: userData.year || 'Not specified',
    college: userData.college || 'Not specified',
    university: userData.university || 'Not specified',
    level: userData.level || 'Not specified',
    stream: userData.stream || 'Not specified',
    degree: userData.degree || 'Not specified',
    specialization: userData.specialization || 'Not specified',
    reputationScore: userData.reputationScore || 0,
    uploadCount: userData.uploadCount || 0,
    verifiedUploads: userData.verifiedUploads || 0,
    followers: userData.followers || 0,
    following: userData.following || 0,
    readingTime: '0 hrs',
    likes: '0',
    downloads: '0',
    views: '0 views',
    streak: '0',
    github: userData.links?.find((link) => link.type === 'GitHub')?.url || '',
    linkedin: '',
    facebook: '',
    twitter: '',
    reddit: '',
    discord: '',
    telegram: '',
    snapchat: '',
    instagram: '',
    website: '',
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Section - Profile Info */}
        <div className="w-full lg:w-[40%] bg-base-200 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col">
            <Header
              followers={userStats.followers}
              following={userStats.following}
            />
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img
                src={userData.avatar || '/default-avatar.png'}
                alt={userData.name || 'User avatar'}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">
                  {userData.name || 'User Name'}
                </h1>
                <p className="text-sm font-thin truncate max-w-[250px]">
                  {userStats.college}
                </p>
                <p className="text-sm font-thin text-gray-500 truncate max-w-[250px]">
                  {userStats.university}
                </p>

                {/* Mobile View Stats */}
                <div className="flex sm:hidden items-center gap-4 mt-4">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() =>
                      router.push(`/profile/${userData.id}/followers`)
                    }
                  >
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">
                      {userStats.followers} followers
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() =>
                      router.push(`/profile/${userData.id}/following`)
                    }
                  >
                    <UserPlus className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">
                      {userStats.following} following
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/account/profile/edit-profile')}
              className="w-full mt-4 mb-6 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
            >
              Edit Profile
            </button>

            {/* Desktop View Stats */}
            <div className="hidden sm:grid grid-cols-2 gap-4 mb-6">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => router.push(`/profile/${userData.id}/followers`)}
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{userStats.followers} followers</span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                onClick={() => router.push(`/profile/${userData.id}/following`)}
              >
                <UserPlus className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{userStats.following} following</span>
              </div>
            </div>

            <div className="space-y-4">
              <ProfileStats stats={userStats} />
              <ProfileDetails details={userStats} />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col gap-6">
          <Achievements />
          <Uploads
            uploadCount={userStats.uploadCount}
            verifiedUploads={userStats.verifiedUploads}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
