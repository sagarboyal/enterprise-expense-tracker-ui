import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../../store/ContextApi";
import LegalModal from "./LegalModal";
import InputField from "../../common/InputField";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState("personal"); // 'personal' | 'business'
  const { token } = useMyContext();
  const navigate = useNavigate();

  const [legalModalConfig, setLegalModalConfig] = useState({
    isOpen: false,
    type: null,
  });

  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { id, value } = e.target;
    setValues((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    let valid = true;

    if (accountType === "business" && !values.companyName) {
      newErrors.companyName = "Company name is required";
      valid = false;
    }

    if (!values.fullName) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }

    if (!values.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!values.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (values.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const dataToSend = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        accountType,
      };
      if (accountType === "business") {
        dataToSend.companyName = values.companyName;
      }

      const response = await api.post("/api/auth/public/sign-up", dataToSend);
      toast.success(response.data.message || "Registration Successful!");

      setValues({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
      });

      navigate("/login");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      if (error?.response?.status === 409) {
        setErrors((prev) => ({
          ...prev,
          email: "This email address is already registered.",
        }));
        toast.error("This email is already in use.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    toast.success("Google sign-in flow would start here.");
    // Implement Google Auth Logic
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  return (
    <div className="flex min-h-screen font-sans bg-[#FAFAFA]">
      {/* Left Section - Abstract Modern Art */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-black overflow-hidden flex-col justify-between p-12">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 blur-[120px] opacity-60 mix-blend-screen animate-pulse duration-10000"></div>
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[80%] rounded-full bg-gradient-to-tr from-rose-500 to-orange-500 blur-[140px] opacity-40 mix-blend-screen"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[80%] h-[60%] rounded-full bg-gradient-to-tl from-emerald-500 to-teal-400 blur-[130px] opacity-30 mix-blend-screen"></div>

          {/* Subtle grid overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDEwaDQwTTAgMjBoNDBNMCAzMGg0ME0xMCAwdjQwTTIwIDB2NDBNMzAgMHY0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-50"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-16">
            <Link
              to="/"
              className="group inline-flex items-center gap-2 transition-transform active:scale-95"
            >
              <span className="text-3xl font-black tracking-tighter text-white">
                TREX<span className="text-indigo-500">.</span>
              </span>
            </Link>
          </div>

          <div className="mt-20">
            <h1 className="text-5xl font-bold text-white tracking-tight mb-8 leading-[1.1]">
              Redefining <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Financial Control
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-md font-light leading-relaxed">
              Experience the next generation of expense management. Secure,
              intuitive, and designed for modern teams.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-4 mb-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://i.pravatar.cc/100?img=${i + 10}`}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center text-black font-bold text-sm">
              +2k
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Trusted by forward-thinking companies worldwide.
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[55%] p-6 sm:p-12 relative">
        <div className="w-full max-w-[440px]">
          {/* Mobile branding */}
          <div className="flex lg:hidden items-center gap-3 mb-10 justify-center">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-black text-xl tracking-tighter">
                Tx
              </span>
            </div>
            <span className="text-black font-bold text-2xl tracking-wide">
              Trex
            </span>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
              Create an account
            </h2>
            <p className="text-gray-500 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-black hover:underline transition-all"
              >
                Sign in instead
              </Link>
            </p>
          </div>

          {/* Account Type Toggle */}
          <div className="flex p-1 mb-8 bg-gray-100/80 rounded-2xl border border-gray-200/50">
            <button
              type="button"
              onClick={() => {
                setAccountType("personal");
                setErrors((prev) => ({ ...prev, companyName: null }));
              }}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                accountType === "personal"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setAccountType("business")}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                accountType === "business"
                  ? "bg-white text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Business
            </button>
          </div>

          {accountType === "personal" && (
            <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex justify-center items-center gap-3 py-3.5 px-4 mb-6 bg-white border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </button>

              <div className="flex items-center mb-6">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="px-4 text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Or register with email
                </span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>
            </>
          )}

          <form className="w-full space-y-4" onSubmit={onSubmitHandler}>
            {accountType === "business" && (
              <InputField
                id="companyName"
                type="text"
                placeholder="Company Name"
                value={values.companyName}
                onChange={handleChange}
                error={errors.companyName}
                icon={
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                    />
                  </svg>
                }
              />
            )}

            <InputField
              id="fullName"
              type="text"
              placeholder="Full Name"
              value={values.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              }
            />

            <InputField
              id="email"
              type="email"
              placeholder="Email Address"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              }
            />

            <InputField
              id="password"
              type="password"
              placeholder="Password (min. 8 chars)"
              value={values.password}
              onChange={handleChange}
              error={errors.password}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
            />

            <InputField
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={values.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  />
                </svg>
              }
            />

            <button
              disabled={loading}
              type="submit"
              className="w-full flex justify-center items-center py-3.5 px-4 mt-8 bg-black text-white font-semibold rounded-2xl hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-black/10"
            >
              {loading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : accountType === "business" ? (
                "Create Business Account"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              By signing up, you agree to our{" "}
              <button
                type="button"
                onClick={() =>
                  setLegalModalConfig({ isOpen: true, type: "terms" })
                }
                className="text-black font-medium hover:underline focus:outline-none"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                onClick={() =>
                  setLegalModalConfig({ isOpen: true, type: "privacy" })
                }
                className="text-black font-medium hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>

      <LegalModal
        isOpen={legalModalConfig.isOpen}
        onClose={() => setLegalModalConfig({ isOpen: false, type: null })}
        title={
          legalModalConfig.type === "terms"
            ? "Terms of Service"
            : "Privacy Policy"
        }
        content={
          legalModalConfig.type === "terms" ? (
            <>
              <p>
                By accessing or using Trex, you agree to be bound by these Terms
                of Service. We reserve the right to update or modify these terms
                at any time.
              </p>
              <p>
                Your continued use of the platform constitutes acceptance of
                those changes. Please read these terms carefully before using
                our services.
              </p>
            </>
          ) : (
            <>
              <p>
                Your privacy is important to us. It is Trex's policy to respect
                your privacy regarding any information we may collect from you
                across our website and applications.
              </p>
              <p>
                We only ask for personal information when we truly need it to
                provide a service to you. We collect it by fair and lawful
                means, with your knowledge and consent.
              </p>
            </>
          )
        }
      />
    </div>
  );
};

export default Registration;
