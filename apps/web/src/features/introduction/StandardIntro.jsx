import React from "react";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { standardFeatures, containerVariants, itemVariants } from "@/config/constants";

const StandardIntro = ({ theme }) => {
  const isDark = theme === "dark";

  return (
    <div
      className={`transition-colors duration-500 ${isDark ? "bg-[#030712]" : "bg-slate-50"}`}
    >
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden selection:bg-teal-500/30 px-4 py-20 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-0 z-0 h-full w-full -translate-x-1/2 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full blur-[120px] ${isDark ? "bg-teal-600/20" : "bg-teal-300/40"}`}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className={`absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full blur-[120px] ${isDark ? "bg-emerald-600/10" : "bg-emerald-200/50"}`}
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto w-full max-w-5xl text-center"
        >
          <motion.div variants={itemVariants}>
            <span
              className={`inline-block rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-8 ${isDark ? "border-teal-500/30 bg-teal-500/10 text-teal-300" : "border-teal-200 bg-white/60 text-teal-700 shadow-sm"}`}
            >
              👋 Personal Finance
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className={`mx-auto text-5xl font-black leading-[1.15] tracking-tight md:text-7xl lg:text-8xl ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Master Your Money with{" "}
            <span className="bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm">
              TREX
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className={`mx-auto mt-8 max-w-2xl text-lg font-medium leading-relaxed sm:text-xl ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Stop wondering where your money went. Track, budget, and analyze
            your personal expenses with an intuitive financial companion
            designed just for you.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center outline-none w-full sm:w-auto"
            >
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 opacity-70 blur-md transition-all duration-500 group-hover:opacity-100 group-hover:duration-200 group-active:scale-95"></div>
              <span
                className={`relative inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold tracking-wide transition-all duration-300 active:scale-95 ${isDark ? "bg-gray-900 text-white hover:bg-gray-800" : "bg-white text-gray-900 hover:bg-gray-50"}`}
              >
                Start Tracking Free
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            <Link
              to="/enterprise"
              className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-bold tracking-wide transition-all duration-300 active:scale-95 border ${isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-300 text-slate-700 hover:bg-slate-100"}`}
            >
              Business Owner? Upgrade Here
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ALTERNATING FEATURE SECTIONS */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 space-y-32">
        {standardFeatures.map((feature, index) => {
          const isReversed = index % 2 !== 0;
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className={`flex flex-col gap-12 lg:gap-24 items-center ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"}`}
            >
              <motion.div
                initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex-1 space-y-6 text-center lg:text-left"
              >
                <div
                  className={`inline-flex items-center justify-center p-3 rounded-2xl ${feature.bg} ${feature.color}`}
                >
                  <Icon className="h-8 w-8" strokeWidth={2} />
                </div>
                <h2
                  className={`text-base font-bold tracking-widest uppercase ${feature.color}`}
                >
                  {feature.title}
                </h2>
                <h3
                  className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  {feature.heading}
                </h3>
                <p
                  className={`text-lg leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  {feature.text}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: isReversed ? -50 : 50, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                className="flex-1 w-full relative perspective-1000"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative w-full"
                >
                  <div
                    className={`absolute -inset-4 rounded-3xl opacity-30 blur-2xl transition-all duration-500 bg-gradient-to-br from-teal-500 to-emerald-500 ${feature.glow}`}
                  ></div>
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className={`relative z-10 w-full rounded-2xl object-cover shadow-2xl ring-1 ${isDark ? "ring-white/10" : "ring-slate-900/5"}`}
                  />
                </motion.div>
              </motion.div>
            </div>
          );
        })}
      </section>

      {/* FINAL BOTTOM CTA */}
      <section className="relative z-10 px-4 py-24 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-white/5 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`mx-auto max-w-4xl rounded-3xl p-10 text-center shadow-2xl ring-1 sm:p-16 ${isDark ? "bg-[#0f172a] ring-white/10" : "bg-white ring-slate-200"}`}
        >
          <h2
            className={`text-3xl font-black tracking-tight sm:text-4xl mb-6 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Ready to take control of your finances?
          </h2>
          <p
            className={`text-lg mb-10 max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Join thousands of users managing expenses and analyzing financial
            data with unmatched clarity.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-teal-500/30 transition-all hover:bg-teal-500 hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </Link>
          <p className="mt-6 text-sm font-medium text-slate-500">
            No credit card required. Setup takes less than 2 minutes.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default StandardIntro;
