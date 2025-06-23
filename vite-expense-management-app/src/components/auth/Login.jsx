import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/ContextApi";
import toast from "react-hot-toast";
import InputField from "../utils/InputField";
import Buttons from "../utils/Buttons";
import api from "../../services/api";
import logo from "../../assets/brandlogo-cropped.png";

const Login = () => {
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token, setToken } = useMyContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    mode: "onTouched",
  });

  const handleSuccessfulLogin = (token, decodedToken) => {
    const user = {
      fullName: decodedToken.sub,
      roles: decodedToken.roles ? decodedToken.roles.split(",") : [],
    };
    localStorage.setItem("JWT_TOKEN", token);
    localStorage.setItem("USER", JSON.stringify(user));
    console.log("User:", user);
    setToken(token);
    navigate("/");
  };

  const onLoginHandler = async (data) => {
    console.log(data);
    try {
      setLoading(true);
      const response = await api.post("/api/auth/public/sign-in", data);
      console.log(response);

      toast.success("Login Successful");
      reset();

      if (response.status === 200 && response.data.token) {
        setJwtToken(response.data.token);
        const decodedToken = jwtDecode(response.data.token);

        handleSuccessfulLogin(response.data.token, decodedToken);
      } else {
        toast.error(
          "Login failed. Please check your credentials and try again."
        );
      }
    } catch (error) {
      if (error) {
        toast.error("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12'>
      <div className='text-center mb-4'>
        <img
          src={logo}
          alt='Logo'
          className='max-w-[100px] h-auto object-contain mx-auto mb-1 bg-white p-2 rounded-2xl text-shadow-lg'
        />

        <h3 className='font-[Poppins] text-3xl font-bold   text-gray-900 mb-2'>
          Sign In to Trex
        </h3>
        <p className='font-[Poppins] font-light text-gray-400 text-xs w-80 mx-auto'>
          Please enter your email address and password to access your account
          and continue managing your expenses.
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className='w-full max-w-sm bg-white border border-gray-300 shadow-lg rounded-lg p-8 space-y-6'
      >
        <div className='space-y-4'>
          <InputField
            label='Email Address'
            required
            id='username'
            type='email'
            message='Email is required'
            placeholder='Email address'
            register={register}
            errors={errors}
          />
          <InputField
            label='Password'
            required
            id='password'
            type='password'
            message='Password is required'
            placeholder='Password'
            register={register}
            errors={errors}
          />
          <a
            href='/forgot-password'
            className='font-[Poppins] block text-right text-xs text-red-500 hover:text-black font-semibold transition-colors duration-200'
            aria-label='Link'
          >
            Forgot password?
          </a>
        </div>

        <div className='mt-6'>
          <Buttons
            disabled={loading}
            onClickhandler={() => {}}
            className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 transition duration-300'
            type='submit'
          >
            {loading ? <span>Loading...</span> : "Sign in"}
          </Buttons>
        </div>

        <div className='font-[Poppins] text-center text-sm text-gray-600 mt-6'>
          <p>
            New to Trex?{" "}
            <a
              href='/register'
              className='font-[Poppins] text-blue-600 hover:text-black font-light transition-colors duration-200'
            >
              Create an account
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
