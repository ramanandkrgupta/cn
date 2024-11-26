import React from "react";

const Greeting = ({ name }) => {
    const getTimeGreeting = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Good Morning";
        if (hours < 17) return "Good Afternoon";
        if (hours < 21) return "Good Evening";
        return "Good Night";
    };

    return (
        <div className="w-full text-center animate-fade-in text-lg font-semibold text-gray-800 dark:text-gray-200">
            <span className="text-2xl text-gradient bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                {getTimeGreeting()} {name ? `, ${name}!` : "!"}
            </span>
        </div>
    );
};

export default Greeting;
