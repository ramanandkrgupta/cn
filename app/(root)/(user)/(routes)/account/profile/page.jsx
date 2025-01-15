'use client'
import React from 'react'
import Image from 'next/image'
import {
  ScrollText,
  Award,
  Crown,
  ArrowLeft,
  Building2,
  GraduationCap,
  Calendar,
  Linkedin,
  Users,
  Clock,
  Flame,
  ThumbsUp,
  Upload,
  Download,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const getRandomColor = () => {
  const colors = ['0088CC', '00A36C', 'CD5C5C', 'FFB347', '9370DB', '40E0D0']
  return colors[Math.floor(Math.random() * colors.length)]
}

const ProfilePage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user

  const userStats = {
    semester: '6th',
    year: '3rd',
    linkedin: 'username',
    followers: '120',
    following: '89',
    readingTime: '32hrs',
    streak: '15',
    likes: '234',
    uploads: '12',
    downloads: '45',
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left Section - Profile Info */}
        <div className="w-full lg:w-[40%] bg-base-200 rounded-xl p-6 shadow-lg">
          <div className="flex flex-col">
            {/* Avatar Section */}
            <div className="flex flex-col border-b-2 border-slate-600">
              <div className="left">
                <div className="flex items-center gap-2 mb-6">
                  <button onClick={() => router.back()} aria-label="Go Back">
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <h1 className="text-xl font-semibold text-secondary">
                    Profile
                  </h1>
                </div>
              </div>
              <div className="right flex">
                <div className="relative mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg">
                    <Image
                      src={
                        user?.avatar ||
                        `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
                          user?.name || 'User'
                        )}&backgroundColor=${getRandomColor()}`
                      }
                      alt="Profile"
                      width={128}
                      height={128}
                      className="object-cover"
                    />
                  </div>
                  {user?.role === 'PRO' && (
                    <div className="absolute -top-2 -right-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col ml-2 mb-4">
                  <h1 className="text-lg font-bold">
                    {user?.name || 'User Name'}
                  </h1>
                  <p className="text-sm font-thin">
                    {user?.college || 'College Name'}
                  </p>
                </div>
              </div>
            </div>

            {/* Details Info */}
            <div className="w-full space-y-4 mt-4">
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="font-semibold mb-4">Details</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <p className="text-sm">
                      {user?.university || 'No university added'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <p className="text-sm">Semester: {userStats.semester}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm">Year: {userStats.year}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.linkedin}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="bg-base-300 p-4 rounded-lg">
                <h2 className="font-semibold mb-4">Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.followers} followers</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.following} following</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.readingTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.streak} days</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.likes} likes</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.uploads}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-primary" />
                    <p className="text-sm">{userStats.downloads}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={() => router.push('/account/profile/edit-profile')}
              className="w-full mt-6 py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-focus transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Top Section - Achievements */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg h-[30%] min-h-[200px]">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Achievements</h2>
            </div>

            <div className="overflow-x-auto whitespace-nowrap pb-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center min-w-[200px] h-32 bg-base-300 rounded-lg">
                  <p className="text-base-content/50">No achievements yet</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Uploads */}
          <div className="bg-base-200 rounded-xl p-6 shadow-lg flex-1">
            <div className="flex items-center gap-2 mb-4">
              <ScrollText className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Uploads</h2>
            </div>

            <div className="overflow-y-auto h-[calc(100%-3rem)]">
              <div className="flex items-center justify-center h-48">
                <p className="text-base-content/50">No uploads yet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
