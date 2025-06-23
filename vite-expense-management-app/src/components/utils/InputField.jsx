const InputField = ({
  label,
  id,
  type = "text",
  errors = {},
  register,
  required = false,
  message = "This field is required",
  className = "",
  min,
  value,
  autoFocus = false,
  placeholder = "",
  readOnly = false,
}) => {
  const baseInputClass = `
    px-2 py-2 
    border 
    outline-none 
    bg-transparent 
    text-slate-700 
    rounded-md 
    transition duration-200 ease-in-out
  `;

  const errorClass = errors[id]?.message
    ? "border-red-500"
    : "border-slate-700";
  const autoFocusClass = autoFocus ? "border-2" : "";

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className='block mb-1 text-sm font-semibold text-gray-900'
        >
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        readOnly={readOnly}
        defaultValue={value}
        autoFocus={autoFocus}
        className={`${baseInputClass} ${errorClass} ${autoFocusClass} ${className}`}
        {...register(id, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: "Minimum 6 characters required" }
            : undefined,
        })}
      />

      {errors[id]?.message && (
        <p className='flex items-center gap-1 text-sm font-medium text-red-600 mt-1'>
          <svg
            className='w-4 h-4 text-red-600'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          {errors[id].message}
        </p>
      )}
    </div>
  );
};

export default InputField;
