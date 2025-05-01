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
export async function generateMetadata({ params: paramsPromise }) {
  const params = await paramsPromise;
  const { course } = params;
  const courseDetails = courses.find(c => c.link === course);
  
  // Dynamic Title and Description
  const title = courseDetails 
    ? `${courseDetails.name} - RGPV Engineering Study Materials`
    : `${course.toUpperCase()} - Study Resources at RGPV University`;

  const description = courseDetails
    ? `${courseDetails.description} Access semester-wise study materials, important question papers (PYQs), syllabus, and more for ${courseDetails.name} at RGPV University. Improve your exam preparation with Notes Mates.`
    : `Access study resources, PYQs, semester-wise notes, and syllabus for ${course.toUpperCase()} at RGPV University. Free educational content for engineering students.`;

  // SEO Keywords: Optimized for RGPV, engineering, exams, study materials
  const keywords = [
    course.toUpperCase(),
    "RGPV",
    "Engineering",
    "Study Materials",
    "RGPV Question Papers",
    "RGPV Previous Year Questions",
    "Syllabus",
    "Video Lectures",
    "Exam Preparation",
    "RGPV Important Questions",
    "RGPV Notes Mates",
    "Engineering Exam Resources",
  ]
    .filter(Boolean)
    .join(", ");

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://www.notesmates.in/${course}`,
      image: courseDetails ? courseDetails.image : 'https://www.notesmates.in/default-course-image.jpg',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      image: courseDetails ? courseDetails.image : 'https://www.notesmates.in/default-course-image.jpg',
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
