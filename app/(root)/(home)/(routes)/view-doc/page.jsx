"use client";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import PostCard from "@/components/cards/PostCard";
import { useFilterPost } from "@/libs/hooks/usePost";
import NoDataFound from "@/components/ui/NoDataFound";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { ArrowLeft } from "lucide-react";

const ViewDoc = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");
  const subId = searchParams.get("subId");

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
        Path: 
        <a href={`/category?name=${course}`} className="text-blue-500 hover:underline">
          {course}
        </a>
        /
        <a href={`/semester?name=${course}&category=${category}`} className="text-blue-500 hover:underline">
          {category}
        </a>
        /
        <a href={`/view-subjects?name=${course}&category=${category}&sem=${semester}`} className="text-blue-500 hover:underline">
          {semester}
        </a>
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