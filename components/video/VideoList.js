"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import VideoCard from "@/components/video/VideoCard";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import NoDataFound from "@/components/ui/NoDataFound";
import { useFilterPost } from "@/libs/hooks/usePost";

const VideoList = () => {
  const searchParams = useSearchParams();
  const subId = searchParams.get("subId");
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterPost({ course, semester, category, subId });

  useEffect(() => {
    if (fetchedData) {
      setVideos(fetchedData);
    }
    if (error) {
      console.error("Error fetching videos:", error);
      toast.error("Something went wrong in fetching videos");
    }
  }, [fetchedData, error]);

  const [videos, setVideos] = useState([]);
  const videoData = useMemo(() => videos, [videos]);

  return (
    <div>
      <h1 className="select_header">{category} Videos</h1>
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {videoData.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid md:grid-cols-2 mt-[18px] gap-[10px]">
                {videoData.map((video, index) => (
                  <VideoCard key={index} video={video} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoList;