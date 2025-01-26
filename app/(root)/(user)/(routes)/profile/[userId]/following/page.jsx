'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { toast } from 'react-hot-toast'

const FollowingPage = ({ params }) => {
  const { userId } = params
  const router = useRouter()
  const { data: session } = useSession()
  const [following, setFollowing] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const response = await fetch(`/api/v1/members/users/${userId}/following`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setFollowing(data.following)
      } catch (error) {
        console.error('Error fetching following:', error)
        toast.error('Failed to load following users')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowing()
  }, [userId])

  const navigateToProfile = (followingId) => {
    router.push(`/profile/${followingId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Following</h1>
        <div className="space-y-4">
          {following.length > 0 ? (
            following.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 p-4 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
                onClick={() => navigateToProfile(user.id)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="font-semibold">{user.name}</h2>
                  <p className="text-sm text-gray-500">{user.university || user.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">Not following anyone yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowingPage