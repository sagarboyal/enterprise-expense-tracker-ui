import { useMyContext } from "../store/ContextApi";
import { Link, useLocation } from "react-router-dom";

const TopPanel = () => {
  const { isAdmin, isManager, loggedInUser } = useMyContext();
  const location = useLocation();
  const navLinkClass = (path) =>
    `px-2 py-2 font-[Poppins] text-xs font-medium transition ${
      location.pathname === path
        ? "text-gray-500"
        : "text-black hover:text-gray-500"
    }`;

  return (
    <>
      <div className="w-full p-8 pt-3 pb-1 mb-6 flex flex-wrap items-center gap-4">
        {/* FIX: Check if loggedInUser exists before accessing its token property */}
        {loggedInUser ? (
          <div className="ml-auto flex flex-wrap gap-1">
            <Link
              to="/homepage/expenses"
              className={navLinkClass("/homepage/expenses")}
            >
              Expenses
            </Link>
            <Link
              to="/homepage/analytics"
              className={navLinkClass("/homepage/analytics")}
            >
              Analytics
            </Link>
            <Link
              to="/homepage/billings"
              className={navLinkClass("/homepage/billings")}
            >
              Billings
            </Link>
            {(isAdmin || isManager) && (
              <>
                <Link
                  to="/homepage/approvals"
                  className={navLinkClass("/homepage/approvals")}
                >
                  Approval Panel
                </Link>
                <Link
                  to="/homepage/contact-requests"
                  className={navLinkClass("/homepage/contact-requests")}
                >
                  Contact Requests
                </Link>
              </>
            )}
            {isAdmin && (
              <>
                <Link
                  to="/homepage/audit-logs"
                  className={navLinkClass("/homepage/audit-logs")}
                >
                  Audit Logs
                </Link>
                <Link
                  to="/homepage/users"
                  className={navLinkClass("/homepage/users")}
                >
                  User Management
                </Link>
                <Link
                  to="/homepage/invoice"
                  className={navLinkClass("/homepage/invoice")}
                >
                  Manage Invoices
                </Link>
                <Link
                  to="/homepage/categories"
                  className={navLinkClass("/homepage/categories")}
                >
                  Categories
                </Link>
              </>
            )}
          </div>
        ) : (
          <div className="ml-auto flex flex-wrap gap-1">
            <Link
              to="/login"
              className="
                bg-gradient-to-r from-purple-500 to-pink-500 
                text-transparent bg-clip-text 
                font-bold 
                hover:from-pink-500 hover:to-rose-500
                transition-all duration-300 ease-in-out
                "
            >
              Access Your Personalized Experience.
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default TopPanel;
