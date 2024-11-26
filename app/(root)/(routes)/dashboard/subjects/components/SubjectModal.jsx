"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { courses, semester } from "@/constants";

export default function SubjectModal({
  isOpen,
  onClose,
  subject = null, // Pass subject for edit mode
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    subject_name: "",
    subject_code: "",
    course_name: courses[0]?.name || "", // Default to first course
    semester_code: semester[0]?.name || "First", // Default to first semester
  });

  useEffect(() => {
    if (subject) {
      setFormData({
        subject_name: subject.subject_name,
        subject_code: subject.subject_code,
        course_name: subject.course_name,
        semester_code: subject.semester_code,
      });
    }
  }, [subject]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-base-100 rounded-lg w-full max-w-md p-6">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title */}
          <h2 className="text-xl font-bold mb-4">
            {subject ? "Edit Subject" : "Add New Subject"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Subject Name */}
            <div>
              <label className="label">Subject Name</label>
              <input
                type="text"
                value={formData.subject_name}
                onChange={(e) =>
                  setFormData({ ...formData, subject_name: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="e.g., Engineering Chemistry"
                required
              />
            </div>

            {/* Subject Code */}
            <div>
              <label className="label">Subject Code</label>
              <input
                type="text"
                value={formData.subject_code}
                onChange={(e) =>
                  setFormData({ ...formData, subject_code: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="e.g., BT-101"
                required
              />
            </div>

            {/* Course */}
            <div>
              <label className="label">Course</label>
              <select
                value={formData.course_name}
                onChange={(e) =>
                  setFormData({ ...formData, course_name: e.target.value })
                }
                className="select select-bordered w-full"
                required
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.link}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="label">Semester</label>
              <select
                value={formData.semester_code}
                onChange={(e) =>
                  setFormData({ ...formData, semester_code: e.target.value })
                }
                className="select select-bordered w-full"
                required
              >
                {semester.map((sem) => (
                  <option key={sem.id} value={sem.link}>
                    {sem.name} Semester
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 mt-6">
              <button type="button" onClick={onClose} className="btn btn-ghost">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {subject ? "Update Subject" : "Add Subject"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
