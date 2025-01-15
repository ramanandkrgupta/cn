// app/account/profile/page.tsx
'use client'
import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users,UserPlus} from 'lucide-react';
import {
  Header,
  UserAvatar,
  ProfileStats,
  ProfileDetails,
  Achievements,
  Uploads,
} from '@/components/profile'

const ProfilePage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const userStats = {
    location: 'Bhopal',
    semester: '6th',
    year: '3rd',
    linkedin: 'username',
    github: 'username',
    facebook: 'username',
    twitter: 'username',
    reddit: 'username',
    discord: 'username',
    telegram: 'username',
    snapchat: 'username',
    instagram: 'username',
    website: 'https://example.com',
    followers: '120',
    following: '89',
    readingTime: '32hrs',
    likes: '234',
    uploads: '12',
    downloads: '45',
    course: 'Btech',
    branch: 'AIDS',
    streak:'34',
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

            <div className="flex">
              <UserAvatar user={user} />
              <div className="flex flex-col ml-2 mb-4">
                <h1 className="text-lg font-bold">
                  {user?.name || 'User Name'}
                </h1>
                <p className="text-sm font-thin">
                  {user?.college || 'College Name'}
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/account/profile/edit-profile')}
              className="w-full mt-4 mb-6 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
            >
              Edit Profile
            </button>
            {/* New Followers/Following Section */}
            <div className="flex justify-between mb-6">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm">{userStats.followers} followers</span>
              </div>
              <div className="flex items-center gap-2">
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
          <Uploads />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
