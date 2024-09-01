"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";

import { logo } from "@/public/assets";
import FormButtons from "@/components/ui/FormButtons";
import FormField from "@/components/ui/FormField";
import { UserValidation } from "@/libs/validations/user";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubscribe = async () => {
    if (user.userRole === 'PRO') {
      return;
    }

    try {
      const order_id = `order${new Date().getTime()}`;
      const data = {
        customer_mobile: user.phoneNumber,
        user_token: '271a4848bbd962e07b62466ec7fec8ae',
        amount: '1',
        order_id: order_id,
        redirect_url: 'https://v1.collegenotes.tech/payment-success',
        remark1: 'Subscription',
        remark2: 'PRO Plan',
        route: '1'
      };

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/user/create-order',
        headers: { 
          'Access-Control-Allow-Origin': '*/*', 
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      };

      const response = await axios.request(config);

      if (response.data.status) {
        // Order created successfully, redirect to payment URL
        toast.success("Order created successfully! Redirecting to payment...");
        window.location.href = response.data.result.payment_url;

        // After payment success, check the order status and update user role
        setTimeout(async () => {
          const checkStatusConfig = {
            method: 'post',
            url: '/api/user/check-order-status',
            headers: { 
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({
              user_token: '9856ce42fc26349fe5fab9c6b630e9c6',
              order_id: order_id
            })
          };

          try {
            const statusResponse = await axios.request(checkStatusConfig);
            if (statusResponse.data.message === 'User role updated to PRO.') {
              // User role updated, you might want to refresh session or user data
              toast.success("Payment received! Your subscription is now active.");
              router.reload();
            }
          } catch (statusError) {
            console.error('Error checking order status:', statusError.message);
          }
        }, 10000); // Delay to ensure payment processing is complete
      } else {
        // Handle API error
        console.error('Payment URL creation failed:', response.data.message);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        console.error('Error response:', error.response.data.message);
      } else if (error.request) {
        // Request was made but no response received
        console.error('Error request:', error.request);
      } else {
        // Other errors
        console.error('Error message:', error.message);
      }
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
              />
              <FormField
                label="Your Mobile"
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                placeholder="1234567890"
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="tel"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <FormField
                label="Your Password"
                type="password"
                name="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
              <FormField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                classLabel="label_loinForm"
                classInput="input_loinForm"
              />
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