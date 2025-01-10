"use client";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import dynamic from 'next/dynamic';

const SubCard = dynamic(() => import('@/components/cards/SubCard'), {
  loading: () => <SkeletonLoading />,
});
const NoDataFound = dynamic(() => import('@/components/ui/NoDataFound'));
const SkeletonLoading = dynamic(() => import('@/components/ui/SkeletonLoading'));

const ViewSubjects = ({ course, semester }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  const [userSelectedData, setUserSelectedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/public/subjects/filter/${encodeURIComponent(course)}/${encodeURIComponent(semester)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch subjects");
      }

      setUserSelectedData(data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
      setUserSelectedData([]);
    } finally {
      setIsLoading(false);
    }
  }, [course, semester]);

  useEffect(() => {
    if (course && semester) {
      fetchData();
    }
  }, [course, semester, fetchData]);

  const data = useMemo(() => (Array.isArray(userSelectedData) ? userSelectedData : []), [userSelectedData]);

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
