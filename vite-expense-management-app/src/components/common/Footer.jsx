import { Link } from "react-router-dom";

// SVG Icon components for social media links for a modern, self-contained approach.
const GithubIcon = (props) => (
  <svg
    {...props}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path>
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    {...props}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'></path>
  </svg>
);

const LinkedInIcon = (props) => (
  <svg
    {...props}
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
    <rect x='2' y='9' width='4' height='12'></rect>
    <circle cx='4' cy='4' r='2'></circle>
  </svg>
);

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400'>
      <div className='max-w-7xl mx-auto px-6 py-12'>
        <div className='flex flex-col items-center justify-center'>
          {/* Logo and Tagline */}
          <h2 className='text-3xl font-bold text-white'>Trex</h2>
          <p className='mt-2 text-center max-w-md'>
            Crafted with passion to simplify expense management for personal and
            small team projects.
          </p>

          {/* Social Media Links */}
          <div className='flex justify-center gap-6 mt-6'>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors duration-300'
              aria-label='Twitter'
            >
              <TwitterIcon />
            </a>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors duration-300'
              aria-label='GitHub'
            >
              <GithubIcon />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-white transition-colors duration-300'
              aria-label='LinkedIn'
            >
              <LinkedInIcon />
            </a>
          </div>
        </div>

        {/* Bottom Bar with Copyright and Quick Links */}
        <div className='mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center'>
          <p className='text-sm text-center sm:text-left'>
            &copy; {new Date().getFullYear()} Trex. All rights reserved.
          </p>
          <div className='flex gap-4 mt-4 sm:mt-0'>
            <Link
              to='/privacy'
              className='text-sm hover:text-white transition-colors'
            >
              Privacy Policy
            </Link>
            <Link
              to='/terms'
              className='text-sm hover:text-white transition-colors'
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
