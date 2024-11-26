"use client";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import SubCard from "@/components/cards/SubCard";
import NoDataFound from "@/components/ui/NoDataFound";
import { useFilterSubject } from "@/libs/hooks/useSubject";
import SkeletonLoading from "@/components/ui/SkeletonLoading";

const ViewSubjects = ({ course, semester }) => {
  const searchParams = useSearchParams();
  // const course = searchParams.get("name");
  // const semester = searchParams.get("sem");
  const category = searchParams.get("category");

  const {
    data: fetchedData,
    error,
    isLoading: loading,
  } = useFilterSubject({ course, semester });

  useEffect(() => {
    if (fetchedData) {
      setUserSelectedData(fetchedData);
    }
    if (error) {
      console.error("Error fetching table data:", error);
      toast.error("Something went wrong in fetching Subjects");
    }
  }, [fetchedData, error]);

  const [userSelectedData, setUserSelectedData] = useState([]);
  const data = useMemo(() => userSelectedData, [userSelectedData]);

  return (
    <div>
      <h1 className="select_header">Select Subjects</h1>
      <small className="text-gray-400">
        Path:
        <a
          href={`/category?name=${course}`}
          className="text-blue-500 hover:underline"
        >
          {course}
        </a>
        /
        <a
          href={`/semester?name=${course}&category=${category}`}
          className="text-blue-500 hover:underline"
        >
          {category}
        </a>
        /{semester}
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
                  <SubCard
                    key={index}
                    hrefData={{
                      pathname: `/rgpv/${course}/${semester}/${item.subject_code}`, // Constructing the path dynamically
                    }}
                    data={item}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default ViewSubjects;
