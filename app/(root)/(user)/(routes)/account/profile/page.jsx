'use client'
import React, { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Users, UserPlus } from 'lucide-react'
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
  const { data: session, status, update: updateSession } = useSession()
  const user = session?.user

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])




  const userStats = {
    location: user?.location || 'Not specified',
    semester: user?.semester || 'Not specified',
    year: user?.year || 'Not specified',
    college: user?.college || 'Not specified',
    university: user?.university || 'Not specified',
    level: user?.level || 'Not specified',
    stream: user?.stream || 'Not specified',
    degree: user?.degree || 'Not specified',
    specialization: user?.specialization || 'Not specified',
    reputationScore: user?.reputationScore || 0,
    uploadCount: user?.uploadCount || 0,
    verifiedUploads: user?.verifiedUploads || 0,
    followers: '0',
    following: '0',
    readingTime: '0 hrs',
    likes: '0',
    downloads: '0',
    views: '0 views',
    streak: '0',
    github: user?.links?.find((link) => link.type === 'GitHub')?.url || '',
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
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.name || 'User avatar'}
                className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold">
                  {user?.name || 'User Name'}
                </h1>
                <p className="text-sm font-thin truncate max-w-[250px]">
                  {userStats.college}
                </p>
                <p className="text-sm font-thin text-gray-500 truncate max-w-[250px]">
                  {userStats.university}
                </p>

                {/* Stats for mobile view */}
                <div className="flex sm:hidden items-center gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">
                      {userStats.followers} followers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
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

            {/* Stats for desktop view */}
            <div className="hidden sm:grid grid-cols-2 gap-4 mb-6">
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
