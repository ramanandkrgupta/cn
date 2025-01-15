// components/profile/Uploads.tsx
import React from 'react'
import { ScrollText } from 'lucide-react'

const Uploads = () => {
  return (
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
  )
}

export default Uploads
