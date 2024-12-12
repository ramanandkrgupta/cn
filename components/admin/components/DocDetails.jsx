"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { courses, semester, category } from "@/constants";
import PropTypes from "prop-types";

const DocDetails = ({ files, onSubmit }) => {
  const [fileDetails, setFileDetails] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSettings, setBatchSettings] = useState({
    category: '',
    course: '',
    semester: '',
    subject: null
  });

  // Add batch mode toggle
  const BatchModeToggle = () => (
    <div className="flex items-center gap-2 mb-4 p-4 bg-base-200 rounded-lg">
      <input
        type="checkbox"
        checked={batchMode}
        onChange={(e) => setBatchMode(e.target.checked)}
        className="checkbox"
      />
      <span>Apply same settings to all files</span>
    </div>
  );

  // Apply batch settings to all files
  const applyBatchSettings = () => {
    setFileDetails(prev => prev.map(detail => ({
      ...detail,
      ...batchSettings
    })));
  };

  useEffect(() => {
    if (batchMode) {
      applyBatchSettings();
    }
  }, [batchMode, batchSettings]);

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch subjects when course or semester changes
  const fetchSubjects = async (courseLink, semesterLink) => {
    try {
      setLoading(true);

      if (!courseLink || !semesterLink) {
        setSubjects([]);
        return;
      }

      const response = await fetch(
        `/api/subjects?course=${courseLink}&semester=${semesterLink}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subjects");
      }

      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Watch for course/semester changes to fetch subjects
  useEffect(() => {
    fileDetails.forEach((detail) => {
      if (detail.course && detail.semester) {
        fetchSubjects(detail.course, detail.semester);
      }
    });
  }, [fileDetails.map((d) => `${d.course}-${d.semester}`).join(",")]);

  const handleInputChange = (index, field, value) => {
    setFileDetails((prev) =>
      prev.map((detail, i) => {
        if (i !== index) return detail;

        // If changing course or semester, reset subject selection
        if (field === "course" || field === "semester") {
          return {
            ...detail,
            [field]: value,
            subject: null,
          };
        }

        return { ...detail, [field]: value };
      })
    );
  };

  useEffect(() => {
    console.log("Files received in DocDetails:", files);
    if (files && files.length > 0) {
      const initialDetails = files.map(fileObj => ({
        id: fileObj.id,
        file: fileObj.file,
        hash: fileObj.hash,
        title: fileObj.originalName || '',
        description: '',
        category: '',
        course: '',
        semester: '',
        subject: null,
      }));
      setFileDetails(initialDetails);
    }
  }, [files]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate all required fields
    const isValid = fileDetails.every((detail) => {
      return (
        detail.title &&
        detail.description &&
        detail.category &&
        detail.course &&
        detail.semester &&
        detail.subject // Check if subject is selected
      );
    });

    if (!isValid) {
      toast.error("Please fill in all required fields for each file");
      return;
    }

    setLoading(true);
    try {
      // Format the details before submission
      const formattedDetails = fileDetails.map(detail => ({
        ...detail,
        course_name: detail.course,
        semester_code: detail.semester,
        subject_name: detail.subject?.subject_name || '',
        subject_code: detail.subject?.subject_code || '',
      }));

      await onSubmit(formattedDetails);
    } catch (error) {
      console.error('Error submitting files:', error);
      toast.error('Failed to submit files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {fileDetails.map((detail, index) => (
        <div
          key={index}
          className="bg-base-200 p-6 rounded-lg space-y-4 relative"
        >
          <span className="absolute top-2 right-2 text-sm text-gray-500">
            File: {files[index]?.file?.name}
          </span>

          {/* Title */}
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={detail.title}
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
              className="input input-bordered w-full"
              placeholder="Enter document title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              value={detail.description}
              onChange={(e) =>
                handleInputChange(index, "description", e.target.value)
              }
              className="textarea textarea-bordered w-full"
              placeholder="Enter document description"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="label">Category</label>
            <select
              value={detail.category}
              onChange={(e) =>
                handleInputChange(index, "category", e.target.value)
              }
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Category</option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Course */}
          <div>
            <label className="label">Course</label>
            <select
              value={detail.course}
              onChange={(e) =>
                handleInputChange(index, "course", e.target.value)
              }
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Course</option>
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
              value={detail.semester}
              onChange={(e) =>
                handleInputChange(index, "semester", e.target.value)
              }
              className="select select-bordered w-full"
              required
            >
              <option value="">Select Semester</option>
              {semester.map((sem) => (
                <option key={sem.id} value={sem.link}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="label">Subject</label>
            <select
              value={detail.subject?.id || ""}
              onChange={(e) => {
                const selectedSubject = subjects.find(
                  (s) => s.id === e.target.value
                );
                handleInputChange(index, "subject", selectedSubject);
              }}
              className="select select-bordered w-full"
              required
              disabled={loading || !subjects.length}
            >
              <option value="">
                {loading
                  ? "Loading subjects..."
                  : subjects.length
                  ? "Select Subject"
                  : "Select course and semester first"}
              </option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? "Loading..." : "Upload Files"}
      </button>
    </form>
  );
};

// Add prop types validation
DocDetails.propTypes = {
  files: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DocDetails;
