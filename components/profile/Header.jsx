// components/profile/Header.tsx
import React from 'react'
import { ArrowLeft, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'

const Header = ({ streak = 0 }) => {
  const router = useRouter()

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} aria-label="Go Back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-secondary">Profile</h1>
      </div>
      <div className="flex items-center gap-2">
        <Flame className="w-5 h-5 text-orange-500" />
        <span className="text-sm">{streak} streak</span>
      </div>
    </div>
  )
}
export default Header