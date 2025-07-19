import React from "react";
import { Link } from "react-router-dom";
import {
  LightBulbIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    name: "Intuitive Simplicity",
    description:
      "We believe powerful tools don't have to be complicated. Our interface is designed to be clean, fast, and easy to navigate.",
    icon: LightBulbIcon,
  },
  {
    name: "Data-Driven Insights",
    description:
      "Go beyond simple tracking. Trex provides clear, visual analytics to help you understand your spending and make smarter financial decisions.",
    icon: ChartBarIcon,
  },
  {
    name: "Security First",
    description:
      "Your financial data is sensitive. We prioritize its security with robust measures to ensure your information is always protected.",
    icon: ShieldCheckIcon,
  },
  {
    name: "Built for Teams",
    description:
      "Whether you're an individual or a growing team, Trex scales with you, offering features for collaborative expense management.",
    icon: UsersIcon,
  },
];

const About = () => {
  return (
    <div className='bg-white'>
      <main className='isolate'>
        {/* Hero section */}
        <div className='relative isolate -z-10'>
          <svg
            className='absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]'
            aria-hidden='true'
          >
            <defs>
              <pattern
                id='1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84'
                width={200}
                height={200}
                x='50%'
                y={-1}
                patternUnits='userSpaceOnUse'
              >
                <path d='M.5 200V.5H200' fill='none' />
              </pattern>
            </defs>
            <svg x='50%' y={-1} className='overflow-visible fill-gray-50'>
              <path
                d='M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z'
                strokeWidth={0}
              />
            </svg>
            <rect
              width='100%'
              height='100%'
              strokeWidth={0}
              fill='url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)'
            />
          </svg>
          <div className='absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48'>
            <svg
              viewBox='0 0 801 1036'
              aria-hidden='true'
              className='w-[50.0625rem]'
            >
              <path
                fill='url(#759c1415-0410-454c-8f7c-9a820de03641)'
                fillOpacity='.3'
                d='M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z'
              />
              <defs>
                <linearGradient
                  id='759c1415-0410-454c-8f7c-9a820de03641'
                  x1='1031.02'
                  x2='-.18'
                  y1='41.331'
                  y2='518.975'
                  gradientUnits='userSpaceOnUse'
                >
                  <stop stopColor='#9089FC' />
                  <stop offset={1} stopColor='#FF80B5' />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className='overflow-hidden'>
            <div className='mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32'>
              <div className='mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-center'>
                <div className='lg:pr-8 lg:pt-4'>
                  <div className='lg:max-w-lg'>
                    <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
                      We're changing the way people manage expenses.
                    </h1>
                    <p className='mt-6 text-lg leading-8 text-gray-600'>
                      Welcome to Trex! We are a passionate team dedicated to
                      building a simple, intuitive, and powerful tool to help
                      individuals and businesses take control of their financial
                      health. Our mission is to eliminate the complexity of
                      expense tracking.
                    </p>
                  </div>
                </div>
                <img
                  src='https://placehold.co/1200x800/E0E7FF/4F46E5?text=Trex+Dashboard'
                  alt='Trex application dashboard'
                  className='w-full rounded-xl shadow-xl ring-1 ring-gray-400/10'
                  width={2432}
                  height={1442}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className='mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:mx-0 lg:max-w-none'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Our Mission
            </h2>
            <div className='mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row'>
              <div className='lg:w-full lg:max-w-2xl lg:flex-auto'>
                <p className='text-xl leading-8 text-gray-600'>
                  Our goal is to provide a seamless and stress-free experience
                  for managing your finances. We believe that by offering clear
                  insights and an easy-to-use platform, we can empower our users
                  to make better financial decisions, reduce waste, and achieve
                  their goals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className='mx-auto mt-32 max-w-7xl px-6 lg:px-8'>
          <div className='mx-auto max-w-2xl lg:mx-0'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Why Choose Trex?
            </h2>
            <p className='mt-6 text-lg leading-8 text-gray-600'>
              We've built our platform on four core principles to ensure we
              deliver the best possible experience.
            </p>
          </div>
          <dl className='mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4'>
            {features.map((feature) => (
              <div key={feature.name}>
                <dt className='font-semibold text-gray-900 flex items-center gap-x-3'>
                  <feature.icon
                    className='h-7 w-7 text-indigo-600'
                    aria-hidden='true'
                  />
                  {feature.name}
                </dt>
                <dd className='mt-2 text-gray-600'>{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* CTA section */}
        <div className='relative isolate-z-10 mt-32 px-6 py-24 sm:py-32 lg:px-8 bg-gray-50'>
          <div className='mx-auto max-w-2xl text-center'>
            <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
              Ready to take control?
            </h2>
            <p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600'>
              Join thousands of users who are simplifying their finances with
              Trex. Get started for free today.
            </p>
            <div className='mt-10 flex items-center justify-center gap-x-6'>
              <Link
                to='/register'
                className='rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              >
                Get started <ArrowRightIcon className='inline h-4 w-4' />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
