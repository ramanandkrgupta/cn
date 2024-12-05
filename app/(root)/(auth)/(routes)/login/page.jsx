"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import { UserValidation } from "@/libs/validations/user";
import { toast } from "sonner";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    await signIn("google", { callbackUrl: "/dashboard" });
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
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit}>
              <Input
                icon={Mail}
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autocomplete="on"
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
                  className="absolute right-              <div className="flex items-center mb-6">
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
                className="w-full py-3 px-4 bg-red-500 text-white font-bold rounded-lg shadow-lg hover:bg-red-600 focus:outline-none"
              >
                Continue with Google
              </button>
            </div>
          </div>
          <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/register" className="text-green-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;