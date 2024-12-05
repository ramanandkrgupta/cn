"use client";
import Head from "next/head";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff, User, Phone } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Input from "@/components/ui/Input";
import PasswordStrengthMeter from "@/components/ui/PasswordStrengthMeter";
import { UserValidation } from "@/libs/validations/user";
import { toast } from "sonner";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [RawPhoneNumber, setRawPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

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

      const response = await axios.post("/api/user/register", userInput, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        toast.success("Successfully registered! Redirecting to login...");
        router.push("/login");
      } else if (response.statusText === "FAILED") {
        toast.error("User with this email already exists");
      } else {
        toast.error("Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

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
                  className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none"
                >
                  Continue with Google
                </button>
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