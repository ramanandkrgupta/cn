"use client";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import SubCard from "@/components/cards/SubCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { useFilterSubject } from "@/libs/hooks/useSubject";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const ViewSubjects = ({ course, semester }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [userSelectedData, setUserSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/v1/public/subjects/filter/${encodeURIComponent(
            course
          )}/${encodeURIComponent(semester)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch subjects");
        }

        // Ensure we're setting an array
        setUserSelectedData(data.subjects || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        toast.error("Failed to load subjects");
        setUserSelectedData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (course && semester) {
      fetchData();
    }
  }, [course, semester]);

  // Memoize the data to prevent unnecessary re-renders
  const data = useMemo(
    () => (Array.isArray(userSelectedData) ? userSelectedData : []),
    [userSelectedData]
  );

  return (
    <div>
      <div className="flex items-center gap-2" onClick={() => router.back()}>
        <button aria-label="Go Back">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="select_header">Select Subjects</h1>
      </div>

      <small className="text-gray-400">
        Path: /rgpv/
        <Link
          href={`/rgpv/${course}`}
          className="text-blue-500 hover:underline"
        >
          {course}
        </Link>
        /{semester}
      </small>

      <div className="items-center">
        {isLoading ? (
          <SkeletonLoading />
        ) : data.length === 0 ? (
          <NoDataFound />
        ) : (
          <div className="grid md:grid-cols-2 mt-[18px] gap-[10px]">
            {data.map((item, index) => (
              <SubCard
                key={item.id || index}
                hrefData={{
                  pathname: `/rgpv/${course}/${semester}/${item.subject_code}`,
                }}
                data={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSubjects;
