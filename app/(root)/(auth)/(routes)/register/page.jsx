"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff, User, Phone } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Input from "@/components/ui/Input";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { UserValidation } from "@/libs/validations/user";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc"; // Add this import
// import { FaGithub } from "react-icons/fa"; // Add this import

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [RawPhoneNumber, setRawPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false); // Add new state
  // const [isGithubLoading, setIsGithubLoading] = useState(false); // Add new state

  const router = useRouter(); // Ensure useRouter is defined

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const phoneNumber = `+91${RawPhoneNumber}`;
    const userInput = { name, email, phoneNumber, password };

    try {
      const validation = UserValidation.registration.safeParse(userInput);

      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          toast.error(err.message);
        });
        setIsLoading(false);
        return;
      }

      const response = await axios.post("/api/user/register", userInput);
      const data = response.data;

      if (response.status === 201) {
        toast.success("Successfully registered! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong during registration");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      console.log("Initiating Google signup...");

      await signIn("google", {
        callbackUrl: "/account",
        redirect: true,
      });

      // Note: The code below won't execute due to redirect: true
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("An error occurred during Google sign up");
      setIsGoogleLoading(false);
    }
  };

  // const handleGithubLogin = async () => {
  //   try {
  //     setIsGithubLoading(true);
  //     console.log("Starting GitHub signup...");

  //     await signIn("github", {
  //       callbackUrl: "/account",
  //       redirect: true
  //     });

  //     // Note: The code below won't execute due to redirect: true
  //   } catch (error) {
  //     console.error("GitHub signup error:", error);
  //     toast.error("An error occurred during GitHub sign up");
  //     setIsGithubLoading(false);
  //   }
  // };

  return (
    <>
      <Head>
        <title>Register | Notes Mates</title>
        <meta
          name="description"
          content="Create an account to access premium study materials and exclusive content on Notes Mates."
        />
      </Head>

      <div className="container items-center justify-center">
        <div className="container items-center justify-center md:h-screen lg:py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
                Create Account
              </h2>

              <form onSubmit={handleSignUp}>
                <Input
                  icon={User}
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  icon={Phone}
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={RawPhoneNumber}
                  onChange={(e) => setRawPhoneNumber(e.target.value)}
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
                {error && (
                  <p className="text-red-500 font-semibold mt-2">{error}</p>
                )}
                <PasswordStrengthMeter password={password} />

                <motion.button
                  className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
              font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              focus:ring-offset-gray-900 transition duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Sign Up"
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
                    {isGithubLoading ? "Signing up..." : "Continue with GitHub"}
                  </span>
                </button> */}
              </div>
            </div>
            <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-green-400 hover:underline">
                  Login Here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
