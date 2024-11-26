import MyCategoryClient from "./MyCategoryClient";

const MyCategoryPage = ({ params }) => {
  const { course, semester, category } = params;

  return (
    <MyCategoryClient course={course} semester={semester} subId={category} />
  );
};

export default MyCategoryPage;
