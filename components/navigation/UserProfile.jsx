import Image from 'next/image'
import Link from 'next/link'
import { User2, Bell } from 'lucide-react'

const UserProfile = ({ user }) => {
  if (user) {
    const { image, name, email } = user

    return (
      <div className="flex items-center gap-4">
        {/* Notifications Link */}
        <Link href="/account/notifications" aria-label="Notifications">
          <Bell className="w-6 h-6 text-primary" />
        </Link>

        {/* Profile Details Link */}
        <Link href="/account" className="flex items-center gap-4">
          {image ? (
            <Image
              src={image}
              alt={name || 'User'}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-primary/20"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User2 className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold truncate">{name || 'User'}</h3>
            <p className="text-sm text-gray-500 truncate">{email}</p>
          </div>
        </Link>
      </div>
    )
  }

  // For unauthenticated users
  return (
    <div className="flex gap-4">
      {/* Login Button */}
      <Link
        href="/login"
        className="px-4 py-2 font-semibold rounded-full transition"
        style={{
          backgroundColor: '#F26610', // Vibrant orange
          color: '#ffffff', // White text
        }}
        onMouseEnter={
          (e) => (e.target.style.backgroundColor = '#D8540F') // Darker orange on hover
        }
        onMouseLeave={
          (e) => (e.target.style.backgroundColor = '#F26610') // Original orange
        }
      >
        Login
      </Link>

      {/* Register Button */}
      <Link
        href="/register"
        className="px-4 py-2 font-semibold rounded-full transition"
        style={{
          backgroundColor: '#6B7280', // Gray button color
          color: '#ffffff', // White text
        }}
        onMouseEnter={
          (e) => (e.target.style.backgroundColor = '#4B5563') // Darker gray on hover
        }
        onMouseLeave={
          (e) => (e.target.style.backgroundColor = '#6B7280') // Original gray
        }
      >
        Register
      </Link>
    </div>
  )
}

export default UserProfile
