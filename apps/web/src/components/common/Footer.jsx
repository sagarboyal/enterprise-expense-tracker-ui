import { Link } from "react-router-dom";

const SocialLink = ({ href, aria, icon: Icon, theme }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={aria}
    className={`group relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 ${
      theme === "dark"
        ? "border-white/10 bg-white/5 text-slate-400 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400"
        : "border-slate-200 bg-white text-slate-500 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
    }`}
  >
    <Icon className="h-5 w-5" />
  </a>
);

const GithubIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
  </svg>
);

const LinkedInIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const Footer = ({ theme }) => {
  const currentYear = new Date().getFullYear();
  const isDark = theme === "dark";

  return (
    <footer
      className={`relative overflow-hidden border-t pt-16 pb-8 transition-colors duration-300 ${
        isDark
          ? "border-white/5 bg-[#030712]"
          : "border-slate-200 bg-slate-100"
      }`}
    >
      <div
        className={`absolute top-0 right-0 -z-10 h-64 w-64 rounded-full blur-[100px] ${
          isDark ? "bg-indigo-600/5" : "bg-indigo-300/30"
        }`}
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span
                className={`text-2xl font-black tracking-tighter ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                TREX<span className="text-indigo-500">.</span>
              </span>
            </Link>
            <p
              className={`mt-4 text-sm leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Personal finance, evolved. Track, analyze, and master your
              spending with our modern expense management engine.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <SocialLink
                icon={TwitterIcon}
                href="https://x.com/SagarBoyal4"
                aria="Twitter"
                theme={theme}
              />
              <SocialLink
                icon={GithubIcon}
                href="https://github.com/sagarboyal"
                aria="GitHub"
                theme={theme}
              />
              <SocialLink
                icon={LinkedInIcon}
                href="https://www.linkedin.com/in/sagarboyal/"
                aria="LinkedIn"
                theme={theme}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3
                className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Product
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/features"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/changelog"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Company
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/about"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3
                className={`text-sm font-semibold uppercase tracking-wider ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link
                    to="/privacy-policy"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-slate-400 hover:text-indigo-400"
                        : "text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center sm:flex-row sm:text-left ${
            isDark ? "border-white/5" : "border-slate-200"
          }`}
        >
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Trex Labs Inc. Built with passion for better
            finance.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span
                className={`text-[10px] font-medium uppercase tracking-widest ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                System Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
