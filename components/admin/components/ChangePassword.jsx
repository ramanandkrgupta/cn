import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

import FormField from "@/components/ui/FormField";
import { SmallLoading } from "@/public/assets";
import { UserValidation } from "@/libs/validations/user";

const ChangePassword = ({ sessionData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const styleChangePwd = {
    classlabel: "block mb-2 text-sm sm:text-base font-medium text-gray-100",
    classInput:
      "bg-gray-50 border border-gray-300 text-gray-300 text-sm sm:text-base rounded-lg block w-full p-2.5 sm:p-3",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userInput = {
      password: oldPassword,
      password: newPassword,
    };
    try {
      const validation = UserValidation.changepwd.safeParse(userInput);

      if (validation.success === false) {
        const { issues } = validation.error;
        issues.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        const response = await axios.patch(
          "/api/v1/members/users/change-password",
          {
            oldPassword,
            newPassword,
            sessionData,
          }
        );
        if (response.statusText === "FAILED") {
          toast.error(response.data);
        } else {
          toast.success("Successfully changed");
          handleReset();
        }
      }
    } catch (error) {
      console.error("NEXT_AUTH Error: " + error);
      console.log(error);
      toast.error("something went wrong ");
      toast.error(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setOldPassword("");
    setNewPassword("");
  };

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-full md:h-auto">
      <div className="relative p-4 sm:p-5 bg-[#2c2f32] rounded-lg">
        <div className="mb-4 sm:mb-5">
          <FormField
            label="Current Password"
            type="password"
            name="oldPassword"
            value={oldPassword}
            placeholder="Enter old password"
            onChange={(e) => setOldPassword(e.target.value)}
            classLabel={styleChangePwd.classlabel}
            classInput={`${styleChangePwd.classInput} uppercase`}
          />
        </div>
        <div className="mb-4 sm:mb-5">
          <FormField
            label="New Password"
            type="password"
            name="newPassword"
            value={newPassword}
            placeholder="Enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
            classLabel={styleChangePwd.classlabel}
            classInput={`${styleChangePwd.classInput} uppercase`}
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white inline-flex items-center bg-green-400 hover:bg-green-600 font-medium rounded-lg text-sm sm:text-base px-5 py-2.5 sm:px-6 sm:py-3 text-center"
        >
          {isLoading ? <SmallLoading /> : "Change password"}
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
