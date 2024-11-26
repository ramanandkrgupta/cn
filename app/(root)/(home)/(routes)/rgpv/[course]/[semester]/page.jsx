import ViewSubjects from "./MySubject";

const MySemsterPage = ({ params }) => {
  const { course, semester } = params;

  return <ViewSubjects course={course} semester={semester} />;
};

export default MySemsterPage;
