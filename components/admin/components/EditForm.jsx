import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const EditForm = ({ data, onClose, onSave, isSubject }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting data: ", formData);

    try {
      const res = await axios.put(
        `/api/${isSubject ? "subject" : "post"}`,
        formData
      );
      console.log("Response: ", res);

      if (res.status === 200) {
        toast.success(
          `${isSubject ? "Subject" : "Post"} updated successfully!`
        );
        onSave(formData);
        onClose();
      } else {
        toast.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data: ", error);
      if (error.response) {
        console.error("Error response: ", error.response);
      }
      toast.error("Something went wrong while updating data");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          Edit {isSubject ? "Subject" : "Post"}
        </h2>
        <form onSubmit={handleSubmit}>
          {isSubject ? (
            <>
              <label>
                Subject Name:
                <input
                  type="text"
                  name="subject_name"
                  value={formData.subject_name}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Course Name:
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Semester Code:
                <input
                  type="text"
                  name="semester_code"
                  value={formData.semester_code}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Subject Code:
                <input
                  type="text"
                  name="subject_code"
                  value={formData.subject_code}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Course Name:
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Category:
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
              <label>
                Semester Code:
                <input
                  type="text"
                  name="semester_code"
                  value={formData.semester_code}
                  onChange={handleChange}
                  className="w-full mb-2 p-2 border rounded"
                />
              </label>
            </>
          )}
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 py-2 px-4 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditForm;
