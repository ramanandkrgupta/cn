"use client";
import { useEffect, useState, useMemo} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { semester } from "@/constants";
import dynamic from 'next/dynamic';
import { usePostStore } from "@/libs/state/useStore";
import { filterSyllabus } from "@/libs/hooks/usefilter";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

// Dynamically import components that aren't needed immediately
const DataCard = dynamic(() => import("@/components/cards/DataCard"), {
  loading: () => <div className="animate-pulse bg-base-300 rounded-lg h-32"></div>
});
const NoDataFound = dynamic(() => import("@/components/ui/NoDataFound"));
const PostViewDialogBox = dynamic(() => import("@/components/models/PostViewDialogBox"));

const UserSemester = ({ course }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const fetchedData = usePostStore((state) => state.posts);

  const [isPostOpen, setIsPostOpen] = useState(false);
  const [data, setData] = useState(null);

  // Memoize filtered syllabus data
  const syllabusData = useMemo(() => {
    if (category !== "Syllabus" || !fetchedData) return null;
    const post = filterSyllabus([course, category], fetchedData);
    return post[0] || null;
  }, [category, course, fetchedData]);

  useEffect(() => {
    if (category === "Syllabus" && syllabusData) {
      setIsPostOpen(true);
      setData(syllabusData);
    }
  }, [syllabusData, category]);

  // Memoize semester grid to prevent unnecessary re-renders
  const SemesterGrid = useMemo(() => (
    <div className="grid grid-cols-2 mt-[18px] gap-[18px]">
      {semester.map((sem, index) => (
        <DataCard
          key={index}
          hrefData={{
            pathname: `/rgpv/${course}/${sem.link}`,
          }}
          data={sem}
          altMsg="select your semester"
          style="bg-[#1c1c24] hover:bg-[#2c2f32] py-2"
          syleName="text-white"
          sem="Semester"
        />
      ))}
    </div>
  ), [course]);

  return (
    <div>
      <div className="flex items-center gap-2" onClick={() => router.back()}>
        <button 
           
          className="hover:opacity-80 transition-opacity"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="select_header">Select Semester</h1>
      </div>

      <small className="text-gray-400">
        Path: /rgpv/
        <Link href={`/rgpv/${course}`} className="text-blue-500 hover:underline">
          {course}
        </Link>
        /{category}
      </small>

      <div className="items-center">
        {category === "V" || category === "S" ? (
          <NoDataFound />
        ) : (
          SemesterGrid
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
