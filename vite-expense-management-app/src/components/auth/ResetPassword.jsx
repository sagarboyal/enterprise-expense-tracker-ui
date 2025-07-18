import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import { Divider } from "@mui/material";
import InputField from "../utils/InputField";
import toast from "react-hot-toast";
import Buttons from "../utils/Buttons";

const ResetPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
    mode: "onTouched",
  });

  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const handleResetPassword = async (data) => {
    const { password } = data;

    const token = searchParams.get("token");

    setLoading(true);
    try {
      const formData = new URLSearchParams();

      formData.append("token", token);
      formData.append("newPassword", password);
      const res = await api.post("/api/auth/public/reset-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      toast.success("Password reset successful! You can now log in.");
      reset();
      navigate("/login");
    } catch (error) {
      toast.error("Error resetting password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-[calc(100vh-74px)] flex justify-center items-center bg-gray-50'>
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className='sm:w-[450px] w-[360px] bg-white shadow-lg rounded-xl py-10 sm:px-10 px-6'
      >
        <div className='mb-6'>
          <h1 className='text-center text-3xl font-semibold text-gray-800'>
            Update Your Password
          </h1>
          <p className='text-center text-gray-600'>
            Enter your new password to update it
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <InputField
            label='Password'
            required
            id='password'
            type='password'
            message='*Password is required'
            placeholder='Enter your password'
            register={register}
            errors={errors}
            min={6}
            className='border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md'
          />
        </div>

        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className='mt-6 w-full py-3 bg-black text-white font-semibold rounded-md shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out'
          type='submit'
        >
          {loading ? <span>Loading...</span> : "Submit"}
        </Buttons>

        <p className='mt-4 text-center text-sm text-gray-700'>
          <Link className='underline hover:text-black' to='/login'>
            Back to Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
