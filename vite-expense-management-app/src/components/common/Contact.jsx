import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  BuildingOffice2Icon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ChatBubbleBottomCenterTextIcon,
} from "@heroicons/react/24/outline";

const api = {
  post: (endpoint, data) => {
    return new Promise((resolve, reject) => {
      console.log("Submitting to:", endpoint, data);
      setTimeout(() => {
        if (data.email !== "error@example.com") {
          resolve({
            status: 200,
            data: { message: "Message received successfully!" },
          });
        } else {
          reject({
            response: {
              data: { message: "Submission failed. Please try again." },
            },
          });
        }
      }, 1500);
    });
  },
};

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/api/contact", data);
      toast.success("Thank you for your message! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='relative isolate bg-white'>
      <div className='mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2'>
        {/* Contact Information Section */}
        <div className='relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-48'>
          <div className='mx-auto max-w-xl lg:mx-0 lg:max-w-lg'>
            <div className='absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2'>
              <svg
                className='absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]'
                aria-hidden='true'
              >
                <defs>
                  <pattern
                    id='83fd4e5a-9d52-4224-8799-10e77faf7023'
                    width={200}
                    height={200}
                    x='100%'
                    y={-1}
                    patternUnits='userSpaceOnUse'
                  >
                    <path d='M130 200V.5M.5 .5H200' fill='none' />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' strokeWidth={0} fill='white' />
                <svg x='100%' y={-1} className='overflow-visible fill-gray-50'>
                  <path d='M-470.5 0h201v201h-201Z' strokeWidth={0} />
                </svg>
                <rect
                  width='100%'
                  height='100%'
                  strokeWidth={0}
                  fill='url(#83fd4e5a-9d52-4224-8799-10e77faf7023)'
                />
              </svg>
            </div>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
              Get in touch
            </h2>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              We'd love to hear from you! Whether you have a question about
              features, trials, pricing, or anything else, our team is ready to
              answer all your questions.
            </p>
            <dl className='mt-10 space-y-4 text-base leading-7 text-gray-600'>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Address</span>
                  <BuildingOffice2Icon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  Haldia
                  <br />
                  Mahishadal, 721628
                </dd>
              </div>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Telephone</span>
                  <PhoneIcon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  <a
                    className='hover:text-gray-900'
                    href='tel:+1 (555) 234-5678'
                  >
                    +91 9382770251
                  </a>
                </dd>
              </div>
              <div className='flex gap-x-4'>
                <dt className='flex-none'>
                  <span className='sr-only'>Email</span>
                  <EnvelopeIcon
                    className='h-7 w-6 text-gray-400'
                    aria-hidden='true'
                  />
                </dt>
                <dd>
                  <a
                    className='hover:text-gray-900'
                    href='mailto:support@trex.com'
                  >
                    server.notifications.system@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Contact Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-48'
        >
          <div className='mx-auto max-w-xl lg:mr-0 lg:max-w-lg'>
            <div className='grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2'>
              {/* Full Name */}
              <div className='sm:col-span-2'>
                <label
                  htmlFor='full-name'
                  className='block text-sm font-semibold leading-6 text-gray-900'
                >
                  Full Name
                </label>
                <div className='relative mt-2.5'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <UserIcon className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='full-name'
                    autoComplete='name'
                    {...register("fullName", {
                      required: "Full name is required.",
                    })}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.fullName ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {errors.fullName && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className='sm:col-span-2'>
                <label
                  htmlFor='email'
                  className='block text-sm font-semibold leading-6 text-gray-900'
                >
                  Email
                </label>
                <div className='relative mt-2.5'>
                  <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
                    <EnvelopeIcon className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='email'
                    id='email'
                    autoComplete='email'
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address.",
                      },
                    })}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.email ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                </div>
                {errors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className='sm:col-span-2'>
                <label
                  htmlFor='message'
                  className='block text-sm font-semibold leading-6 text-gray-900'
                >
                  Message
                </label>
                <div className='mt-2.5'>
                  <textarea
                    id='message'
                    rows={4}
                    {...register("message", {
                      required: "Message cannot be empty.",
                    })}
                    className={`block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.message ? "ring-red-500" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    defaultValue={""}
                  />
                </div>
                {errors.message && (
                  <p className='mt-1 text-sm text-red-600'>
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>
            <div className='mt-8 flex justify-end'>
              <button
                type='submit'
                disabled={isSubmitting}
                className='inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-400 disabled:cursor-not-allowed'
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
                    Sending...
                  </>
                ) : (
                  "Send message"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
