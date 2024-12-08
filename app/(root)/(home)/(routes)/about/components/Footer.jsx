import React from "react";
import { Instagram, MessageCircle } from "lucide-react"; // Import necessary icons

const Footer = () => {
  return (
    <div className="w-full justify-center pt-5 mt-10 sm:mb-16 border-t-[1px] border-t-[#3F3E45]">
      <p className="font-poppins font-normal text-center text-[18px]  leading-[27px] text-secondary">
        Copyright | 2024 Notes Mates
      </p>
      <div className="flex justify-center space-x-6 mt-3 mb-16">
        {/* Instagram link */}
        <a
          href="https://www.instagram.com/notesmates.in" // Replace with your Instagram link
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-[#E1306C]"
        >
          <Instagram size={24} />
        </a>
        {/* WhatsApp link */}
        <a
          href="" // Replace with your WhatsApp link
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:text-[#25D366]"
        >
          <MessageCircle size={24} />
        </a>
      </div>
    </div>
  );
};

export default Footer;
