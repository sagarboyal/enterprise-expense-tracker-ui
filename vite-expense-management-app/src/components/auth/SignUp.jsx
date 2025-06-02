import { useEffect, useState } from "react";
import { useMyContext } from "../../store/ContextApi";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../../services/api";
import InputField from "../utils/InputField";
import Buttons from "../utils/Buttons";
import toast from "react-hot-toast";
import logo from "../../assets/img_04.jpg";
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
    },
    mode: "onTouched",
  });

  const onSubmitHandler = async (data) => {
    const { fullName, email, password } = data;
    const sendData = {
      fullName,
      email,
      password,
    };

    try {
      setLoading(true);
      console.log("Sending data:", sendData);
      const response = await api.post("/api/auth/public/sign-up", sendData);
      console.log("Response:", response);
      toast.success("Register Successful");
      reset();
      if (response.data) {
        navigate("/login");
      }
    } catch (error) {
      if (
        error?.response?.data?.message === "Error: Email is already in use!"
      ) {
        setError("email", { message: "Email is already in use" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className='flex flex-1 flex-col md:flex-row min-h-screen'>
      {/* Left side */}
      <div className='bg-black text-white flex flex-col justify-center items-start px-20 py-5 md:w-1/2 min-h-screen'>
        <h1 className='text-2xl lg:text-4xl font-extrabold mb-5 leading-snug max-w-xl'>
          Manage Enterprise Expenses Effortlessly with{" "}
          <span className='text-red-500'>Trex</span>
        </h1>

        <p className='text-base lg:text-lg text-gray-300 mb-8 max-w-xl'>
          Create your free Trex account and take control of your organization’s
          expenses with real-time tracking, smart analytics, and seamless
          approvals — all in one secure platform.
        </p>

        <img src={logo} alt='Trex Logo' className='w-150 h-auto mt-2' />
      </div>

      {/* Right side */}
      <div className='flex flex-col md:w-1/2 w-full px-3 py-5'>
        <div className='flex flex-1 items-center justify-center'>
          <form
            className='w-full max-w-sm space-y-6'
            onSubmit={handleSubmit(onSubmitHandler)}
          >
            <h2 className='text-left text-2xl font-bold text-gray-800'>
              Sign up to <span className='text-customRed'>Trex</span>
            </h2>

            <div className='flex flex-col gap-4'>
              <InputField
                label='Full Name'
                required
                id='fullName'
                type='text'
                message='*UserName is required'
                placeholder='Enter your full name'
                register={register}
                errors={errors}
              />
              <InputField
                label='Email'
                required
                id='email'
                type='email'
                message='*Email is required'
                placeholder='Enter your email'
                register={register}
                errors={errors}
              />
              <InputField
                label='Password'
                required
                id='password'
                type='password'
                message='*Password is required'
                placeholder='Enter your password'
                register={register}
                errors={errors}
                min={5}
              />
            </div>

            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className='w-full py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 transition duration-300'
              type='text'
            >
              {loading ? <span>Loading...</span> : "Register"}
            </Buttons>
            <div className='text-center text-sm text-gray-600'>
              <span>Already have an account?</span>{" "}
              <a
                href='/login'
                className='text-blue-600 font-medium hover:underline hover:text-blue-700 transition duration-200'
              >
                Sign in &rarr;
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
