"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { UserValidation } from "@/libs/validations/user";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
// import { FaGithub } from "react-icons/fa";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  // const [isGithubLoading, setIsGithubLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInput = { email, password };

    try {
      const validation = UserValidation.UserLogin.safeParse(userInput);

      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          toast.error(err.message);
        });
        setIsLoading(false);
        return;
      }

      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("SignIn Response:", response);

      if (response.error) {
        toast.error(response.error);
        console.error("SignIn Error:", response.error);
      } else {
        toast.success("Successfully Logged in");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("NEXT_AUTH Error:", error);
      toast.error("Something went wrong during login attempt");
      console.error("Full Error Response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Starting Google login...");

      await signIn("google", {
        callbackUrl: "/account",
        redirect: true,
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("An error occurred during Google login");
      setIsGoogleLoading(false);
    }
  };

  // const handleGithubLogin = async () => {
  //   try {
  //     setIsGithubLoading(true);
  //     console.log("Starting GitHub login...");

  //     await signIn("github", {
  //       callbackUrl: "/account",
  //       redirect: true
  //     });
  //   } catch (error) {
  //     console.error("GitHub login error:", error);
  //     toast.error("An error occurred during GitHub login");
  //     setIsGithubLoading(false);
  //   }
  // };

  

  return (
    <>
    
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
                Welcome Back
              </h2>

              <form onSubmit={handleSubmit}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="on"
                />

                <div className="relative">
                  <Input
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center mb-6">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-green-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <p className="text-red-500 font-semibold mb-2"></p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    "Login"
                  )}
                </motion.button>
              </form>

              <div className="mt-4">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full py-3 px-4 bg-white text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 flex items-center justify-center gap-2 relative"
                >
                  {isGoogleLoading ? (
                    <Loader className="w-5 h-5 animate-spin text-gray-600" />
                  ) : (
                    <FcGoogle className="w-5 h-5" />
                  )}
                  <span>
                    {isGoogleLoading ? "Signing up..." : "Continue with Google"}
                  </span>
                </button>

                {/* <button
                  onClick={handleGithubLogin}
                  disabled={isGithubLoading}
                  className="w-full mt-2 py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 flex items-center justify-center gap-2 relative"
                >
                  {isGithubLoading ? (
                    <Loader className="w-5 h-5 animate-spin text-gray-400" />
                  ) : (
                    <FaGithub className="w-5 h-5" />
                  )}
                  <span>
                    {isGithubLoading ? "Signing in..." : "Continue with GitHub"}
                  </span>
                </button> */}
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-green-400 hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
