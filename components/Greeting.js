"use client"; // Ensure this is the first line in the file

import React, { useState, useEffect } from "react";

const Greeting = ({ name }) => {
  const [greeting, setGreeting] = useState("");

  const getTimeGreeting = () => {
    const hours = new Date().getHours();

    if (hours >= 5 && hours < 12) return "Good Morning";
    if (hours >= 12 && hours < 17) return "Good Afternoon";
    if (hours >= 17 && hours < 21) return "Good Evening";
    return "Good Night";
  };

  useEffect(() => {
    setGreeting(getTimeGreeting()); // Initial greeting

    const interval = setInterval(() => {
      setGreeting(getTimeGreeting()); // Update greeting dynamically
    }, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="w-full text-center animate-fade-in text-lg font-semibold text-secondary">
      <span className="text-2xl text-gradient bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
        {greeting} {name ? `, ${name}!` : "!"}
      </span>
    </div>
  );
};

export default Greeting;
