import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className='bg-black text-white py-8'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8'>
          {/* Company Info */}
          <div className='space-y-4'>
            <h2 className='text-2xl font-semibold'>Trex</h2>
            <p className='text-gray-400'>
              We are dedicated to providing innovative solutions that simplify
              your life and make your business more efficient. Get in touch with
              us for more details.
            </p>
            <p className='text-gray-400'>
              <span className='font-medium'>Email:</span> support@trex.com
            </p>
            <p className='text-gray-400'>
              <span className='font-medium'>Phone:</span> +1 234 567 890
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Quick Links</h2>
            <ul className='space-y-2'>
              <li>
                <Link
                  to='/about'
                  className='text-gray-400 hover:text-white transition duration-200'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to='/contact'
                  className='text-gray-400 hover:text-white transition duration-200'
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to='/privacy'
                  className='text-gray-400 hover:text-white transition duration-200'
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to='/terms'
                  className='text-gray-400 hover:text-white transition duration-200'
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Follow Us</h2>
            <div className='flex gap-4'>
              <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <i className='fab fa-facebook-square text-2xl'></i>
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <i className='fab fa-twitter text-2xl'></i>
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <i className='fab fa-linkedin text-2xl'></i>
              </a>
              <a
                href='https://instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-400 hover:text-white'
              >
                <i className='fab fa-instagram text-2xl'></i>
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Newsletter</h2>
            <p className='text-gray-400'>
              Stay updated with the latest news and updates from Trex. Sign up
              for our newsletter.
            </p>
            <div className='flex items-center'>
              <input
                type='email'
                placeholder='Your email address'
                className='p-2 rounded-md text-gray-900 bg-amber-50'
              />
              <button className='ml-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'>
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t border-gray-700 pt-4'>
          <p className='text-center text-gray-400'>
            &copy; {new Date().getFullYear()} Trex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
