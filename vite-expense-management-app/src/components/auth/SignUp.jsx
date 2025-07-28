import React, { useState, useEffect, createContext, useContext } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";
import bgImage from "../../assets/img_04.jpg";

const useForm = ({ defaultValues }) => {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const register = (name) => ({
    name,
    value: values[name],
    onChange: (e) => {
      setValues((prev) => ({ ...prev, [name]: e.target.value }));
      if (errors[name]) {
        const newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    },
  });

  const handleSubmit = (handler) => (e) => {
    e.preventDefault();
    const newErrors = {};
    let valid = true;

    if (!values.fullName) {
      newErrors.fullName = { message: "Full name is required" };
      valid = false;
    }

    if (!values.email) {
      newErrors.email = { message: "Email is required" };
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = { message: "Please enter a valid email address" };
      valid = false;
    }

    if (!values.password) {
      newErrors.password = { message: "Password is required" };
      valid = false;
    } else if (values.password.length < 8) {
      newErrors.password = {
        message: "Password must be at least 8 characters long",
      };
      valid = false;
    }

    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = { message: "Passwords do not match" };
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      const { confirmPassword, ...dataToSend } = values;
      handler(dataToSend);
    }
  };

  const reset = () => {
    setValues(defaultValues);
    setErrors({});
  };

  const setError = (name, { message }) =>
    setErrors((prev) => ({ ...prev, [name]: { message } }));

  return { register, handleSubmit, reset, setError, formState: { errors } };
};

const InputField = ({
  id,
  type = "text",
  placeholder,
  register,
  errors,
  icon,
}) => (
  <div className='relative'>
    <div className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
      {icon}
    </div>
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      {...register(id)}
      className={`w-full pl-10 pr-4 py-3 text-gray-900 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
        errors[id]
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-300"
      }`}
    />
    {errors[id] && (
      <p className='mt-1.5 text-xs text-red-600'>{errors[id].message}</p>
    )}
  </div>
);

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const { token } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  const onSubmitHandler = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/api/auth/public/sign-up", data);
      toast.success(response.data.message || "Registration Successful!");
      reset();
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      if (error?.response?.status === 409) {
        setError("email", {
          message: "This email address is already registered.",
        });
        toast.error("This email is already in use.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className='flex flex-col md:flex-row min-h-screen font-sans bg-white items-stretch'>
      {/* Left Section */}
      <div className='relative md:w-1/2 w-full flex flex-col justify-center items-center text-white p-8 md:p-12 bg-gray-900 overflow-hidden min-h-[50vh]'>
        <div className='absolute inset-0 bg-gradient-to-br from-indigo-900 to-gray-900 opacity-90'></div>
        <div className='absolute top-0 left-0 w-72 h-72 bg-indigo-600/30 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl'></div>
        <div className='absolute bottom-0 right-0 w-72 h-72 bg-red-600/30 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl'></div>

        <div className='relative z-10 flex flex-col items-center justify-center text-center px-4'>
          <h1 className='text-4xl lg:text-5xl font-bold tracking-tight mb-4'>
            Streamline Your Company's Finances
          </h1>
          <p className='text-lg text-indigo-200 mb-6 max-w-lg mx-auto'>
            Join <span className='font-semibold text-white'>Trex</span> and gain
            full control over your enterprise expenses with our intuitive and
            powerful platform.
          </p>
          <img
            src={bgImage}
            alt='Trex Platform Illustration'
            className='mt-4 w-full max-w-lg rounded-lg shadow-2xl'
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/600x400";
            }}
          />
        </div>
      </div>

      {/* Right Section */}
      <div className='flex flex-col justify-center items-center md:w-1/2 w-full p-8 min-h-[50vh]'>
        <div className='w-full max-w-lg md:max-w-md'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-gray-900'>
              Create your account
            </h2>
            <p className='text-gray-600 mt-2'>
              Already have one?{" "}
              <Link
                to='/login'
                className='font-semibold text-indigo-600 hover:text-indigo-500 transition-colors'
              >
                Sign in
              </Link>
            </p>
          </div>

          <form
            className='w-full space-y-4'
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <InputField
              id='fullName'
              type='text'
              placeholder='Full Name'
              register={register}
              errors={errors}
              icon={
                <svg
                  className='w-5 h-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
                </svg>
              }
            />
            <InputField
              id='email'
              type='email'
              placeholder='Email Address'
              register={register}
              errors={errors}
              icon={
                <svg
                  className='w-5 h-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                  />
                </svg>
              }
            />
            <InputField
              id='password'
              type='password'
              placeholder='Password (min. 8 characters)'
              register={register}
              errors={errors}
              icon={
                <svg
                  className='w-5 h-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              }
            />
            <InputField
              id='confirmPassword'
              type='password'
              placeholder='Confirm Password'
              register={register}
              errors={errors}
              icon={
                <svg
                  className='w-5 h-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
                </svg>
              }
            />
            <div className='pt-4'>
              <button
                disabled={loading}
                type='submit'
                className='w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:bg-indigo-400 disabled:cursor-not-allowed'
              >
                {loading && (
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                )}
                {loading ? "Creating Account..." : "Register"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
