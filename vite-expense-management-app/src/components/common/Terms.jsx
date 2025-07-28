import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const Company = "Trex";
  const Website = "trex.com";

  const fadeInSlideUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const fadeInFromLeftVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const getPlaceholderImage = (
    text,
    width = 600,
    height = 300,
    bgColor = "e0e7ff",
    textColor = "4f46e5"
  ) => {
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text.replace(
      /\s/g,
      "+"
    )}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8 sm:p-10 lg:p-12">
          <motion.h1
            className="text-4xl font-[Poppins] sm:text-5xl lg:text-6xl font-extrabold text-center text-indigo-800 mb-8 sm:mb-10 tracking-tight leading-tight"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            Your Privacy, Our Priority
          </motion.h1>

          <motion.p
            className="mb-10 text-lg sm:text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto"
            variants={fadeInFromLeftVariants}
            initial="hidden"
            animate="visible"
          >
            At <strong className="text-indigo-600"> {Company} </strong>, we are
            deeply committed to protecting your privacy. This policy outlines
            how we collect, use, and safeguard your personal information across
            our services and website:{" "}
            <strong className="text-indigo-600">{Website}</strong>.
          </motion.p>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-indigo-50 rounded-xl shadow-md flex flex-col lg:flex-row items-center lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">📊</span>1.
                Information We Collect
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                We collect information directly from you when you interact with
                our services, such as when you create an account, make a
                purchase, or contact us. This may include your name, email
                address, payment details, and other information you choose to
                provide. We also collect certain technical data automatically,
                like your IP address and browser type, to improve our service.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "Data Collection",
                  600,
                  350,
                  "c7d2fe",
                  "4f46e5"
                )}
                alt="Illustration of data collection"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-blue-50 rounded-xl shadow-md flex flex-col lg:flex-row-reverse items-center lg:space-x-reverse lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">⚙️</span>2. How We
                Use Your Information
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                Your information is used to provide, maintain, and improve our
                services, process transactions, and personalize your experience.
                We also use it for communication, customer support, and to
                ensure the security and integrity of our platform. We analyze
                usage data to understand how our services are used and to
                develop new features.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "Information Usage",
                  600,
                  350,
                  "bfdbfe",
                  "3b82f6"
                )}
                alt="Illustration of information usage"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-blue-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-indigo-50 rounded-xl shadow-md flex flex-col lg:flex-row items-center lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">🤝</span>3. How We
                Share Your Information
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                We do not sell your personal data. We may share information with
                trusted third-party service providers who assist us in operating
                our website and delivering our services (e.g., payment
                processors, analytics providers), under strict confidentiality
                agreements. We may also disclose information if required by law
                or to protect our rights and safety.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "Data Sharing",
                  600,
                  350,
                  "c7d2fe",
                  "4f46e5"
                )}
                alt="Illustration of data sharing"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-blue-50 rounded-xl shadow-md flex flex-col lg:flex-row-reverse items-center lg:space-x-reverse lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">🔒</span>4. Data
                Security
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                We implement robust security measures, including encryption and
                access controls, to protect your personal information from
                unauthorized access, alteration, disclosure, or destruction.
                While no method of transmission over the Internet is 100%
                secure, we strive to use commercially acceptable means to
                protect your data.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "Data Security",
                  600,
                  350,
                  "bfdbfe",
                  "3b82f6"
                )}
                alt="Illustration of data security"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-blue-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-indigo-50 rounded-xl shadow-md flex flex-col lg:flex-row items-center lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">⚖️</span>5. Your
                Rights
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                You have the right to access, update, correct, or delete your
                personal information. You may also have the right to object to
                or restrict certain processing activities. To exercise these
                rights, please contact us using the details provided below. We
                will respond to your request in accordance with applicable laws.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "User Rights",
                  600,
                  350,
                  "c7d2fe",
                  "4f46e5"
                )}
                alt="Illustration of user rights"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-blue-50 rounded-xl shadow-md flex flex-col lg:flex-row-reverse items-center lg:space-x-reverse lg:space-x-8"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 flex items-center">
                <span className="mr-3 text-3xl sm:text-4xl">🍪</span>6. Cookies
                & Tracking
              </h2>
              <p className="mb-4 text-gray-800 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your
                experience, analyze website usage, and personalize content. You
                can manage your cookie preferences through your browser
                settings. Please note that disabling cookies may affect the
                functionality of some parts of our website.
              </p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={getPlaceholderImage(
                  "Cookies Tracking",
                  600,
                  350,
                  "bfdbfe",
                  "3b82f6"
                )}
                alt="Illustration of cookies and tracking"
                className="w-full max-w-sm sm:max-w-md rounded-lg shadow-lg border border-blue-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-indigo-50 rounded-xl shadow-md"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl sm:text-4xl">🔄</span>7. Changes to
              This Policy
            </h2>
            <p className="mb-4 text-gray-800 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any significant changes by posting the new policy on this page
              and updating the "Effective Date" below. We encourage you to
              review this policy periodically.
            </p>
          </motion.div>

          <motion.div
            className="mb-12 p-6 sm:p-8 bg-blue-50 rounded-xl shadow-md"
            variants={fadeInSlideUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl sm:text-4xl">📧</span>8. Contact Us
            </h2>
            <p className="mb-4 text-gray-800 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy or
              our data practices, please contact us at: <a className="text-indigo-600 hover:underline font-semibold" href="/">Contact</a>
            
            </p>
            <ul className="list-disc list-inside text-gray-800 ml-4">
              <li>
                Email:{" "}
                <a
                  href="mailto:privacy@[yourcompany.com]"
                  className="text-indigo-600 hover:underline"
                >
                  privacy@[yourcompany.com]
                </a>
              </li>
              <li>
                Address: [Your Company Address], [City], [State/Province],
                [Postal Code], [Country]
              </li>
            </ul>
          </motion.div>

          <motion.p
            className="mt-12 text-center text-md sm:text-lg text-gray-600 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            This Privacy Policy is effective as of{" "}
            <strong className="text-gray-700">July 19, 2025</strong>.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
