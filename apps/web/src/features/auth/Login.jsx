import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { jwtDecode } from "jwt-decode";
import { useMyContext } from "@/store/ContextApi";
import toast from "react-hot-toast";
import InputField from "@/components/ui/InputField";
import Buttons from "@/components/ui/Buttons";
import api from "@/services/api";

const Login = () => {
  const [jwtToken, setJwtToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState("personal");

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
          "Login failed. Please check your credentials and try again.",
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
    if (token) navigate("/homepage/expenses");
  }, [navigate, token]);

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row font-[Poppins] bg-white">
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
              Welcome back to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Trex
              </span>
            </h1>
            <p className="text-lg text-gray-400 max-w-md font-light leading-relaxed">
              {loginType === "business"
                ? "Sign in to your organization's workspace — manage expenses, track approvals, and keep your team's finances under control."
                : "Log in to access your dashboard, track your expenses, and manage your financial goals with ease."}
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

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[55%] p-6 sm:p-12 bg-gray-50 md:bg-white relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight transition-all">
              {loginType === "business" ? "Trex Enterprise" : "Sign In to Trex"}
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-light">
              {loginType === "business"
                ? "Enter your work email and password to manage your company's expenses."
                : "Enter your email address and password to access your personal account."}
            </p>
          </div>

          <div className="flex justify-center bg-gray-200/60 p-1.5 rounded-xl w-full mx-auto shadow-inner">
            <button
              type="button"
              onClick={() => setLoginType("personal")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                loginType === "personal"
                  ? "bg-white text-gray-900 shadow-md ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Personal
            </button>
            <button
              type="button"
              onClick={() => setLoginType("business")}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ${
                loginType === "business"
                  ? "bg-white text-indigo-700 shadow-md ring-1 ring-black/5"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              }`}
            >
              Business
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onLoginHandler)}
            className="space-y-6 mt-8"
          >
            <div className="space-y-5">
              <InputField
                label={
                  loginType === "business" ? "Work Email" : "Email Address"
                }
                required
                id="username"
                type="email"
                message="Email is required"
                placeholder={
                  loginType === "business"
                    ? "name@company.com"
                    : "name@example.com"
                }
                register={register}
                errors={errors}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-user-icon lucide-user"
                    className="text-gray-400"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />
              <InputField
                label="Password"
                required
                id="password"
                type="password"
                message="Password is required"
                placeholder="••••••••"
                register={register}
                errors={errors}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-lock-keyhole-icon lucide-lock-keyhole"
                    className="text-gray-400"
                  >
                    <circle cx="12" cy="16" r="1" />
                    <rect x="3" y="10" width="18" height="12" rx="2" />
                    <path d="M7 10V7a5 5 0 0 1 10 0v3" />
                  </svg>
                }
              />
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className={`w-full py-3.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] ${
                loginType === "business"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-gray-900 hover:bg-gray-800"
              }`}
              type="submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
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
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2 justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-log-in-icon lucide-log-in"
                  >
                    <path d="m10 17 5-5-5-5" />
                    <path d="M15 12H3" />
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  </svg>
                  <p> Sign In</p>
                </div>
              )}
            </Buttons>

            {loginType === "personal" && (
              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <span className="absolute inset-x-0 h-px bg-gray-200"></span>
                  <span className="relative bg-gray-50 md:bg-white px-4 text-sm text-gray-500">
                    or continue with
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    toast("Google login coming soon!", { icon: "🚧" })
                  }
                  className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                  Google
                </button>
              </div>
            )}

            <div className="text-center text-sm text-gray-600 mt-8">
              <p>
                New to Trex?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
