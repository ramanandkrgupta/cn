"use client";

import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Link from "next/link";

const notifications = [
  { 
    message: "New course on Web Development!", 
    description: "Learn modern web development with React, Next.js and more",
    link: "/post/web-development",
    type: "info"
  },
  { 
    message: "50% off on Data Science courses!", 
    description: "Limited time offer on all Data Science courses",
    link: "/post/data-science",
    type: "success"
  },
  { 
    message: "New UI/UX Design workshop!", 
    description: "Join our interactive workshop and learn design principles",
    link: "/post/design",
    type: "warning"
  },
];

export default function Notification() {
  const [currentNotification, setCurrentNotification] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const intervalId = setInterval(() => {
      setCurrentNotification((prev) =>
        prev === notifications.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isPaused]);

  const handlePrevious = () => {
    setCurrentNotification((prev) =>
      prev === 0 ? notifications.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentNotification((prev) =>
      prev === notifications.length - 1 ? 0 : prev + 1
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return '🎉';
      case 'warning':
        return '🔥';
      default:
        return '📢';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-4">
      <div 
        className="relative bg-base-200 rounded-xl shadow-lg overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-base-300">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ 
              width: `${((currentNotification + 1) / notifications.length) * 100}%` 
            }}
          />
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 pt-5 md:pt-6">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Navigation - Hidden on smallest screens */}
            <button 
              onClick={handlePrevious}
              className="hidden sm:flex btn btn-circle btn-ghost btn-sm"
            >
              <IoIosArrowBack className="w-5 h-5" />
            </button>

            {/* Notification */}
            <Link 
              href={notifications[currentNotification].link}
              className="flex-1 group"
            >
              <div className="flex items-start gap-3 md:gap-4 p-2 rounded-lg transition-all duration-300 hover:bg-base-300">
                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-base-300 group-hover:bg-base-100 text-xl md:text-2xl">
                  {getTypeIcon(notifications[currentNotification].type)}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm md:text-lg mb-0.5 md:mb-1 text-primary line-clamp-1 md:line-clamp-none">
                    {notifications[currentNotification].message}
                  </h3>
                  <p className="text-xs md:text-sm text-base-content/70 line-clamp-1 md:line-clamp-2">
                    {notifications[currentNotification].description}
                  </p>
                </div>

                {/* Counter - Hidden on mobile */}
                <div className="hidden md:flex items-center text-sm text-base-content/50">
                  {currentNotification + 1}/{notifications.length}
                </div>
              </div>
            </Link>

            {/* Navigation - Hidden on smallest screens */}
            <button 
              onClick={handleNext}
              className="hidden sm:flex btn btn-circle btn-ghost btn-sm"
            >
              <IoIosArrowForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Indicators and Navigation */}
        <div className="sm:hidden flex items-center justify-center gap-2 pb-2 px-2">
          <button 
            onClick={handlePrevious}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <IoIosArrowBack className="w-4 h-4" />
          </button>

          <div className="flex justify-center gap-1">
            {notifications.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentNotification 
                    ? 'bg-primary' 
                    : 'bg-base-300'
                }`}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <IoIosArrowForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
