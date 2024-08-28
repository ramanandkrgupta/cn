import useSWR from "swr";
import fetcher from "../fetcher";

const useVideo = () => {
  const { data, error, isLoading, mutate } = useSWR("/api/video", fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

const useUserVideo = ({ userID }) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/video/${userID}`,
    fetcher
  );
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

const useFilterVideo = ({ course, semester, category, subId }) => {
  const key = `/api/video/filter/${course}/${semester}/${category}/${subId}`;
  const { data, error, isLoading, mutate } = useSWR(key, fetcher);
  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export { useVideo, useUserVideo, useFilterVideo };