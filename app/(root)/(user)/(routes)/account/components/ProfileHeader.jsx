import { Crown, Sparkles } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const ProfileHeader = ({ userData, session, stats }) => (
  <div className="bg-base-300 rounded-lg shadow-lg p-6 md:p-8">
    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="relative">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden bg-base-200">
            <Link href="/account/profile">
              <Image
                src={userData?.avatar || '/icons/icon.png'}
                alt="profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
                priority
                loading="eager"
                onError={(e) => {
                  e.target.src = '/icons/icon.png'
                }}
              />
            </Link>
          </div>
          {userData?.role === 'PRO' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center">
              <Crown size={14} className="text-white md:h-5 md:w-5" />
            </div>
          )}
        </div>
        <div>
          <Link href="/account/profile">
            <div className="text-lg md:text-2xl font-semibold text-secondary">
              {userData?.name || session?.user?.name}
            </div>
            <div className="text-sm md:text-base text-gray-500">
              {userData?.email || session?.user?.email}
            </div>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium inline-flex items-center gap-1
              ${
                userData?.role === 'PRO'
                  ? 'bg-primary/10 text-primary'
                  : userData?.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {userData?.role === 'PRO' && <Sparkles size={12} />}
              {userData?.role || 'FREE'} User
            </span>
            {userData?.role === 'PRO' && (
              <span className="text-xs md:text-sm text-gray-500">Lifetime</span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0 grid grid-cols-3 gap-4 md:gap-8 p-4 bg-base-200 rounded-lg md:min-w-[300px]">
        <StatItem label="Uploads" value={stats.uploads} color="text-primary" />
        <StatItem
          label="Downloads"
          value={stats.downloads}
          color="text-secondary"
        />
        <StatItem
          label="Reputation"
          value={stats.reputation}
          color="text-accent"
        />
      </div>
    </div>
  </div>
)
