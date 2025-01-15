// components/profile/ProfileStats.tsx
import React from 'react'
import { Clock, ThumbsUp, Upload, Download } from 'lucide-react'

const ProfileStats = ({ stats }) => {
  return (
    <div className="bg-base-300 p-4 rounded-lg">
      <h2 className="font-semibold mb-4">Stats</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <p className="text-sm">{stats.readingTime}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4 text-primary" />
          <p className="text-sm">{stats.likes} likes</p>
        </div>
        <div className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          <p className="text-sm">{stats.uploads}</p>
        </div>
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          <p className="text-sm">{stats.downloads}</p>
        </div>
      </div>
    </div>
  )
}

export default ProfileStats
