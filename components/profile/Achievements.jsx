// components/profile/Achievements.tsx
import React from 'react'
import { Award } from 'lucide-react'

const Achievements = () => {
  return (
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
  )
}

export default Achievements
