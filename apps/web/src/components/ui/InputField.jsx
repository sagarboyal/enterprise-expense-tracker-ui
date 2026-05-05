import { useState } from 'react';

const InputField = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <div className="relative">
        {/* Left icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          {icon}
        </div>

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-11 py-3.5 text-sm text-gray-900 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-gray-400 ${
            error && isPassword ? "pr-16" : "pr-11"
          } ${
            error
              ? "border-red-500 focus:ring-red-100 bg-red-50"
              : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white hover:border-gray-300 hover:bg-white"
          }`}
        />

        {/* Right icons container */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
          {/* Eye icon for password */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Eye off icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {/* Eye icon */}
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Right error icon */}
          {error && (
            <div className="pointer-events-none">
              <svg
                className="w-4 h-4 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium pl-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
