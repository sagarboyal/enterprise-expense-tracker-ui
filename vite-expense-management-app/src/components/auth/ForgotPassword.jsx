import React, { useState } from "react";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import InputField from "../utils/InputField";
import Buttons from "../utils/Buttons";
import { Divider } from "@mui/material";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMyContext } from "../../store/ContextApi";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useMyContext();

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

  const onPasswordForgotHandler = async (data) => {
    //destructuring email from the data object
    const { email } = data;

    try {
      setLoading(true);

      const formData = new URLSearchParams();
      formData.append("email", email);
      await api.post("/api/auth/public/forgot-password", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      //reset the field by using reset() function provided by react hook form after submit
      reset();

      //showing success message
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error) {
      console.log(error);

      toast.error("Email is not registered. Register to continue");
    } finally {
      setLoading(false);
    }
  };

  //if there is token  exist navigate  the user to the home page if he tried to access the login page
  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className='min-h-[calc(100vh-74px)] flex justify-center items-center bg-gray-50'>
      <form
        onSubmit={handleSubmit(onPasswordForgotHandler)}
        className='sm:w-[450px] w-[360px] bg-white shadow-lg rounded-xl py-10 sm:px-10 px-6'
      >
        <div className='mb-6'>
          <h1 className='text-center text-3xl font-semibold text-gray-800'>
            Forgot Password?
          </h1>
          <p className='text-center text-gray-600'>
            Enter your email reset link will be sent to you.
          </p>
        </div>
        <div className='flex flex-col gap-4'>
          <InputField
            label='Email'
            required
            id='email'
            type='email'
            message='*Email is required'
            placeholder='Enter your email'
            register={register}
            errors={errors}
            className='border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md'
          />
        </div>

        <Buttons
          disabled={loading}
          onClickhandler={() => {}}
          className='mt-6 w-full py-3 bg-black text-white font-semibold rounded-md shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out'
          type='submit'
        >
          {loading ? <span>Loading...</span> : "Send"}
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

export default ForgotPassword;
