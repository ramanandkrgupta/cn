"use client";
import { useState, useEffect } from "react";

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
    setGreeting(getTimeGreeting());
    const interval = setInterval(() => {
      setGreeting(getTimeGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in py-4">
      <h1 className="text-xl md:text-2xl font-semibold text-center">
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {greeting}
          {name ? `, ${name}` : ""}
        </span>
      </h1>
    </div>
  );
};

export default Greeting;
