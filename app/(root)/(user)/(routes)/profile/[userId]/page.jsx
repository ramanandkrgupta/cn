'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import Loading from './components/Loading'
import Error from './components/Error'
import UserProfileDetails from './components/UserProfileDetails'

const UserProfilePage = () => {
  const params = useParams()
  const userId = params.userId
  const { data: session, status } = useSession()

  // Declare all state hooks at the top
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Session in profile:', session)
        const response = await fetch(`/api/v1/members/users/${userId}`, {
          credentials: 'include',
        })
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch user data')
        }

        setUserData(data)
        setIsFollowing(data.isFollowing)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setError(error.message)
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    }

    if (userId && status === 'authenticated') {
      fetchUserData()
    }
  }, [userId, status, session])

  const handleFollow = async () => {
    try {
      if (!session?.user) {
        toast.error('Please login to follow users')
        return
      }

      console.log('Current session user:', session.user)

      const response = await fetch(`/api/v1/members/users/${userId}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Follow error response:', data)
        throw new Error(data.error || 'Failed to update follow status')
      }

      // Update local state
      setIsFollowing(!isFollowing)
      setUserData((prev) => ({
        ...prev,
        followers: data.followers,
        following: data.following,
      }))

      toast.success(
        isFollowing ? 'Unfollowed successfully' : 'Followed successfully'
      )
    } catch (error) {
      console.error('Error updating follow status:', error)
      toast.error(error.message || 'Failed to update follow status')
    }
  }

  // Only show follow button if:
  // 1. Not viewing own profile
  // 2. User is logged in
  const showFollowButton = session?.user && session.user.id !== userId

  if (loading) return <Loading />

  if (error) return <Error message={error} />

  if (!userData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">User Not Found</h2>
          <p className="text-gray-600">
            The requested user profile could not be found.
          </p>
        </div>
      </div>
    )

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
  }

  return (
    <UserProfileDetails
      userData={userData}
      userStats={userStats}
      isFollowing={isFollowing}
      handleFollow={handleFollow}
      showFollowButton={showFollowButton}
    />
  )
}

export default UserProfilePage
