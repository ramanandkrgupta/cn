// @/components/profile/SkeletonLoading.jsx
export const SkeletonLoading = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-6 bg-base-300 rounded"></div>
      <div className="h-8 w-48 bg-base-300 rounded"></div>
    </div>

    {/* Avatar Section Skeleton */}
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-base-300"></div>
      <div className="mt-3 h-8 w-32 bg-base-300 rounded"></div>
    </div>

    {/* Form Fields Skeleton */}
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2"></div>
        <div className="h-12 w-full bg-base-300 rounded"></div>
      </div>

      {/* Email Field */}
      <div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2"></div>
        <div className="h-12 w-full bg-base-300 rounded"></div>
      </div>

      {/* Submit Button */}
      <div className="h-12 w-full bg-base-300 rounded mt-8"></div>
    </div>
  </div>
)
