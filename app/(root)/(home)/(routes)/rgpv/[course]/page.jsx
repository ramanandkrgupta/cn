import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { courses } from "@/constants";

// Dynamically import UserSemester component
const UserSemester = dynamic(() => import("./MySemester"), {
  loading: () => <SemesterSkeleton />
});

// Skeleton loading component
const SemesterSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      <div className="h-8 w-48 bg-gray-300 rounded"></div>
    </div>
    <div className="h-4 w-64 bg-gray-300 rounded mb-6"></div>
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>
      ))}
    </div>
  </div>
);

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { course } = params;
  const courseDetails = courses.find(c => c.link === course);
  
  const title = courseDetails 
    ? courseDetails.name
    : course.toUpperCase();

  const description = courseDetails
    ? `${courseDetails.description} Access comprehensive study materials, semester-wise resources, previous year papers, and more for ${courseDetails.name} at RGPV University. Free educational content for engineering students.`
    : `Access study materials and resources for ${course.toUpperCase()} at RGPV University`;

  return {
    title,
    description,
    keywords: [
      course.toUpperCase(),
      "RGPV",
      "Engineering",
      "Study Materials",
      "Question Papers",
      "Syllabus",
      "Video Lectures"
    ].filter(Boolean).join(", "),
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

const MySemsterPage = ({ params }) => {
  return (
    <Suspense fallback={<SemesterSkeleton />}>
      <UserSemester course={params.course} />
    </Suspense>
  );
};

export default MySemsterPage;

