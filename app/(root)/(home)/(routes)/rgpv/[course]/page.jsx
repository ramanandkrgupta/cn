import UserSemester from "./MySemester";
import { courses } from "@/constants";

export async function generateMetadata({ params }) {
  const { course } = params;
  
  const courseDetails = courses.find(c => c.link === course);
  
  // Fallback to formatted course param if no course details found
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
  const { course } = params;
 
  return <UserSemester course={course} />;
};

export default MySemsterPage;
