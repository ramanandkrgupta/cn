"use client" 
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userRole, setUserRole] = useState("FREE"); // Default user role is "FREE"
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInput = {
      name,
      email,
      mobile,
      password,
      role: userRole,
    };

    try {
      const response = await axios.post("/api/user/register", userInput);

      if (response.status === 201) {
        toast.success("Successfully registered! Redirecting to login...");
        router.push("/login");
      } else {
        toast.error("Registration failed");
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
      <!-- form fields and buttons here -->
      <form onSubmit={handleSubmit}>
        <!-- form fields here -->
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>
    </section>
  );
};

export default RegisterPage;