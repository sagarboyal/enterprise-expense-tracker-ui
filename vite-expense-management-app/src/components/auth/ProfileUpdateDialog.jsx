import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useMyContext } from "../../store/ContextApi";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";

const ProfileUpdateDialog = ({ isOpen, onClose }) => {
  const { loggedInUser, setloggedInUser } = useMyContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: loggedInUser?.id,
      fullName: loggedInUser?.fullName || "",
      email: loggedInUser?.email || "",
      password: "",
    },
  });

  useEffect(() => {
    if (loggedInUser && isOpen) {
      reset({
        id: loggedInUser.id,
        fullName: loggedInUser.fullName || "",
        email: loggedInUser.email || "",
        password: "",
      });
    }
  }, [loggedInUser, isOpen, reset]);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    const { id, fullName, email, password } = data;

    const payload = {
      id,
      fullName: fullName?.trim(),
      email: email?.trim(),
      ...(password?.trim() && { password: password.trim() }),
    };

    try {
      const response = await api.put("/api/users", payload);
      setloggedInUser(response.data);
      toast.success("Profile updated successfully.");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={onClose}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/30 backdrop-blur-sm' />
        </Transition.Child>

        {/* Full-screen container to center the panel */}
        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-200/80'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-bold leading-6 text-gray-900 text-center mb-6'
                >
                  Edit Your Profile
                </Dialog.Title>

                <form
                  onSubmit={handleSubmit(handleFormSubmit)}
                  className='space-y-4'
                >
                  {/* Full Name Input */}
                  <div className='relative'>
                    <UserIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <input
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      placeholder='Full Name'
                      className={`w-full border rounded-lg px-4 py-2.5 pl-10 shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                        errors.fullName
                          ? "border-red-300 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.fullName && (
                      <p className='text-red-600 text-xs mt-1 ml-1'>
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className='relative'>
                    <EnvelopeIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <input
                      type='email'
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      placeholder='Email Address'
                      className={`w-full border rounded-lg px-4 py-2.5 pl-10 shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                        errors.email
                          ? "border-red-300 focus:ring-red-500 bg-red-50"
                          : "border-gray-300 focus:ring-indigo-500"
                      }`}
                    />
                    {errors.email && (
                      <p className='text-red-600 text-xs mt-1 ml-1'>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Input */}
                  <div className='relative'>
                    <LockClosedIcon className='pointer-events-none w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400' />
                    <input
                      type='password'
                      {...register("password")}
                      placeholder='New Password (optional)'
                      className='w-full border rounded-lg px-4 py-2.5 pl-10 shadow-sm focus:outline-none focus:ring-2 border-gray-300 focus:ring-indigo-500'
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className='flex justify-end gap-4 pt-4'>
                    <button
                      type='button'
                      onClick={onClose}
                      className='px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition'
                    >
                      Cancel
                    </button>
                    <button
                      type='submit'
                      disabled={isSubmitting}
                      className='inline-flex justify-center items-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition disabled:bg-indigo-400 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? (
                        <>
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
                          Updating...
                        </>
                      ) : (
                        "Update Profile"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProfileUpdateDialog;
