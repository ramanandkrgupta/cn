import React from 'react'
import { Users, UserPlus } from 'lucide-react'
import {
  Header,
  ProfileStats,
  ProfileDetails,
  Achievements,
  Uploads,
} from '@/components/profile'
import { useRouter } from 'next/navigation'

const UserProfileDetails = ({
  userData,
  userStats,
  isFollowing,
  handleFollow,
  showFollowButton,
}) => {
  const router = useRouter()
  const userId = userData.id

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
                  {userData.college}
                </p>
                <p className="text-sm font-thin text-gray-500 truncate max-w-[250px]">
                  {userData.university}
                </p>

                {/* Add followers/following counts */}
                <div className="flex items-center gap-4 mt-2">
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => router.push(`/profile/${userId}/followers`)}
                  >
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {userStats.followers} followers
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => router.push(`/profile/${userId}/following`)}
                  >
                    <UserPlus className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">
                      {userStats.following} following
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Follow Button */}
            {showFollowButton && (
              <button
                onClick={handleFollow}
                className={`w-full mt-4 mb-6 py-2 px-4 rounded-lg transition-colors ${
                  isFollowing
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-primary hover:bg-primary-focus'
                } text-white`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}

            {/* Rest of the profile content */}
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
            uploadCount={userData.uploadCount}
            verifiedUploads={userData.verifiedUploads}
          />
        </div>
      </div>
    </div>
  )
}

export default UserProfileDetails
