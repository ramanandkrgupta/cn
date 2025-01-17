'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserCircleIcon } from "@heroicons/react/24/solid"
import { toast } from 'react-hot-toast'

const FollowersPage = ({ params }) => {
  const { userId } = params
  const router = useRouter()
  const { data: session } = useSession()
  const [followers, setFollowers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await fetch(`/api/v1/members/users/${userId}/followers`)
        const data = await response.json()

        if (!response.ok) throw new Error(data.error)

        setFollowers(data.followers)
      } catch (error) {
        console.error('Error fetching followers:', error)
        toast.error('Failed to load followers')
      } finally {
        setLoading(false)
      }
    }

    fetchFollowers()
  }, [userId])

  const navigateToProfile = (followerId) => {
    router.push(`/profile/${followerId}`)
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
        <h1 className="text-2xl font-bold mb-6">Followers</h1>
        <div className="space-y-4">
          {followers.length > 0 ? (
            followers.map((follower) => (
              <div
                key={follower.id}
                className="flex items-center gap-4 p-4 bg-base-200 rounded-lg cursor-pointer hover:bg-base-300 transition-colors"
                onClick={() => navigateToProfile(follower.id)}
              >
                {follower.avatar ? (
                  <img
                    src={follower.avatar}
                    alt={follower.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
                <div>
                  <h2 className="font-semibold">{follower.name}</h2>
                  <p className="text-sm text-gray-500">{follower.university || follower.email}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No followers yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FollowersPage