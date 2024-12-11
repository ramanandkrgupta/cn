"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Calendar, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function RevisionTracker() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevisionData();
  }, []);

  const fetchRevisionData = async () => {
    try {
      const response = await fetch("/api/v1/members/revision-tracker");
      if (!response.ok) throw new Error("Failed to fetch revision data");
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      toast.error("Failed to load revision data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Revision Tracker</h1>

      {/* Revision Progress */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-base-200 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{subject.name}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Progress</span>
              <span className="font-medium">{subject.progress}%</span>
            </div>
            <div className="w-full bg-base-300 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${subject.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
