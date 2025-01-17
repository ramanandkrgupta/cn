// @/components/profile/AvatarSelector.jsx
import { useRouter } from 'next/navigation'
import { Crown } from 'lucide-react'
import Image from 'next/image'

export const AvatarSelector = ({
  show,
  onClose,
  onSelect,
  avatarSets,
  session,
  isLoading,
}) => {
  const router = useRouter()


  const handleAvatarClick = async (avatar) => {
    if (session?.user?.role === 'PRO' || avatarSets.free.includes(avatar)) {
      await onSelect(avatar)
    }
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-base-200 p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Choose an Avatar</h3>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
        </div>

        {/* Free Avatars Section */}
        <div className="mb-8">
          <h4 className="text-md font-medium mb-3">Free Avatars</h4>
          <div className="grid grid-cols-4 gap-4">
            {avatarSets.free.map((avatar, index) => (
              <button
                key={index}
                onClick={() => onSelect(avatar)}
                className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
              >
                <Image
                  src={avatar}
                  alt={`Free avatar ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Premium Sections */}
        {/* Premium Avatars Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-md font-medium">Premium Avatars</h4>
            {session?.user?.role !== 'PRO' && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                PRO Only
              </span>
            )}
          </div>

          {/* 3D Avatars */}
          <div className="mb-6">
            <h5 className="text-sm text-gray-500 mb-2">Anime Girl</h5>
            <div className="grid grid-cols-4 gap-4">
              {avatarSets.pro.slice(0, 4).map((avatar, index) => (
                <button
                  key={index}
                  onClick={() =>
                    session?.user?.role === 'PRO' ? onSelect(avatar) : null
                  }
                  className={`relative aspect-square rounded-lg overflow-hidden group
            ${
              session?.user?.role === 'PRO'
                ? 'hover:ring-2 hover:ring-primary cursor-pointer'
                : 'cursor-not-allowed opacity-75'
            }`}
                >
                  <Image
                    src={avatar}
                    alt={`3D avatar ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  {session?.user?.role !== 'PRO' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Anime Avatars */}
          <div className="mb-6">
            <h5 className="text-sm text-gray-500 mb-2">Anime Boy</h5>
            <div className="grid grid-cols-4 gap-4">
              {avatarSets.pro.slice(4, 8).map((avatar, index) => (
                <button
                  key={index}
                  onClick={() =>
                    session?.user?.role === 'PRO' ? onSelect(avatar) : null
                  }
                  className={`relative aspect-square rounded-lg overflow-hidden group
            ${
              session?.user?.role === 'PRO'
                ? 'hover:ring-2 hover:ring-primary cursor-pointer'
                : 'cursor-not-allowed opacity-75'
            }`}
                >
                  <Image
                    src={avatar}
                    alt={`Anime avatar ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  {session?.user?.role !== 'PRO' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Pixel Art Avatars */}
          <div>
            <h5 className="text-sm text-gray-500 mb-2">Animated Animals</h5>
            <div className="grid grid-cols-4 gap-4">
              {avatarSets.pro.slice(8).map((avatar, index) => (
                <button
                  key={index}
                  onClick={() =>
                    session?.user?.role === 'PRO' ? onSelect(avatar) : null
                  }
                  className={`relative aspect-square rounded-lg overflow-hidden group
            ${
              session?.user?.role === 'PRO'
                ? 'hover:ring-2 hover:ring-primary cursor-pointer'
                : 'cursor-not-allowed opacity-75'
            }`}
                >
                  <Image
                    src={avatar}
                    alt={`Pixel art avatar ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                  {session?.user?.role !== 'PRO' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Crown className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* hii */}

        {avatarSets.free.map((avatar, index) => (
          <button
            key={index}
            onClick={() => handleAvatarClick(avatar)}
            disabled={isLoading}
            className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
          >
            <Image
              src={avatar}
              alt={`Free avatar ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            )}
          </button>
        ))}

        {session?.user?.role !== 'PRO' && (
          <div className="mt-6 p-4 bg-base-300 rounded-lg text-center">
            <p className="text-sm mb-2">
              Upgrade to PRO to unlock all premium avatars!
            </p>
            <button
              onClick={() => router.push('/account/plans')}
              className="btn btn-primary btn-sm"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
