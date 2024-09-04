"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import zxcvbn from "zxcvbn";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';

import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";
import { UserValidation } from "@/libs/validations/user";
import { auth } from "@/libs/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const RegisterPage = () => {
  
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    const evaluation = zxcvbn(value);
    setPasswordStrength(evaluation.score * 25); // Score is between 0 and 4
    setPasswordMatch(value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(password === value);
  };

  const handleSendOtp = async () => {
     try {
       const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
         'size': 'invisible',
         'callback': (response) => {
           // reCAPTCHA solved - will proceed with signInWithPhoneNumber
         },
         'expired-callback': () => {
           // Reset reCAPTCHA?
         }
       }, auth);

       recaptchaVerifier.render().then((widgetId) => {
         window.recaptchaWidgetId = widgetId;
       });

       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
       window.confirmationResult = confirmationResult;
       setOtpSent(true);
       toast.success("OTP sent to your mobile number");
     } catch (error) {
       console.error("Error sending OTP:", error);
       toast.error("Something went wrong while sending OTP: " + error.message);
     }
   };

  const handleVerifyOtp = async () => {
    try {
      const confirmationResult = window.confirmationResult;
      await confirmationResult.confirm(otp);
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error("Error verifying OTP: " + error);
      toast.error("Invalid OTP");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate user input using the schema
    const userInput = { name, email, phoneNumber, password, confirmPassword };

    try {
      // Validate the user input
      const validation = UserValidation.registration.safeParse(userInput);

      // If validation fails, return error message
      if (!validation.success) {
        validation.error.issues.forEach((err) => {
          toast.error(err.message);
        });
        console.error("Validation errors:", validation.error.issues);
      } else if (password !== confirmPassword) {
        toast.error("Passwords do not match");
      } else {
        // If validation is successful, make the API request
        const response = await axios.post("/api/user/register", userInput, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          toast.success("Successfully registered! Redirecting to login...");
          router.push("/login");
        } else if (response.statusText === "FAILED") {
          toast.error("User with this email already exists");
        } else {
          toast.error("Registration failed");
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
              Create your account
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
                classLabel="label_loinForm"
                classInput="input_loinForm"
                required
              />
              <FormField
                label="Your email"
                type="email"
                name="email"
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                classLabel="label_loinForm"
                classInput="input_loinForm"
                required
              />
              <div className="flex flex-row items-center ">
                <PhoneInput
                  country={"in"} // Restricting to India only
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  inputStyle={{ width: "100%" }}
                  containerStyle={{ width: "80%" }}
                  onlyCountries={['in']} // Restricting to India only
                />
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold mx-2 rounded"
                  onClick={handleSendOtp}
                  disabled={otpSent || isLoading}
                >
                  {otpSent ? "OTP Sent" : "Send OTP"}
                </button>
              </div>
              <div id="recaptcha-container"></div>
              {otpSent && (
                <FormField
                  label="Enter OTP"
                  type="text"
                  name="otp"
                  value={otp}
                  placeholder="123456"
                  onChange={(e) => setOtp(e.target.value)}
                  autoComplete="one-time-code"
                  classLabel="label_loinForm"
                  classInput="input_loinForm"
                />
              )}
              <FormField
                label="Your Password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={handlePasswordChange}
                autoComplete="new-password"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
              <FormField
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={handleConfirmPasswordChange}
                autoComplete="new-password"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showPassword"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  className="mr-2"
                />
                <label htmlFor="showPassword" className="text-white">Show Password</label>
              </div>
              {!passwordMatch && (
                <p className="text-red-500">Passwords do not match</p>
              )}
              <div className="flex gap-1 mr-5 md:mr-0">
                <FormButtons
                  primaryLabel={isLoading ? "Please wait..." : "Register"}
                  secondaryLabel="Back"
                  onPrimaryClick={handleSubmit}
                  onSecondaryClick={() => router.back()}
                  primaryClassName="btn_loginFormPrimary"
                  secondaryClassName="btn_loginFormSecondary"
                />
              </div>
            </form>

            {/* Login Button */}
            <div className="flex justify-center mt-4">
              <button
                type="button"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => router.push('/login')}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPage;