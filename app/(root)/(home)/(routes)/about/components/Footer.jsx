import React from "react";
import { Instagram, MessageCircle } from "lucide-react"; // Import necessary icons
import Link from "next/link"; // For internal routing

//year
const year = new Date().getFullYear();
const Footer = () => {
  return (
    <footer
      className="w-full pt-5 mt-10 border-t-[1px] border-t-[#3F3E45]"
      aria-label="Footer"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center">
        {/* Copyright Text */}
        <p
          className="font-poppins font-normal text-center sm:text-left text-[18px] leading-[27px] text-secondary mb-4 sm:mb-0"
          aria-label="Copyright Notice"
        >
          © {year} Notes Mates
        </p>

        {/* Navigation Links */}
        <nav
          className="flex flex-wrap justify-center sm:justify-start space-x-4 mb-4 sm:mb-0"
          aria-label="Footer Navigation"
        >
          <Link
            href="/privacy"
            className="text-secondary hover:underline text-sm sm:text-base"
            aria-label="Privacy Policy"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-secondary hover:underline text-sm sm:text-base"
            aria-label="Terms and Conditions"
          >
            Terms and Conditions
          </Link>
        </nav>

        {/* Social Media Links */}
        <div
          className="flex justify-center sm:justify-end space-x-6"
          aria-label="Social Media Links"
        >
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/notesmates.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-[#E1306C]"
            aria-label="Follow us on Instagram"
            title="Follow us on Instagram"
          >
            <Instagram size={24} />
          </a>
          {/* WhatsApp Link */}
          <a
            href="" // Replace with your WhatsApp link
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary hover:text-[#25D366]"
            aria-label="Contact us on WhatsApp"
            title="Contact us on WhatsApp"
          >
            <MessageCircle size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
