"use client";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/cards/PostCard";
import { useFilterPost } from "@/libs/hooks/usePost";
import NoDataFound from "@/components/ui/NoDataFound";
// import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const ViewDoc = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");
  const subId = searchParams.get("subId");

  // Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    {/* <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-6 bg-base-300 rounded"></div>
      <div className="h-8 w-48 bg-base-300 rounded"></div>
    </div> */}

    {/* Grid Skeleton */}
    <div className="grid md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-base-300 rounded-lg p-4">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-base-content/10 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-base-content/10 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-base-content/10 rounded w-1/2"></div>
            </div>
          </div>

          {/* Card Body */}
          <div className="space-y-2">
            <div className="h-3 bg-base-content/10 rounded w-full"></div>
            <div className="h-3 bg-base-content/10 rounded w-5/6"></div>
          </div>

          {/* Card Footer */}
          <div className="flex justify-between mt-4">
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
            <div className="h-4 w-16 bg-base-content/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterPost({ course, semester, category, subId });

  const [userSelectedData, setUserSelectedData] = useState([]);

  useEffect(() => {
    if (fetchedData) {
      setUserSelectedData(fetchedData);
    }
    if (error) {
      console.error("Error fetching table data:", error);
      toast.error("Something went wrong in fetching Posts");
    }
  }, [fetchedData, error]);

  const data = useMemo(() => userSelectedData, [userSelectedData]);

  return (
    <div>
      <div className="flex items-center gap-2">
      {/* Back Button */}
      <button onClick={() => router.back()} aria-label="Go Back">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="select_header">{category}</h1>
      </div>
      <small className="text-gray-400">
        Path: rgpv/
        
        <Link href={`/rgpv/${course}`} className="text-blue-500 hover:underline">{course}</Link>/
        <Link href={`/rgpv/${course}/${semester}`} className="text-blue-500 hover:underline">{semester}</Link>/  
        <Link href={`/rgpv/${course}/${semester}/${subId}`} className="text-blue-500 hover:underline">{subId}</Link>

        /{category}
      </small>

      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {data.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid md:grid-cols-2 mt-[18px] gap-[10px]">
                {data.map((item, index) => (
                  <PostCard key={index} data={item} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewDoc;