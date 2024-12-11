"use client";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import VideoCard from "@/components/video/VideoCard";
import { useFilterVideo } from "@/libs/hooks/useVideo";
import NoDataFound from "@/components/ui/NoDataFound";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const ViewVid = () => {
  const searchParams = useSearchParams();
  const subId = searchParams.get("subId");
  const course = searchParams.get("name");
  const semester = searchParams.get("sem");
  const category = searchParams.get("category");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterVideo({ course, semester, category, subId });

  const [videos, setVideos] = useState([]);

  useEffect(() => {
    if (fetchedData) {
      setVideos(fetchedData);
    }
    if (error) {
      toast.error("Something went wrong in fetching videos");
    }
  }, [fetchedData, error]);

  return (
    <div>
      <h1 className="select_header">{category}</h1>
      <div className="items-center">
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {videos.length === 0 ? (
              <NoDataFound />
            ) : (
              <div className="grid md:grid-cols-2 mt-[18px] gap-[10px]">
                {videos.map((video, index) => (
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

export default ViewVid;
