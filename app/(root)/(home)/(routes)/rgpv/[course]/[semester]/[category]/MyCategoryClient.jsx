"use client";

import DataCard from "@/components/cards/DataCard";
import { category } from "@/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
 import { useRouter } from "next/navigation";

const MyCategoryClient = ({ course, semester, subId }) => {
  const router = useRouter();
  // Extract dynamic route parameter (course)
  console.log(course);
  return (
    <div>
     <div className="flex items-center gap-2 onClick={() => router.back()}">
      {/* Back Button */}
      <button onClick={() => router.back()} aria-label="Go Back">
        <ArrowLeft className="w-6 h-6" />
      </button>
        <h1 className="select_header">Select Category</h1>
      </div>
      <small className="text-gray-400">Path: /rgpv/
      <Link href={`/rgpv/${course}`} className="text-blue-500 hover:underline">{course}</Link>/
      <Link href={`/rgpv/${course}/${semester}`} className="text-blue-500 hover:underline">{semester}</Link>
/{subId}

      </small>
      <div className="item-center">
        <div className="grid grid-cols-2 mt-[18px] gap-[18px]">
          {category.map((category, index) => (
            <DataCard
              key={index}
              hrefData={{
                pathname: category === "Videos" ? "/view-vid" : "/view-doc",
                query: {
                  name: course,
                  category: category.name,
                  sem: semester,
                  subId: subId,
                },
              }}
              data={category}
              altMsg={category.description}
              style="bg-[#1c1c24] hover:bg-[#2c2f32] py-2"
              syleName="text-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCategoryClient;
