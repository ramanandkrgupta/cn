// app/(root)/(auth)/(routes)/onboarding/components/SkillsInterests.jsx
const SkillsInterests = ({ formData, setFormData, onBack, onSubmit }) => {
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.trim()]
      });
      setInterestInput("");
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)  
    });
  };

  const handleRemoveInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skills & Interests</h2>

      {/* Skills */}
      <div>
        <label className="label">Skills</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add a skill"
          />
          <button 
            type="button"
            onClick={handleAddSkill}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.skills.map((skill, index) => (
            <div 
              key={index}
              className="bg-base-200 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{skill}</span>
              <button
                type="button" 
                onClick={() => handleRemoveSkill(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="label">Interests</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            className="input input-bordered flex-1"
            placeholder="Add an interest" 
          />
          <button
            type="button"
            onClick={handleAddInterest}
            className="btn btn-primary"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.interests.map((interest, index) => (
            <div
              key={index}
              className="bg-base-200 px-3 py-1 rounded-full flex items-center gap-2"
            >
              <span>{interest}</span>
              <button
                type="button"
                onClick={() => handleRemoveInterest(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="label">Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({...formData, bio: e.target.value})}
          className="textarea textarea-bordered w-full h-32"
          placeholder="Tell us about yourself..."
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
        <button
          type="button"
          onClick={onSubmit}
          className="btn btn-primary flex-1"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default SkillsInterests;