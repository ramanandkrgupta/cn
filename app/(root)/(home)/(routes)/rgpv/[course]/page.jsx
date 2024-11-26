import UserSemester from "./MyPage";

const MySemsterPage = ({ params }) => {
  const { course } = params;

  return <UserSemester course={course} />;
};

export default MySemsterPage;
