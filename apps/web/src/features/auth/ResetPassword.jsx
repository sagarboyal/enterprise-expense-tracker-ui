import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "@/services/api";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import InputField from "@/components/ui/InputField";
import Buttons from "@/components/ui/Buttons";

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
      console.error(error);
      toast.error("Error resetting password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row font-[Poppins] bg-white">
      {/* Left Branding Panel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden bg-gray-900 flex-col justify-center items-center p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black opacity-90"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Secure Your Account
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            Enter your new password below to regain access to your dashboard and
            continue managing your finances.
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-gray-50 md:bg-white relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Set New Password
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-light">
              Your security is important. Choose a strong password.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleResetPassword)}
            className="space-y-6 mt-8"
          >
            <div className="space-y-5">
              <InputField
                label="New Password"
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
                    class="lucide lucide-lock-icon lucide-lock"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              />
              <InputField
                label="Confirm New Password"
                required
                id="confirmPassword"
                type="password"
                message="Please confirm your password"
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
                    class="lucide lucide-user-round-key-icon lucide-user-round-key"
                  >
                    <path d="M19 11v6" />
                    <path d="M19 13h2" />
                    <path d="M2 21a8 8 0 0 1 12.868-6.349" />
                    <circle cx="10" cy="8" r="5" />
                    <circle cx="19" cy="19" r="2" />
                  </svg>
                }
              />
            </div>

            <Buttons
              disabled={loading}
              onClickhandler={() => {}}
              className="w-full py-3.5 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] bg-indigo-600 hover:bg-indigo-700"
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
                  Updating...
                </div>
              ) : (
                "Update Password"
              )}
            </Buttons>

            <div className="text-center text-sm text-gray-600 mt-8">
              <p>
                Remembered your password?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                >
                  Back to Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
