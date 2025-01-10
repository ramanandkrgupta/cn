// app/(root)/(auth)/(routes)/onboarding/components/AcademicDetails.jsx
import { courses, semester } from "@/constants";

const AcademicDetails = ({ formData, setFormData, onNext, onBack }) => {
  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.university || !formData.college || !formData.course || !formData.semester) {
      toast.error("Please fill all required fields");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-2xl font-bold">Academic Details</h2>

      {/* University */}
      <div>
        <label className="label">University</label>
        <input
          type="text"
          value={formData.university}
          onChange={(e) => setFormData({...formData, university: e.target.value})}
          className="input input-bordered w-full"
          placeholder="e.g. RGPV"
          required
        />
      </div>

      {/* College */}  
      <div>
        <label className="label">College</label>
        <input
          type="text"
          value={formData.college}
          onChange={(e) => setFormData({...formData, college: e.target.value})}
          className="input input-bordered w-full" 
          placeholder="Your college name"
          required
        />
      </div>

      {/* Course */}
      <div>
        <label className="label">Course</label>
        <select
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Course</option>
          {courses.map(course => (
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
          value={formData.semester}
          onChange={(e) => setFormData({...formData, semester: e.target.value})}
          className="select select-bordered w-full"
          required
        >
          <option value="">Select Semester</option>
          {semester.map(sem => (
            <option key={sem.id} value={sem.link}>
              {sem.name} Semester
            </option>
          ))}
        </select>
      </div>

      {/* Roll Number */}
      <div>
        <label className="label">Roll Number</label>
        <input
          type="text"
          value={formData.rollNumber}
          onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
          className="input input-bordered w-full"
          required
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button 
          type="button"
          onClick={onBack}
          className="btn btn-outline flex-1"
        >
          Back
        </button>
        <button type="submit" className="btn btn-primary flex-1">
          Next
        </button>
      </div>
    </form>
  );
};

export default AcademicDetails;