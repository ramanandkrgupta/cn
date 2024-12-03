"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Camera } from "lucide-react";

// Skeleton loading component
const SkeletonLoading = () => (
  <div className="animate-pulse">
    {/* Header Skeleton */}
    <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-6 bg-base-300 rounded"></div>
      <div className="h-8 w-48 bg-base-300 rounded"></div>
    </div>

    {/* Avatar Section Skeleton */}
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 rounded-full bg-base-300"></div>
      <div className="mt-3 h-8 w-32 bg-base-300 rounded"></div>
    </div>

    {/* Form Fields Skeleton */}
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2"></div>
        <div className="h-12 w-full bg-base-300 rounded"></div>
      </div>

      {/* Email Field */}
      <div>
        <div className="h-4 w-20 bg-base-300 rounded mb-2"></div>
        <div className="h-12 w-full bg-base-300 rounded"></div>
      </div>

      {/* Submit Button */}
      <div className="h-12 w-full bg-base-300 rounded mt-8"></div>
    </div>
  </div>
);

export default function EditProfile() {
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    avatar: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name || "",
          avatar: data.avatar || "/team/member-1.jpeg",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      try {
        // Convert to base64 for now (you might want to use a proper image upload service)
        const base64 = await convertToBase64(file);
        setUserData(prev => ({ ...prev, avatar: base64 }));
      } catch (error) {
        console.error("Error handling avatar:", error);
        toast.error("Failed to process image");
      }
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Update the session with new user data
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: data.name,
            avatar: data.avatar,
          },
        });

        toast.success("Profile updated successfully!");
      } else {
        throw new Error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="bg-base-100 min-h-screen">
        <div className="mx-auto px-4 max-w-lg py-6">
          <SkeletonLoading />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 min-h">
      <div className="mx-auto px-4 max-w-lg py-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => router.back()} aria-label="Go Back">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold text-secondary">
            Edit Profile
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg relative group">
              <Image
                src={userData.avatar || "/team/member-1.jpeg"}
                alt="avatar"
                width={100}
                height={100}
                className="object-cover w-full h-full"
              />
              <label
                htmlFor="avatar"
                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-6 h-6 text-white" />
              </label>
            </div>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <p className="text-sm text-gray-500 mt-2">Click to change avatar</p>
          </div>

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
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full p-3 rounded-lg shadow-sm bg-base-200"
              required
            />
          </div>

          {/* Email (Non-editable) */}
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-secondary font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={session?.user.email || ""}
              disabled
              className="w-full p-3 rounded-lg shadow-sm bg-base-200 cursor-not-allowed"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 bg-primary text-white font-medium rounded-lg shadow 
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-focus'}`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}