"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, Crown } from "lucide-react";

// Helper function to generate random hex color
const getRandomColor = () => {
  const colors = [
    "0088CC", // Blue
    "00A36C", // Green
    "CD5C5C", // Red
    "FFB347", // Orange
    "9370DB", // Purple
    "40E0D0", // Turquoise
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

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

// Avatar categories
const avatarSets = {
  free: [
    "/avatars/free/avatar-1.png",
    "/avatars/free/avatar-2.png",
    "/avatars/free/avatar-3.png",
    "/avatars/free/avatar-4.png",
  ],
  pro: [
    "/avatars/premium/3d/3d-1.png",
    "/avatars/premium/3d/3d-2.png",
    "/avatars/premium/3d/3d-3.png",
    "/avatars/premium/3d/3d-4.png",
    "/avatars/premium/anime/anime-1.png",
    "/avatars/premium/anime/anime-2.png",
    "/avatars/premium/anime/anime-3.png",
    "/avatars/premium/anime/anime-4.png",
    "/avatars/premium/pixel/pixel-1.png",
    "/avatars/premium/pixel/pixel-2.png",
    "/avatars/premium/pixel/pixel-3.png",
    "/avatars/premium/pixel/pixel-4.png",
  ],
};

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
      const response = await fetch("/api/v1/members/users/profile");
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
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/v1/members/users/avatar", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to upload avatar");

        const data = await response.json();
        setUserData((prev) => ({ ...prev, avatar: data.avatarUrl }));
      } catch (error) {
        console.error("Error handling avatar:", error);
        toast.error("Failed to process image");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/members/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const handleAvatarSelect = (avatarUrl) => {
    setUserData((prev) => ({ ...prev, avatar: avatarUrl }));
    setShowAvatarSelector(false);
  };

  const handleNameUpdate = async (newName) => {
    try {
      const response = await fetch("/api/v1/members/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedUser = await response.json();

      // Update session
      await updateSession({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,
        },
      });

      // Trigger profile update event
      window.dispatchEvent(new Event("profileUpdate"));

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
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
            <div className="relative">
              {/* Main Avatar */}
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg relative group">
                <Image
                  src={
                    userData.avatar ||
                    session?.user.avatar ||
                    `https://api.dicebear.com/6.x/initials/png?seed=${encodeURIComponent(
                      userData.name || "NM"
                    )}&backgroundColor=${getRandomColor()}`
                  }
                  alt={`${userData.name}'s avatar`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const seed = encodeURIComponent(userData.name || "NM");
                    e.target.src = `https://api.dicebear.com/6.x/initials/png?seed=${seed}&backgroundColor=${getRandomColor()}`;
                  }}
                />
                <label
                  htmlFor="avatar"
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-6 h-6 text-white" />
                </label>
              </div>

              {/* Premium Indicator */}
              {session?.user?.role === "PRO" && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Avatar Selection Options */}
            <div className="mt-4 flex flex-col items-center gap-2">
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                  className="btn btn-sm btn-outline"
                >
                  Choose Default Avatar
                </button>
                <label htmlFor="avatar" className="btn btn-sm btn-primary">
                  Upload Custom
                </label>
              </div>
            </div>

            {/* Default Avatar Selector Modal */}
            {showAvatarSelector && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-base-200 p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Choose an Avatar</h3>
                    <button
                      onClick={() => setShowAvatarSelector(false)}
                      className="btn btn-sm btn-ghost"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Free Avatars Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium mb-3">Free Avatars</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {avatarSets.free.map((avatar, index) => (
                        <button
                          key={index}
                          onClick={() => handleAvatarSelect(avatar)}
                          className="relative aspect-square rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
                        >
                          <Image
                            src={avatar}
                            alt={`Free avatar ${index + 1}`}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Premium Avatars Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-md font-medium">Premium Avatars</h4>
                      {session?.user?.role !== "PRO" && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                          PRO Only
                        </span>
                      )}
                    </div>

                    {/* 3D Avatars */}
                    <div className="mb-6">
                      <h5 className="text-sm text-gray-500 mb-2">3D Style</h5>
                      <div className="grid grid-cols-4 gap-4">
                        {avatarSets.pro.slice(0, 4).map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              session?.user?.role === "PRO"
                                ? handleAvatarSelect(avatar)
                                : null
                            }
                            className={`relative aspect-square rounded-lg overflow-hidden group
                              ${
                                session?.user?.role === "PRO"
                                  ? "hover:ring-2 hover:ring-primary cursor-pointer"
                                  : "cursor-not-allowed opacity-75"
                              }`}
                          >
                            <Image
                              src={avatar}
                              alt={`3D avatar ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                            {session?.user?.role !== "PRO" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Anime Avatars */}
                    <div className="mb-6">
                      <h5 className="text-sm text-gray-500 mb-2">
                        Anime Style
                      </h5>
                      <div className="grid grid-cols-4 gap-4">
                        {avatarSets.pro.slice(4, 8).map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              session?.user?.role === "PRO"
                                ? handleAvatarSelect(avatar)
                                : null
                            }
                            className={`relative aspect-square rounded-lg overflow-hidden group
                              ${
                                session?.user?.role === "PRO"
                                  ? "hover:ring-2 hover:ring-primary cursor-pointer"
                                  : "cursor-not-allowed opacity-75"
                              }`}
                          >
                            <Image
                              src={avatar}
                              alt={`Anime avatar ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                            {session?.user?.role !== "PRO" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pixel Art Avatars */}
                    <div>
                      <h5 className="text-sm text-gray-500 mb-2">
                        Pixel Art Style
                      </h5>
                      <div className="grid grid-cols-4 gap-4">
                        {avatarSets.pro.slice(8).map((avatar, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              session?.user?.role === "PRO"
                                ? handleAvatarSelect(avatar)
                                : null
                            }
                            className={`relative aspect-square rounded-lg overflow-hidden group
                              ${
                                session?.user?.role === "PRO"
                                  ? "hover:ring-2 hover:ring-primary cursor-pointer"
                                  : "cursor-not-allowed opacity-75"
                              }`}
                          >
                            <Image
                              src={avatar}
                              alt={`Pixel art avatar ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                            {session?.user?.role !== "PRO" && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Crown className="w-6 h-6 text-primary" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {session?.user?.role !== "PRO" && (
                      <div className="mt-6 p-4 bg-base-300 rounded-lg text-center">
                        <p className="text-sm mb-2">
                          Upgrade to PRO to unlock all premium avatars!
                        </p>
                        <button
                          onClick={() => router.push("/account/plans")}
                          className="btn btn-primary btn-sm"
                        >
                          Upgrade Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mt-2">
              {session?.user?.role === "PRO"
                ? "Premium user - All avatar options available"
                : "Upgrade to PRO for more avatar options"}
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm text-secondary font-medium"
            >
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
            <label
              htmlFor="email"
              className="text-sm text-secondary font-medium"
            >
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
              ${
                isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-primary-focus"
              }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
