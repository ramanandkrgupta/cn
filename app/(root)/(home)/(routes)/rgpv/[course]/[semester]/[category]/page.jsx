import MyCategoryClient from "./MyCategoryClient";
import { courses, semester as semesters, category as categories } from "@/constants";

export async function generateMetadata({ params }) {
  const { course, semester, category } = params;
  
  // Find details from constants
  const courseDetails = courses.find(c => c.link === course);
  const semesterDetails = semesters.find(s => s.link === semester);
  const categoryDetails = categories.find(c => c.link === category);

  // Get course abbreviation safely
  const getCourseAbbr = (courseName) => {
    try {
      const match = courseName.match(/\(([^)]+)\)/);
      return match ? match[1] : courseName;
    } catch (error) {
      return courseName;
    }
  };

  // Format semester name
  const formatSemester = (sem) => {
    return sem?.name || semester.charAt(0).toUpperCase() + semester.slice(1).toLowerCase();
  };

  // Format subject code (BT101 -> BT-101)
  const formatSubjectCode = (code) => {
    const match = code.match(/([A-Za-z]+)(\d+)/);
    return match ? `${match[1]}-${match[2]}` : code;
  };

  const title = courseDetails && semesterDetails
    ? `${formatSubjectCode(category)} - ${getCourseAbbr(courseDetails.name)} - ${formatSemester(semesterDetails)} Semester`
    : `${category.toUpperCase()} - ${course.toUpperCase()} - ${semester.toUpperCase()}`;

  const description = courseDetails 
    ? `Access study materials for ${formatSubjectCode(category)} (${courseDetails.name}) ${formatSemester(semesterDetails)} Semester. 
       Find comprehensive resources including lecture notes, 
       previous year question papers, syllabus, and video lectures. 
       Free educational resources for RGPV University engineering students.`
    : `Access ${category} resources for ${course.toUpperCase()} ${semester} semester at RGPV University`;

  return {
    title,
    description,
    keywords: [
      formatSubjectCode(category),
      getCourseAbbr(courseDetails?.name || course),
      formatSemester(semesterDetails),
      "RGPV",
      "Engineering",
      "Study Materials",
      "Notes",
      "Question Papers",
      "Syllabus"
    ].filter(Boolean).join(", "),
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

const MyCategoryPage = ({ params }) => {
  const { course, semester, category } = params;
  return <MyCategoryClient course={course} semester={semester} subId={category} />;
};

export default MyCategoryPage;
