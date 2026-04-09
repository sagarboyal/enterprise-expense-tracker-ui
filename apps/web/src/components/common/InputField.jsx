const InputField = ({
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  icon,
}) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
      {icon}
    </div>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full pl-11 pr-4 py-3.5 text-sm text-gray-900 bg-gray-50 border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-gray-400 ${
        error
          ? "border-red-500 focus:ring-red-100 bg-red-50"
          : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-100 focus:bg-white hover:border-gray-300 hover:bg-white"
      }`}
    />
    {error && (
      <p className="mt-1.5 text-xs text-red-500 font-medium pl-1">{error}</p>
    )}
  </div>
);

export default InputField;
