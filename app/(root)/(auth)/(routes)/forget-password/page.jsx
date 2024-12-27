"use client";

import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { UserValidation } from "@/libs/validations/user";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate email
      const validation = UserValidation.forgotPassword.safeParse({ email });
      
      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          toast.error(err.message);
        });
        return;
      }

      const response = await fetch("/api/v1/public/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setIsSubmitted(true);
      toast.success("Password reset email sent if account exists");

    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container items-center justify-center">
      <div className="container items-center justify-center px-6 py-28 mx-auto md:h-screen lg:py-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Reset Password
            </h2>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 mt-2 rounded-lg bg-gray-700 text-gray-200 border border-gray-600 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Reset Password"}
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Mail className="h-8 w-8 text-white" />
                </motion.div>
                <p className="text-gray-300 mb-6">
                  If an account exists for {email}, you will receive a password reset link shortly.
                </p>
              </div>
            )}
          </div>

          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <Link 
              href="/login"
              className="text-sm text-green-400 hover:underline flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}