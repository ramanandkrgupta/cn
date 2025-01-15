'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import { ArrowLeft, Camera, Crown } from 'lucide-react'
import { SkeletonLoading } from '@/components/profile/SkeletonLoading'
import { AvatarSection } from '@/components/profile/AvatarSection'
import { AvatarSelector } from '@/components/profile/AvatarSelector'
import { ProfileForm } from '@/components/profile/ProfileForm'

// Helper function to generate random hex color
const getRandomColor = () => {
  const colors = [
    '0088CC', // Blue
    '00A36C', // Green
    'CD5C5C', // Red
    'FFB347', // Orange
    '9370DB', // Purple
    '40E0D0', // Turquoise
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}


// Avatar categories
const avatarSets = {
  free: [
    '/icons/avatars/free-1.png',
    '/avatars/free/avatar-2.png',
    '/avatars/free/avatar-3.png',
    '/avatars/free/avatar-4.png',
  ],
  pro: [
    '/avatars/premium/3d/3d-1.png',
    '/avatars/premium/3d/3d-2.png',
    '/avatars/premium/3d/3d-3.png',
    '/avatars/premium/3d/3d-4.png',
    '/avatars/premium/anime/anime-1.png',
    '/avatars/premium/anime/anime-2.png',
    '/avatars/premium/anime/anime-3.png',
    '/avatars/premium/anime/anime-4.png',
    '/avatars/premium/pixel/pixel-1.png',
    '/avatars/premium/pixel/pixel-2.png',
    '/avatars/premium/pixel/pixel-3.png',
    '/avatars/premium/pixel/pixel-4.png',
  ],
}

export default function EditProfile() {
  const router = useRouter()
  const { data: session, status, update: updateSession } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [userData, setUserData] = useState({
    name: '',
    avatar: '',
    university: '',
    college: '',
  })

  // New states for colleges data
  const [collegesData, setCollegesData] = useState([])
  const [universities, setUniversities] = useState([])
  const [colleges, setColleges] = useState([])

  // Fetch colleges data
  useEffect(() => {
    const fetchCollegesData = async () => {
      try {
        const response = await fetch('/colleges.json')
        const data = await response.json()
        setCollegesData(data)

        // Extract unique universities
        const uniqueUniversities = [
          ...new Set(data.map((item) => item.university)),
        ].sort()
        setUniversities(uniqueUniversities)
      } catch (error) {
        console.error('Error loading colleges data:', error)
        toast.error('Failed to load educational institutions data')
      }
    }

    fetchCollegesData()
  }, [])

  // Update colleges when university changes
  useEffect(() => {
    if (userData.university) {
      const filteredColleges = collegesData
        .filter((item) => item.university === userData.university)
        .map((item) => item.college)
        .sort()
      setColleges(filteredColleges)
    } else {
      setColleges([])
    }
  }, [userData.university, collegesData])

  // Previous useEffect for authentication remains the same
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/v1/members/users/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData({
          name: data.name || '',
          avatar: data.avatar || '/team/member-1.jpeg',
          university: data.university || '',
          college: data.college || '',
        })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      toast.error('Failed to load profile data')
    } finally {
      setPageLoading(false)
    }
  }

  // Previous handlers remain the same
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))

    // Reset college when university changes
    if (name === 'university') {
      setUserData((prev) => ({ ...prev, university: value, college: '' }))
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }

      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/v1/members/users/avatar', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Failed to upload avatar')

        const data = await response.json()
        setUserData((prev) => ({ ...prev, avatar: data.avatarUrl }))
      } catch (error) {
        console.error('Error handling avatar:', error)
        toast.error('Failed to process image')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/v1/members/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (response.ok) {
        // Update the session with new user data
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: data.name,
            avatar: data.avatar,
          },
        })

        toast.success('Profile updated successfully!')
      } else {
        throw new Error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const [showAvatarSelector, setShowAvatarSelector] = useState(false)

  const handleAvatarSelect = (avatarUrl) => {
    setUserData((prev) => ({ ...prev, avatar: avatarUrl }))
    setShowAvatarSelector(false)
  }

  const handleNameUpdate = async (newName) => {
    try {
      const response = await fetch('/api/v1/members/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
        }),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedUser = await response.json()

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
        },
      })

      // Trigger profile update event
      window.dispatchEvent(new Event('profileUpdate'))

      toast.success('Profile updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }

  if (pageLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="mx-auto px-4 max-w-lg py-6">
          <SkeletonLoading />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-base-100 min-h">
      <div className="mx-auto px-4 max-w-lg py-6 bg-red-950">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.back()} aria-label="Go Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-secondary">
            Edit Profile
          </h1>
        </div>

        <AvatarSection
          userData={userData}
          session={session}
          getRandomColor={getRandomColor}
          onAvatarChange={handleAvatarChange}
          onAvatarSelectorToggle={() =>
            setShowAvatarSelector(!showAvatarSelector)
          }
        />

        <AvatarSelector
          show={showAvatarSelector}
          onClose={() => setShowAvatarSelector(false)}
          onSelect={handleAvatarSelect}
          avatarSets={avatarSets}
          session={session}
        />

        <ProfileForm
          userData={userData}
          session={session}
          universities={universities}
          colleges={colleges}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
