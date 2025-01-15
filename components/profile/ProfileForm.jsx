// @/components/profile/ProfileForm.jsx
export const ProfileForm = ({
  userData,
  session,
  universities,
  colleges,
  isLoading,
  onInputChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-6">
    {/* Name Field */}
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

    {/* Email Field */}
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

    {/* University Field */}
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

    {/* College Field */}
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

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isLoading}
      className={`w-full py-3 px-6 bg-primary text-white font-medium rounded-lg shadow
        ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-focus'
        }`}
    >
      {isLoading ? 'Saving...' : 'Save Changes'}
    </button>
  </form>
)
