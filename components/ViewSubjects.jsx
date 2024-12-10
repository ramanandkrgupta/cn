"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ViewSubjects = ({ course, semester }) => {
  const router = useRouter();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/v1/public/subjects/filter/${encodeURIComponent(
            course
          )}/${encodeURIComponent(semester)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch subjects");
        }

        // Access the subjects array from the response
        setSubjects(data.subjects || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (course && semester) {
      fetchSubjects();
    }
  }, [course, semester]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="text-center p-4">
        <p>No subjects found for this course and semester.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <div
          key={subject.id}
          className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer"
          onClick={() => router.push(`/subject/${subject.id}`)}
        >
          <div className="card-body">
            <h2 className="card-title text-lg">{subject.subject_name}</h2>
            <p className="text-sm opacity-75">Code: {subject.subject_code}</p>

            <div className="flex justify-between items-center mt-4">
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat place-items-center">
                  <div className="stat-title">Posts</div>
                  <div className="stat-value">{subject._count.posts}</div>
                </div>
                <div className="stat place-items-center">
                  <div className="stat-title">Videos</div>
                  <div className="stat-value">{subject._count.videos}</div>
                </div>
              </div>
            </div>

            <div className="card-actions justify-end mt-2">
              <button className="btn btn-primary btn-sm">View Content</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewSubjects;
