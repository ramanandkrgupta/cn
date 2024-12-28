import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

// Define static options
const CATEGORIES = [
  "Study Materials",
  "Question Papers",
  "Syllabus",
  "Notes",
  "Other"
];

const COURSES = [
  { id: "cse", name: "Computer Science Engineering" },
  { id: "me", name: "Mechanical Engineering" },
  { id: "ce", name: "Civil Engineering" },
  { id: "ec", name: "Electronics & Communication" }
];

const SEMESTERS = [
  { id: "one", name: "Semester 1" },
  { id: "two", name: "Semester 2" },
  { id: "three", name: "Semester 3" },
  { id: "four", name: "Semester 4" },
  { id: "five", name: "Semester 5" },
  { id: "six", name: "Semester 6" },
  { id: "seven", name: "Semester 7" },
  { id: "eight", name: "Semester 8" }
];

const DocDetails = ({ files, onSubmit }) => {
  const [fileDetails, setFileDetails] = useState([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSettings, setBatchSettings] = useState({
    title: '',
    description: '',
    category: '',
    course: '',
    semester: '',
    subject: null
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Add batch mode toggle
  const BatchModeToggle = () => (
    <div className="flex flex-col gap-2 mb-4 p-4 bg-base-200 rounded-lg">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={batchMode}
          onChange={(e) => setBatchMode(e.target.checked)}
          className="checkbox"
        />
        <span>Apply same settings to all files</span>
      </div>
      {batchMode && (
        <div className="text-sm text-gray-500">
          Note: Individual file names will be preserved. You can still edit individual details after applying batch settings.
        </div>
      )}
    </div>
  );

  // Batch settings form
  const BatchSettingsForm = () => (
    <div className="space-y-4 p-4 bg-base-200 rounded-lg">
      <h3 className="font-semibold">Batch Settings</h3>
      
      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          value={batchSettings.category}
          onChange={(e) => handleBatchSettingChange("category", e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Course */}
      <div>
        <label className="label">Course</label>
        <select
          value={batchSettings.course}
          onChange={(e) => handleBatchSettingChange("course", e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Course</option>
          {COURSES.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Semester */}
      <div>
        <label className="label">Semester</label>
        <select
          value={batchSettings.semester}
          onChange={(e) => handleBatchSettingChange("semester", e.target.value)}
          className="select select-bordered w-full"
        >
          <option value="">Select Semester</option>
          {SEMESTERS.map((sem) => (
            <option key={sem.id} value={sem.id}>
              {sem.name}
            </option>
          ))}
        </select>
      </div>

      {/* Subject */}
      <div>
        <label className="label">Subject</label>
        <select
          value={batchSettings.subject?.subject_code || ""}
          onChange={(e) => {
            const subject = subjects.find(s => s.subject_code === e.target.value);
            handleBatchSettingChange("subject", subject);
          }}
          className="select select-bordered w-full"
          disabled={!subjects.length}
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject.subject_code} value={subject.subject_code}>
              {subject.subject_name} ({subject.subject_code})
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="label">Description (Optional)</label>
        <textarea
          value={batchSettings.description}
          onChange={(e) => handleBatchSettingChange("description", e.target.value)}
          className="textarea textarea-bordered w-full"
          placeholder="Enter common description"
        />
      </div>

      <button
        onClick={applyBatchSettings}
        className="btn btn-primary w-full"
        disabled={!isValidBatchSettings()}
      >
        Apply to All Files
      </button>
    </div>
  );

  // Progress bar component
  const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      ></div>
      <div className="text-sm text-center mt-1">
        {progress}% Complete ({fileDetails.filter(d => isValidFileDetails(d)).length} of {files.length} files)
      </div>
    </div>
  );

  // Initialize file details when files change
  useEffect(() => {
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
      updateProgress(initialDetails);
    }
  }, [files]);

  // Fetch subjects when course or semester changes
  const fetchSubjects = async (courseLink, semesterLink) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/subjects?course=${courseLink}&semester=${semesterLink}`
      );
      if (!response.ok) throw new Error("Failed to fetch subjects");
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to load subjects");
    } finally {
      setLoading(false);
    }
  };

  // Handle batch setting change
  const handleBatchSettingChange = (field, value) => {
    setBatchSettings(prev => ({
      ...prev,
      [field]: value
    }));

    // Fetch subjects if course and semester are selected
    if ((field === "course" || field === "semester") && batchSettings.course && batchSettings.semester) {
      fetchSubjects(
        field === "course" ? value : batchSettings.course,
        field === "semester" ? value : batchSettings.semester
      );
    }
  };

  // Validate batch settings
  const isValidBatchSettings = () => {
    return batchSettings.category && batchSettings.course && 
           batchSettings.semester && batchSettings.subject;
  };

  // Apply batch settings to all files
  const applyBatchSettings = () => {
    setFileDetails(prev => prev.map(detail => ({
      ...detail,
      category: batchSettings.category,
      course: batchSettings.course,
      semester: batchSettings.semester,
      subject: batchSettings.subject,
      description: batchSettings.description || detail.description
    })));
    updateProgress(fileDetails);
    toast.success("Applied settings to all files");
  };

  // Validate individual file details
  const isValidFileDetails = (detail) => {
    return detail.category && detail.course && 
           detail.semester && detail.subject;
  };

  // Update progress
  const updateProgress = (details) => {
    const validFiles = details.filter(d => isValidFileDetails(d)).length;
    const progress = Math.round((validFiles / files.length) * 100);
    setUploadProgress(progress);
  };

  // Handle individual file detail change
  const handleInputChange = (index, field, value) => {
    const newDetails = [...fileDetails];
    newDetails[index] = {
      ...newDetails[index],
      [field]: value
    };
    setFileDetails(newDetails);
    updateProgress(newDetails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate all required fields
    const isValid = fileDetails.every(isValidFileDetails);

    if (!isValid) {
      toast.error("Please fill in all required fields for each file");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(fileDetails);
    } catch (error) {
      console.error('Error submitting files:', error);
      toast.error('Failed to submit files');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BatchModeToggle />
      
      {/* Progress bar */}
      <ProgressBar progress={uploadProgress} />

      {/* Batch settings form */}
      {batchMode && <BatchSettingsForm />}

      {/* Individual file forms */}
      {fileDetails.map((detail, index) => (
        <div
          key={index}
          className="bg-base-200 p-6 rounded-lg space-y-4 relative"
        >
          <span className="absolute top-2 right-2 text-sm text-gray-500">
            File {index + 1} of {files.length}: {files[index]?.file?.name}
          </span>

          {/* Individual file fields */}
          <div>
            <label className="label">Title</label>
            <input
              type="text"
              value={detail.title}
              onChange={(e) => handleInputChange(index, "title", e.target.value)}
              className="input input-bordered w-full"
              placeholder="Enter document title"
              required
            />
          </div>

          {!batchMode && (
            <>
              <div>
                <label className="label">Category</label>
                <select
                  value={detail.category}
                  onChange={(e) => handleInputChange(index, "category", e.target.value)}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Course</label>
                <select
                  value={detail.course}
                  onChange={(e) => {
                    handleInputChange(index, "course", e.target.value);
                    if (detail.semester) {
                      fetchSubjects(e.target.value, detail.semester);
                    }
                  }}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Course</option>
                  {COURSES.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Semester</label>
                <select
                  value={detail.semester}
                  onChange={(e) => {
                    handleInputChange(index, "semester", e.target.value);
                    if (detail.course) {
                      fetchSubjects(detail.course, e.target.value);
                    }
                  }}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Select Semester</option>
                  {SEMESTERS.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Subject</label>
                <select
                  value={detail.subject?.subject_code || ""}
                  onChange={(e) => {
                    const subject = subjects.find(s => s.subject_code === e.target.value);
                    handleInputChange(index, "subject", subject);
                  }}
                  className="select select-bordered w-full"
                  disabled={!subjects.length}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.subject_code} value={subject.subject_code}>
                      {subject.subject_name} ({subject.subject_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={detail.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter document description"
                  required
                />
              </div>
            </>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          disabled={loading || uploadProgress < 100}
          className={`btn btn-primary ${loading ? 'loading' : ''}`}
        >
          {loading ? 'Processing...' : 'Upload Files'}
        </button>
      </div>
    </form>
  );
};

DocDetails.propTypes = {
  files: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DocDetails;
