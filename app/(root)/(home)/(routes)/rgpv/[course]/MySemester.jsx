"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { semester } from "@/constants";
import DataCard from "@/components/cards/DataCard";
import { usePostStore } from "@/libs/state/useStore";
import NoDataFound from "@/components/ui/NoDataFound";
import { filterSyllabus } from "@/libs/hooks/usefilter";
import PostViewDialogBox from "@/components/models/PostViewDialogBox";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const UserSemester = ({ course }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const course = searchParams.get("name");
  const category = searchParams.get("category");

  const fetchedData = usePostStore((state) => state.posts);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [data, setData] = useState(null);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const post = await filterSyllabus([course, category], fetchedData);
        const [syllabusData] = post.map((items) => items);

        if (syllabusData) {
          setIsPostOpen(true);
          setData(syllabusData);
        } else {
          // Handle case where data is not found
          setIsPostOpen(false);
          setData(null);
        }
      } catch (error) {
        // Handle error
        console.error("Error fetching syllabus data:", error);
      }
    };

    if (category === "Syllabus") {
      fetchData();
    }
  }, [category, course, fetchedData]);

  return (
    <div>
      <div className="flex items-center gap-2">
      {/* Back Button */}
      <button onClick={() => router.back()} aria-label="Go Back">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <h1 className="select_header">Select Category</h1>
    </div>
      <small className="text-gray-400">
        Path:
        <a href={`/${course}`} className="text-blue-500 hover:underline">
          {course}
        </a>
        /{category}
      </small>
      {/* Display the "name" query parameter */}
      <div className="items-center">
        {category === "V" || category === "S" ? (
          <NoDataFound />
        ) : (
          <div className="grid grid-cols-2 mt-[18px] gap-[18px]">
            {semester.map((sem, index) => (
              <DataCard
                key={index}
                hrefData={{
                  pathname: `/rgpv/${course}/${sem.link}`,
                  // query: { name: course, category: category, sem: sem.link },
                }}
                data={sem}
                altMsg="select your semester"
                style="bg-[#1c1c24] hover:bg-[#2c2f32] py-2"
                syleName="text-white"
                sem="Semester"
              />
            ))}
          </div>
        )}
      </div>
      {isPostOpen && data && (
        <PostViewDialogBox
          isOpen={isPostOpen}
          setIsOpen={setIsPostOpen}
          data={data}
        />
      )}
    </div>
  );
};

export default UserSemester;
