import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";

const ProfileUpdateDialog = ({ isOpen, onClose }) => {
  const context = useMyContext();
  const [loggedInUser, setLoggedInUser] = useState(context.loggedInUser);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (loggedInUser) {
      reset({
        id: loggedInUser.id,
        fullName: loggedInUser.fullName || "",
        email: loggedInUser.email || "",
        password: "",
      });
    }
  }, [loggedInUser, reset]);

  const handleFormSubmit = async (data) => {
    const { id, fullName, email, password } = data;

    const payload = {
      id,
      fullName: fullName?.trim(),
      email: email?.trim(),
      password: password?.trim() || null,
    };

    try {
      const response = await api.put("/api/users", payload);
      toast.success("Profile updated successfully.");
      setLoggedInUser(response.data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 backdrop-blur-xs bg-black/30 flex items-center justify-center'>
      <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200'>
        <h2 className='text-2xl font-bold mb-6 text-black text-center'>
          Update Profile
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-5'>
          {/* Full Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name
            </label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.fullName && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.email && (
              <p className='text-red-500 text-xs mt-1'>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              {...register("password")}
              placeholder='Leave blank to keep current password'
              className='w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500'
            />
          </div>

          {/* Actions */}
          <div className='flex justify-end gap-4 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition'
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdateDialog;
