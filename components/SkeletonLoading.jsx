// components/SkeletonLoading.jsx
import React from 'react'

export const SkeletonLoading = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-600 rounded"></div>
          <div className="h-8 w-48 bg-gray-600 rounded"></div>
        </div>
        <div className="w-32 h-8 bg-gray-600 rounded"></div>
      </div>

      {/* Notifications Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-base-200 p-5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="w-24 h-8 bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
