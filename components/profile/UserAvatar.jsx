// components/profile/UserAvatar.tsx
import React from 'react'
import Image from 'next/image'
import { Crown } from 'lucide-react'

const getRandomColor = () => {
  const colors = ['0088CC', '00A36C', 'CD5C5C', 'FFB347', '9370DB', '40E0D0']
  return colors[Math.floor(Math.random() * colors.length)]
}

const UserAvatar = ({ user }) => {
  return (
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
  )
}

export default UserAvatar



