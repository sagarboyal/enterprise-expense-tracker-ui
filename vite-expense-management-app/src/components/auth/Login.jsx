import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "../../store/ContextApi";
import toast from "react-hot-toast";
import InputField from "../utils/InputField";
import Buttons from "../utils/Buttons";
import api from "../../services/api";
import logo from "../../assets/logo.png";

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
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12'>
      <form
        onSubmit={handleSubmit(onLoginHandler)}
        className='w-full max-w-sm bg-white border border-gray-300 shadow-lg rounded-lg p-8 space-y-6'
      >
        <div className='text-center'>
          <img src={logo} alt='Logo' className='w-20 h-20 mx-auto mb-1' />
          <h1 className='text-3xl font-semibold text-gray-900'>
            Sign in to Trex
          </h1>
          <p className='text-gray-500 text-sm'>
            Enter your email and password to continue.
          </p>
        </div>

        <div className='space-y-2'>
          <InputField
            label='Email Address'
            required
            id='username'
            type='email'
            message='*Email is required'
            placeholder='Email address'
            register={register}
            errors={errors}
          />
          <InputField
            label='Password'
            required
            id='password'
            type='password'
            message='*Password is required'
            placeholder='Password'
            register={register}
            errors={errors}
          />
          <a
            href='/forgot-password'
            className='block text-right text-sm text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200'
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

        <div className='text-center text-sm text-gray-600 mt-6'>
          <p>
            New to Trex?{" "}
            <a
              href='/register'
              className='text-blue-600 hover:text-blue-700 font-semibold'
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
