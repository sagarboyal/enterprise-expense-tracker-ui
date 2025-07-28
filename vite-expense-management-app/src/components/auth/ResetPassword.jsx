import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

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
      className={`w-full pl-10 pr-4 py-2.5 text-gray-200 bg-gray-700/50 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
        errors[id]
          ? "border-red-500/50 focus:ring-red-400"
          : "border-indigo-400/30 focus:border-indigo-400 focus:ring-indigo-400"
      }`}
    />
    {errors[id] && (
      <p className='mt-1.5 text-xs text-red-400'>{errors[id].message}</p>
    )}
  </div>
);

const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const resetToken = searchParams.get("token");
    if (!resetToken) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }
    setToken(resetToken);
  }, [searchParams, navigate]);

  const handleResetPassword = async (data) => {
    if (!token) {
      toast.error("Cannot reset password without a valid token.");
      return;
    }
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("token", token);
      formData.append("newPassword", data.password);

      await api.post("/api/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      toast.success("Password reset successful! You can now log in.");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Error resetting password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 p-4 font-sans'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-block p-4 bg-white/10 rounded-full shadow-lg mb-4 border border-white/20'>
            <svg
              className='w-16 h-16 text-indigo-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6z'
              ></path>
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-white tracking-tight'>
            Set New Password
          </h1>
          <p className='text-gray-400 mt-3'>
            Your security is important. Choose a strong password.
          </p>
        </div>

        <div className='bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 backdrop-blur-lg'>
          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className='space-y-6'
          >
            <InputField
              id='password'
              type='password'
              placeholder='New Password (min. 8 characters)'
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
              placeholder='Confirm New Password'
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
            <div className='pt-2'>
              <button
                disabled={loading}
                type='submit'
                className='w-full flex justify-center items-center py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300 transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed'
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
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
          <div className='text-center text-sm text-gray-400 mt-8'>
            <Link
              to='/login'
              className='font-semibold text-indigo-400 hover:text-indigo-300 transition-colors'
            >
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
