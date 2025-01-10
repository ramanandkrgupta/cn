// app/(root)/(auth)/(routes)/onboarding/page.jsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import BasicInfo from "./components/BasicInfo";
import AcademicDetails from "./components/AcademicDetails"; 
import SkillsInterests from "./components/SkillsInterests";

const OnboardingPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: "",
    lastName: "",
    phoneNumber: "",
    avatar: "",
    
    // Academic Details  
    university: "",
    college: "",
    course: "",
    semester: "",
    rollNumber: "",
    batch: "",
    
    // Skills & Interests
    skills: [],
    interests: [],
    bio: ""
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/v1/members/users/onboard", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      toast.success("Profile setup completed!");
      router.push("/account");

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {[1,2,3].map(num => (
            <div 
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
              ${step >= num ? 'bg-primary border-primary text-white' : 'border-gray-300'}`}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Form Steps */}
        {step === 1 && (
          <BasicInfo 
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}

        {step === 2 && (
          <AcademicDetails
            formData={formData} 
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <SkillsInterests
            formData={formData}
            setFormData={setFormData} 
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        )}
      </motion.div>
    </div>
  );
};

export default OnboardingPage;