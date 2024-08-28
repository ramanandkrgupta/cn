import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";
import { UserValidation } from "@/libs/validations/user";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("FREE"); // Default user role is "FREE"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInput = {
      email,
      name,
      password,
      mobile,
      role: userRole,
    };

    try {
      const validation = UserValidation.UserRegister.safeParse(userInput);

      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          toast.error(err.message);
        });
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        const response = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userInput),
        });

        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Registration failed");
        } else {
          toast.success("Successfully registered! Redirecting to login...");
          router.push("/login");
        }
      }
    } catch (error) {
      console.error("Registration Error: " + error);
      toast.error("Something went wrong during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-28 mx-auto md:h-screen lg:py-0">
        <div>
          <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-white">
            <Image className="w-8 h-8 mr-2" src={logo} alt="logo" />
            College Notes
          </a>
        </div>
        <div className="w-full rounded-lg shadow border md:mt-0 sm:max-w-md xl:p-0 bg-[#1c1c24] border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight md:text-2xl text-white">
              Create an account
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <FormField
                label="Your Name"
                type="text"
                name="name"
                value={name}
                placeholder="John Doe"
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                classLabel="label_registerForm"
                classInput="input_registerForm"
              />
              <FormField
                label="Your Email"
                type="email"
                name="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                classLabel="label_registerForm"
                classInput="input_registerForm"
              />
              <FormField
                label="Mobile Number"
                type="text"
                name="mobile"
                value={mobile}
                placeholder="123-456-7890"
                onChange={(e) => setMobile(e.target.value)}
                autoComplete="tel"
                classLabel="label_registerForm"
                classInput="input_registerForm"
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                classLabel="label_registerForm"
                classInput="input_registerForm"
              />
              <FormField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                classLabel="label_registerForm"
                classInput="input_registerForm"
              />
              <div className="flex gap-1 mr-5 md:mr-0">
                <FormButtons
                  primaryLabel={isLoading ? "Registering..." : "Register"}
                  secondaryLabel="Login"
                  onPrimaryClick={handleSubmit}
                  onSecondaryClick={() => router.push("/login")}
                  primaryClassName="btn_registerForm"
                  secondaryClassName="btn_registerForm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;