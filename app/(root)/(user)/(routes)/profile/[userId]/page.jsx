'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { Users, UserPlus } from 'lucide-react'
import {
  Header,
  ProfileStats,
  ProfileDetails,
  Achievements,
  Uploads,
} from '@/components/profile'
import { useRouter } from 'next/navigation'

const UserProfilePage = ({ params }) => {
  const { userId } = params;
  const { data: session, status } = useSession();
  const router = useRouter();

  // Declare all state hooks at the top
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Session in profile:", session);
        const response = await fetch(`/api/v1/members/users/${userId}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data');
        }

        setUserData(data);
        setIsFollowing(data.isFollowing);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId && status === 'authenticated') {
      fetchUserData();
    }
  }, [userId, status, session]);

  const handleFollow = async () => {
    try {
      if (!session?.user) {
        toast.error("Please login to follow users");
        return;
      }

      console.log("Current session user:", session.user);

      const response = await fetch(`/api/v1/members/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Follow error response:", data);
        throw new Error(data.error || 'Failed to update follow status');
      }

      // Update local state
      setIsFollowing(!isFollowing);
      setUserData(prev => ({
        ...prev,
        followers: data.followers,
        following: data.following
      }));

      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (error) {
      console.error('Error updating follow status:', error);
      toast.error(error.message || 'Failed to update follow status');
    }
  };

  // Only show follow button if:
  // 1. Not viewing own profile
  // 2. User is logged in
  const showFollowButton = session?.user && session.user.id !== userId;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-500">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  if (!userData) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">User Not Found</h2>
        <p className="text-gray-600">The requested user profile could not be found.</p>
      </div>
    </div>
  );

  const userStats = {
    location: userData?.location || 'Not specified',
    semester: userData?.semester || 'Not specified',
    year: userData?.year || 'Not specified',
    college: userData?.college || 'Not specified',
    university: userData?.university || 'Not specified',
    level: userData?.level || 'Not specified',
    stream: userData?.stream || 'Not specified',
    degree: userData?.degree || 'Not specified',
    specialization: userData?.specialization || 'Not specified',
    reputationScore: userData?.reputationScore || 0,
    uploadCount: userData?.uploadCount || 0,
    verifiedUploads: userData?.verifiedUploads || 0,
    followers: userData?.followers || 0,
    following: userData?.following || 0,
    readingTime: '0 hrs',
    likes: '0',
    downloads: '0',
    views: '0 views',
    streak: '0',
  };

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

export default UserProfilePage