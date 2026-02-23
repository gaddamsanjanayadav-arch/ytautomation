export default function StepIndicator({ currentStep }) {
  const steps = [
    { number: 1, label: 'Upload Songs' },
    { number: 2, label: 'Generate' },
    { number: 3, label: 'Review Description' },
    { number: 4, label: 'Download Video' },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="relative flex items-center justify-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {currentStep > step.number ? (
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                  currentStep > step.number
                    ? 'bg-blue-500'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="hidden sm:flex items-center justify-between text-sm">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`text-center transition-colors duration-300 ${
              currentStep >= step.number
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
