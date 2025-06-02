const InputField = ({
  label,
  id,
  type,
  errors,
  register,
  required,
  message,
  className,
  min,
  value,
  autoFocus,
  placeholder,
  readOnly,
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className={`block mb-1 text-sm font-semibold text-gray-900 dark:text-gray-900 `}
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={` px-2 py-2 border  ${
          autoFocus ? "border-2" : ""
        }   outline-none bg-transparent  text-slate-700 rounded-md ${
          errors[id]?.message ? "border-red-500" : "border-slate-700"
        }`}
        {...register(id, {
          required: { value: required, message },
          minLength: min
            ? { value: min, message: "Minimum 6 character is required" }
            : null,
        })}
        readOnly={readOnly}
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
            ></path>
          </svg>
          {errors[id]?.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
