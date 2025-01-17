import React from 'react'
import { CheckIcon } from 'lucide-react'

const Stepper = ({ steps, activeStep }) => {
  return (
    <div className="w-full">
      {/* Desktop View */}
      <ol className="hidden md:flex items-center py-1 space-x-2 sm:space-x-4 text-sm sm:text-base font-medium text-center text-gray-400">
        {steps.map((step, index) => {
          const isCompleted = index <= activeStep
          const isLast = index === steps.length - 1
          return (
            <li
              key={index}
              className={`flex items-center ${
                isCompleted ? 'text-orange-400' : 'text-secondary'
              }`}
            >
              <span
                className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border rounded-full shrink-0 ${
                  isCompleted ? 'border-orange-400' : 'border-secondary'
                }`}
              >
                {index + 1}
              </span>
              {step}
              {!isLast && (
                <svg
                  className="w-3 h-3 ml-2 sm:ml-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 12 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m7 9 4-4-4-4M1 9l4-4-4-4"
                  />
                </svg>
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile View */}
      <div className="md:hidden px-2 py-3">
        <div className="flex flex-col items-start relative">
          {/* Vertical line for mobile */}
          <div className="absolute left-[12px] top-[10px] h-[calc(100%-20px)] w-0.5 bg-gray-200" />

          {steps.map((step, index) => {
            const isCompleted = index < activeStep
            const isCurrent = index === activeStep
            const isLast = index === steps.length - 1

            return (
              <div
                key={index}
                className={`flex items-center ${
                  !isLast ? 'mb-4' : ''
                } relative z-10 w-full`}
              >
                {/* Circle and Text Container */}
                <div className="flex items-center">
                  <div
                    className={`
                    flex items-center justify-center w-6 h-6 rounded-full
                    ${
                      isCompleted
                        ? 'bg-orange-500'
                        : isCurrent
                        ? 'bg-orange-400'
                        : 'bg-gray-200'
                    }
                    ${isCompleted || isCurrent ? 'text-white' : 'text-gray-500'}
                    transition-colors duration-200
                    shrink-0
                  `}
                  >
                    {isCompleted ? (
                      <CheckIcon className="w-3 h-3" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Mobile Text */}
                  <div className="ml-3 min-w-0">
                    <p
                      className={`text-xs font-medium ${
                        isCompleted
                          ? 'text-orange-500'
                          : isCurrent
                          ? 'text-orange-400'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {isCompleted ? 'Done' : isCurrent ? 'Active' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Stepper
