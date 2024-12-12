"use client";
import Image from "next/image";
import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";
import { motion } from "framer-motion";
//import {profile}  from "../../../../../public/img/profile.jpg";
import { nm } from "@/public/icons";
import { User, Lock, Download, Heart, LogOut, Menu } from "lucide-react";
import ChangePassword from "@/components/admin/components/ChangePassword";

const ProfilePage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [plan, setPlan] = useState("FREE");
  const [downloads, setDownloads] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      // Fetch user data, downloads, and favorites
      // fetchUserData();
      fetchDownloads();
      fetchFavorites();
    }
  }, [status, router]);

  useEffect(() => {
    if (session && session.user) {
      setPlan(
        session.user.userRole === "free" ? "premium" : session.user.userRole
      );
    }
  }, [session]);

  const makePayment = async () => {
    try {
      // Create an order on the server
      const { data: order } = await axios.post("/api/user/payment/order", {
        amount: 1, // Amount in smallest currency unit (e.g., 50000 paise = 500 INR)
        currency: "INR",
        receipt: `receipt_${new Date().getTime()}`,
      });

      const options = {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Notes Mates PVT",
        description: "Plan Upgrade",
        order_id: order.id,
        handler: async (response) => {
          const paymentResponse = await axios.post("/api/user/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          if (paymentResponse.data.status === "success") {
            toast.success("Payment successful!");
            // Update plan in your database
          } else {
            toast.alert("Payment verification failed!");
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: session.user.phoneNumber,
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during subscription:", error);
    }
  };

  const fetchDownloads = async () => {
    try {
      const response = await axios.get("/api/user/downloads");
      setDownloads(response.data.downloads);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("/api/user/favorites");
      setFavorites(response.data.favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.alert("New passwords do not match!");
      return;
    }
    try {
      await axios.post("/api/v1/members/users/change-password", {
        oldPassword,
        newPassword,
      });
      toast.alert("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.alert("Failed to change password. Please try again.");
    }
  };

  const handleLogout = async () => {
    // Implement logout logic here
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    return null;
  }

  const { user } = session;

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <div className="bg-base-100 rounded-lg shadow-md p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <Image
                  className="h-20 w-20 rounded-full"
                  src={user.image || "/img/profile.jpg"}
                  alt={user.name}
                  width={200}
                  height={200}
                />
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-500">{user.email}</p>
                </div>
              </div>
              <h4 className="text-lg font-semibold mb-2">
                Current Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </h4>
              {/* Plan Details Table */}
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Plan Comparison</h4>
                <table className="min-w-full bg-base-100 rounded-md">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Feature</th>
                      <th className="py-2 px-4 border-b">Free</th>
                      <th className="py-2 px-4 border-b">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 px-4 border-b">
                        Access to Study Materials
                      </td>
                      <td className="py-2 px-4 border-b text-center">✔️</td>
                      <td className="py-2 px-4 border-b text-center">✔️</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Downloadable PDFs</td>
                      <td className="py-2 px-4 border-b text-center">❌</td>
                      <td className="py-2 px-4 border-b text-center">✔️</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 border-b">Exclusive Content</td>
                      <td className="py-2 px-4 border-b text-center">❌</td>
                      <td className="py-2 px-4 border-b text-center">✔️</td>
                    </tr>
                    {/* Add more features as needed */}
                  </tbody>
                </table>

                {/* Upgrade Button */}
                <div className="mt-4">
                  <button
                    className={`mt-4 flex gap-4 items-center px-6 py-3 rounded-lg font-semibold text-lg text-white ${
                      plan === "pro"
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-violet-800 hover:bg-violet-700"
                    }`}
                    onClick={plan === "pro" ? null : makePayment}
                    disabled={plan === "pro"}
                  >
                    {plan === "pro" ? "Already Subscribed" : "Upgrade to Pro"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <ChangePassword sessionData={user.email} />
          </div>
        );
      case "downloads":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Download History</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {downloads.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {downloads.map((download, index) => (
                    <li
                      key={index}
                      className="py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {download.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(download.date).toLocaleDateString()}
                        </p>
                      </div>
                      <a
                        href={download.url}
                        className="text-purple-600 hover:text-purple-800"
                        download
                      >
                        Download Again
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No downloads yet.</p>
              )}
            </div>
          </div>
        );
      case "favorites":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Favorites</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              {favorites.length > 0 ? (
                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favorites.map((favorite, index) => (
                    <li
                      key={index}
                      className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200"
                    >
                      <div className="w-full flex items-center justify-between p-6 space-x-6">
                        <div className="flex-1 truncate">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-gray-900 text-sm font-medium truncate">
                              {favorite.title}
                            </h3>
                          </div>
                          <p className="mt-1 text-gray-500 text-sm truncate">
                            {favorite.description}
                          </p>
                        </div>
                        <Image
                          className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                          src={favorite.image}
                          alt=""
                        />
                      </div>
                      <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                          <div className="w-0 flex-1 flex">
                            <a
                              href={favorite.url}
                              className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
                            >
                              <span className="ml-3">View</span>
                            </a>
                          </div>
                          <div className="-ml-px w-0 flex-1 flex">
                            <button
                              onClick={() => {
                                /* Implement remove from favorites */
                              }}
                              className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
                            >
                              <span className="ml-3">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No favorites yet.</p>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <nav className="bg-base-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Image src={nm} alt="New Tag Icon" className="w-20" />
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="hidden lg:flex items-center">
            <span className="text-gray-700 mr-4">{user.name}</span>
            <Image
              className="h-8 w-8 rounded-full"
              src={user.image || "/img/profile.jpg"}
              alt={user.name}
              width={200}
              height={200}
            />
          </div>
        </div>
      </nav>

      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          <div
            className={`lg:block lg:col-span-3 xl:col-span-2 ${
              isMenuOpen ? "block" : "hidden"
            }`}
          >
            <nav
              aria-label="Sidebar"
              className="sticky top-4 divide-y divide-gray-300"
            >
              <div className="pb-8 space-y-1">
                {[
                  {
                    name: "Profile",
                    href: "#",
                    icon: User,
                    current: activeTab === "profile",
                  },
                  {
                    name: "Security",
                    href: "#",
                    icon: Lock,
                    current: activeTab === "security",
                  },
                  {
                    name: "Downloads",
                    href: "#",
                    icon: Download,
                    current: activeTab === "downloads",
                  },
                  {
                    name: "Favorites",
                    href: "#",
                    icon: Heart,
                    current: activeTab === "favorites",
                  },
                ].map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? "bg-gray-200 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    aria-current={item.current ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.name.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                  >
                    <item.icon
                      className={`${
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </a>
                ))}
              </div>
              <div className="pt-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50"
                >
                  <LogOut
                    className="text-gray-400 group-hover:text-gray-500 flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                    aria-hidden="true"
                  />
                  <span className="truncate">Log out</span>
                </button>
              </div>
            </nav>
          </div>
          <main className="lg:col-span-9 xl:col-span-10">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
