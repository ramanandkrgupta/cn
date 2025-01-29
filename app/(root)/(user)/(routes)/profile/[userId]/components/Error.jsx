import React from 'react'

const Error = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-500">Error</h2>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
)

export default Error
