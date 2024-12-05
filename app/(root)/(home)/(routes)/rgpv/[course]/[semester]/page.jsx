import ViewSubjects from "./MySubject";
import { courses, semester as semesters } from "@/constants";

export async function generateMetadata({ params }) {
  const { course, semester } = params;
  
  // Find course and semester details
  const courseDetails = courses.find(c => c.link === course);
  const semesterDetails = semesters.find(s => s.link === semester);
  
  // Get course abbreviation safely
  const getCourseAbbr = (courseName) => {
    try {
      // Handle cases like "Computer Science & Engineering (CSE)"
      const match = courseName.match(/\(([^)]+)\)/);
      return match ? match[1] : courseName;
    } catch (error) {
      return courseName;
    }
  };

  // Format semester name to be Title Case
  const formatSemester = (sem) => {
    return sem.name.charAt(0).toUpperCase() + sem.name.slice(1).toLowerCase();
  };

  const title = courseDetails && semesterDetails
    ? `${getCourseAbbr(courseDetails.name)} - ${formatSemester(semesterDetails)} Semester`
    : `${course.toUpperCase()} - ${semester.toUpperCase()}`;

  const description = courseDetails 
    ? `${courseDetails.description} Access study materials, previous year question papers, syllabus, and video lectures for ${semesterDetails?.name || semester} semester ${courseDetails.name} at RGPV University. Free educational resources for engineering students.`
    : `Access study materials and resources for ${course.toUpperCase()} ${semester} semester at RGPV University`;

  return {
    title,
    description,
    keywords: [
      course.toUpperCase(),
      semester,
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
  const { course, semester } = params;
  return <ViewSubjects course={course} semester={semester} />;
};

export default MySemsterPage;
