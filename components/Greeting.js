import React from 'react'

const Greeting = ({ name }) => {
  const getTimeGreeting = () => {
    const hours = new Date().getHours() // Get the current hour (0-23)

    if (hours >= 5 && hours < 12) return 'Good Morning' // Morning: 5 AM to 11:59 AM
    if (hours >= 12 && hours < 17) return 'Good Afternoon' // Afternoon: 12 PM to 4:59 PM
    if (hours >= 17 && hours < 21) return 'Good Evening' // Evening: 5 PM to 8:59 PM
    return 'Good Night' // Night: 9 PM to 4:59 AM
  }

  return (
    <div className="w-full text-center animate-fade-in text-lg font-semibold text-gray-800 dark:text-gray-200">
      <span className="text-2xl text-gradient bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
        {getTimeGreeting()} {name ? `, ${name}!` : '!'}
      </span>
    </div>
  )
}

export default Greeting
