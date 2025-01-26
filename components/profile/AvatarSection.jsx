// @/components/profile/AvatarSection.jsx
import Image from 'next/image'
import { Camera, Crown } from 'lucide-react'

export const AvatarSection = ({
  userData,
  session,
  getRandomColor,
  onAvatarChange,
  onAvatarSelectorToggle,
}) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      {/* Main Avatar */}
      <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg relative group">
        <Image
          src={
            userData.avatar ||
            session?.user.avatar ||
            `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
              userData.name || 'NM'
            )}&backgroundColor=${getRandomColor()}`
          }
          alt={`${userData.name}'s avatar`}
          width={100}
          height={100}
          className="object-cover w-full h-full"
          onError={(e) => {
            const seed = encodeURIComponent(userData.name || 'NM')
            e.target.src = `https://api.dicebear.com/6.x/initials/png?seed=${seed}&backgroundColor=${getRandomColor()}`
          }}
        />
        <label
          htmlFor="avatar"
          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          <Camera className="w-6 h-6 text-white" />
        </label>
      </div>

      {/* Premium Indicator */}
      {session?.user?.role === 'PRO' && (
        <div className="absolute -top-2 -right-2 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>

    {/* Avatar Selection Options */}
    <div className="mt-4 flex flex-col items-center gap-2">
      <input
        id="avatar"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onAvatarChange}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAvatarSelectorToggle}
          className="btn btn-sm btn-outline"
        >
          Choose Default Avatar
        </button>
        <label htmlFor="avatar" className="btn btn-sm btn-primary">
          Upload Custom
        </label>
      </div>
    </div>

    <p className="text-sm text-gray-500 mt-2">
      {session?.user?.role === 'PRO'
        ? 'Premium user - All avatar options available'
        : 'Upgrade to PRO for more avatar options'}
    </p>
  </div>
)
