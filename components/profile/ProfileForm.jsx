import { useState, useEffect } from 'react'

export const ProfileForm = ({
  userData,
  session,
  universities,
  colleges,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  const [courseData, setCourseData] = useState(null)
  const [selectedLevel, setSelectedLevel] = useState(userData.level || '')
  const [selectedStream, setSelectedStream] = useState(userData.stream || '')
  const [links, setLinks] = useState(userData.links || []) // Dynamic links
  const [location, setLocation] = useState(userData.location || '')

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch('/courses.json')
        const data = await response.json()
        setCourseData(data)
      } catch (error) {
        console.error('Error loading course data:', error)
      }
    }
    fetchCourseData()
  }, [])

  const getAvailableStreams = () => {
    return courseData && selectedLevel
      ? Object.keys(courseData[selectedLevel])
      : []
  }

  const addLink = () => {
    setLinks([...links, { type: '', url: '' }])
  }

  const updateLink = (index, key, value) => {
    const updatedLinks = links.map((link, i) =>
      i === index ? { ...link, [key]: value } : link
    )
    setLinks(updatedLinks)
    onInputChange({
      target: {
        name: 'links',
        value: updatedLinks,
      },
    })
  }

  const removeLink = (index) => {
    const updatedLinks = links.filter((_, i) => i !== index)
    setLinks(updatedLinks)
    onInputChange({
      target: {
        name: 'links',
        value: updatedLinks,
      },
    })
  }

  const getAvailableDegrees = () => {
    return courseData && selectedLevel && selectedStream
      ? courseData[selectedLevel][selectedStream]?.degrees || []
      : []
  }

  const getAvailableSpecializations = () => {
    return courseData && selectedLevel && selectedStream
      ? courseData[selectedLevel][selectedStream]?.specializations || []
      : []
  }

  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value)
    setSelectedStream('')
    onInputChange({
      ...e,
      target: {
        name: 'level',
        value: e.target.value,
      },
    })
  }

  const handleStreamChange = (e) => {
    setSelectedStream(e.target.value)
    onInputChange({
      ...e,
      target: {
        name: 'stream',
        value: e.target.value,
      },
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Existing Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm text-secondary font-medium">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={userData.name}
          onChange={onInputChange}
          placeholder="Enter your name"
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          required
        />
      </div>

      {/* Existing Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm text-secondary font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={session?.user.email || ''}
          disabled
          className="w-full p-3 rounded-lg shadow-sm bg-base-200 cursor-not-allowed"
        />
      </div>

      {/* Existing University Field */}
      <div className="space-y-2">
        <label
          htmlFor="university"
          className="text-sm text-secondary font-medium"
        >
          University
        </label>
        <select
          id="university"
          name="university"
          value={userData.university}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
        >
          <option value="">Select University</option>
          {universities.map((university) => (
            <option key={university} value={university}>
              {university}
            </option>
          ))}
        </select>
      </div>

      {/* Existing College Field */}
      <div className="space-y-2">
        <label htmlFor="college" className="text-sm text-secondary font-medium">
          College
        </label>
        <select
          id="college"
          name="college"
          value={userData.college}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!userData.university}
        >
          <option value="">Select College</option>
          {colleges.map((college) => (
            <option key={college} value={college}>
              {college}
            </option>
          ))}
        </select>
      </div>

      {/* New Education Level Field */}
      <div className="space-y-2">
        <label htmlFor="level" className="text-sm text-secondary font-medium">
          Education Level
        </label>
        <select
          id="level"
          name="level"
          value={selectedLevel}
          onChange={handleLevelChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          required
        >
          <option value="">Select Education Level</option>
          {courseData &&
            Object.keys(courseData).map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
        </select>
      </div>

      {/* Stream Field */}
      <div className="space-y-2">
        <label htmlFor="stream" className="text-sm text-secondary font-medium">
          Stream
        </label>
        <select
          id="stream"
          name="stream"
          value={selectedStream}
          onChange={handleStreamChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!selectedLevel}
          required
        >
          <option value="">Select Stream</option>
          {getAvailableStreams().map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>
      </div>

      {/* Degree Field */}
      <div className="space-y-2">
        <label htmlFor="degree" className="text-sm text-secondary font-medium">
          Degree
        </label>
        <select
          id="degree"
          name="degree"
          value={userData.degree}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!selectedStream}
          required
        >
          <option value="">Select Degree</option>
          {getAvailableDegrees().map((degree) => (
            <option key={degree.name} value={degree.name}>
              {degree.name} ({degree.years} years, {degree.semesters} semesters)
            </option>
          ))}
        </select>
      </div>

      {/* Specialization Field */}
      <div className="space-y-2">
        <label
          htmlFor="specialization"
          className="text-sm text-secondary font-medium"
        >
          Specialization
        </label>
        <select
          id="specialization"
          name="specialization"
          value={userData.specialization}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!selectedStream}
          required
        >
          <option value="">Select Specialization</option>
          {getAvailableSpecializations().map((spec) => (
            <option key={spec.name} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Year Field */}
      <div className="space-y-2">
        <label htmlFor="year" className="text-sm text-secondary font-medium">
          Current Year
        </label>
        <select
          id="year"
          name="year"
          value={userData.year}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!userData.degree}
          required
        >
          <option value="">Select Year</option>
          {userData.degree &&
            getAvailableDegrees().find((d) => d.name === userData.degree)
              ?.years &&
            Array.from(
              {
                length: getAvailableDegrees().find(
                  (d) => d.name === userData.degree
                ).years,
              },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Year {i + 1}
                </option>
              )
            )}
        </select>
      </div>

      {/* Semester Field */}
      <div className="space-y-2">
        <label
          htmlFor="semester"
          className="text-sm text-secondary font-medium"
        >
          Current Semester
        </label>
        <select
          id="semester"
          name="semester"
          value={userData.semester}
          onChange={onInputChange}
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
          disabled={!userData.degree}
          required
        >
          <option value="">Select Semester</option>
          {userData.degree &&
            getAvailableDegrees().find((d) => d.name === userData.degree)
              ?.semesters &&
            Array.from(
              {
                length: getAvailableDegrees().find(
                  (d) => d.name === userData.degree
                ).semesters,
              },
              (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              )
            )}
        </select>
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <label
          htmlFor="location"
          className="text-sm text-secondary font-medium"
        >
          Location (Optional)
        </label>
        <input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            onInputChange(e)
          }}
          placeholder="Enter your location"
          className="w-full p-3 rounded-lg shadow-sm bg-base-200"
        />
      </div>

      {/* Links Section */}

      {/*  */}


      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-3 px-6 bg-primary text-white font-medium rounded-lg shadow ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-focus'
        }`}
      >
        {isLoading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
