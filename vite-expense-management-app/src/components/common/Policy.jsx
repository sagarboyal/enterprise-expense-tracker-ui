import React from "react";
import { motion } from "framer-motion";


const Policy = () => {
    const Company = "Trex";
    const Website = "trex.com";
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut",
      },
    },
  };

  const introParagraphVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        delay: 0.3,
        ease: "easeOut",
      },
    },
  };

  const getPlaceholderImage = (
    text,
    width = 400,
    height = 200,
    bgColor = "e0e7ff",
    textColor = "4f46e5"
  ) => {
    return `https://placehold.co/${width}x${height}/${bgColor}/${textColor}?text=${text.replace(
      /\s/g,
      "+"
    )}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8 sm:p-10">
          <motion.h1
            className="text-4xl font-[Poppins] sm:text-5xl font-extrabold text-center text-indigo-800 mb-10 tracking-tight"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            Privacy Policy 
          </motion.h1>

          <motion.p
            className="mb-8 text-lg text-gray-700 leading-relaxed text-center"
            variants={introParagraphVariants}
            initial="hidden"
            animate="visible"
          >
            Your privacy is incredibly important to us. It is { Company }'s policy to respect your privacy regarding any information we may collect from you across our website,{" "}
            <strong className="text-indigo-600">{Company}</strong>'s policy
            to respect your privacy regarding any information we may collect
            from you across our website
            <strong className="text-indigo-600"> {Website}</strong>, and
            other sites we own and operate.
          </motion.p>

          <motion.div
            className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">📝</span>1. Information We Collect
            </h2>
            <p className="mb-4 text-gray-800">
              We only collect personal information when you provide it to us
              directly, such as your name, email address, and any other data you
              choose to submit. We aim to collect only what's necessary to
              provide you with excellent service and improve your experience.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage("Data Collection", 600, 300)}
                alt="Illustration of data collection"
                className="w-full max-w-md rounded-lg shadow-md border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">💡</span>2. Use of Information
            </h2>
            <p className="mb-4 text-gray-800">
              We use the information we collect to provide, maintain, and
              continually improve our services, ensuring you have the best
              possible experience. This also helps us to communicate effectively
              with you regarding your account, updates, and our offerings.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage(
                  "Information Usage",
                  600,
                  300,
                  "f3e8ff",
                  "8b5cf6"
                )}
                alt="Illustration of information usage"
                className="w-full max-w-md rounded-lg shadow-md border border-purple-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🤝</span>3. Data Sharing
            </h2>
            <p className="mb-4 text-gray-800">
              We prioritize your trust. Therefore, we{" "}
              <strong className="text-red-600">do not</strong> share your
              personal information publicly or with third parties, except in
              strict circumstances where required by law (e.g., a court order or
              legal process). Your data's security and confidentiality are
              paramount.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage("No Data Sharing", 600, 300)}
                alt="Illustration of no data sharing"
                className="w-full max-w-md rounded-lg shadow-md border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🍪</span>4. Cookies
            </h2>
            <p className="mb-4 text-gray-800">
              We use cookies to enhance your browsing experience, making our
              website more functional and personalized for you. These are small
              data files stored on your device. You are always in control and
              can modify your browser settings to refuse cookies if you prefer,
              though some functionalities might be affected.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage(
                  "Cookie Policy",
                  600,
                  300,
                  "f3e8ff",
                  "8b5cf6"
                )}
                alt="Illustration of cookies"
                className="w-full max-w-md rounded-lg shadow-md border border-purple-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-10 p-6 bg-indigo-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">⚖️</span>5. Your Rights
            </h2>
            <p className="mb-4 text-gray-800">
              You have full rights over your personal information. You can
              access, update, or request the deletion of your data at any time.
              Please don't hesitate to contact us if you have any questions or
              require assistance with your data rights. We are here to help you.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage("User Rights", 600, 300)}
                alt="Illustration of user rights"
                className="w-full max-w-md rounded-lg shadow-md border border-indigo-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.div
            className="mb-10 p-6 bg-purple-50 rounded-lg shadow-inner"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-purple-700 mb-4 flex items-center">
              <span className="mr-3 text-3xl">🔄</span>6. Changes to This Policy
            </h2>
            <p className="mb-4 text-gray-800">
              We may update our privacy policy periodically to reflect changes
              in our practices, legal requirements, or new services. Any changes
              will be effective immediately upon being posted on this page, and
              we encourage you to review it occasionally to stay informed.
            </p>
            <div className="flex justify-center mt-6">
              <img
                src={getPlaceholderImage(
                  "Policy Updates",
                  600,
                  300,
                  "f3e8ff",
                  "8b5cf6"
                )}
                alt="Illustration of policy updates"
                className="w-full max-w-md rounded-lg shadow-md border border-purple-200"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getPlaceholderImage("Image Not Found");
                }}
              />
            </div>
          </motion.div>

          <motion.p
            className="mt-12 text-center text-md text-gray-600 italic"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          >
            This policy is effective as of{" "}
            <strong className="text-gray-700">July 19, 2025</strong>.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
