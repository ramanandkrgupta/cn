// app/(root)/(auth)/(routes)/onboarding/components/BasicInfo.jsx
import { useState } from "react";
import Image from "@/components/CustomImage";
import { Camera } from "lucide-react";

const BasicInfo = ({ formData, setFormData, onNext }) => {
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setFormData({ ...formData, avatar: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = (e) => {
    e.preventDefault();
    // Validate fields
    if (!formData.firstName || !formData.lastName || !formData.phoneNumber) {
      toast.error("Please fill all required fields");
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-2xl font-bold">Basic Information</h2>

      {/* Avatar Upload */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatar-upload"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer"
          >
            <Camera className="w-4 h-4 text-white" />
          </label>
        </div>
        <p className="text-sm text-gray-500">Upload your profile picture</p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">First Name</label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">Last Name</label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="label">Phone Number</label>
        <input
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          className="input input-bordered w-full"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Next
      </button>
    </form>
  );
};

export default BasicInfo;
