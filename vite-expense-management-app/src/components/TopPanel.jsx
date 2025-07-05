import { useMyContext } from "../store/ContextApi";
import { Link, useLocation } from "react-router-dom";

const TopPanel = () => {
  const { isAdmin, isManager } = useMyContext();

  const location = useLocation();

  const navLinkClass = (path) =>
    `px-2 py-2 font-[Poppins] text-xs font-medium transition ${
      location.pathname === path
        ? "text-gray-500"
        : "text-black hover:text-gray-500"
    }`;

  return (
    <>
      <div className='w-full p-8 pt-3 pb-1 mb-6 flex flex-wrap items-center gap-4'>
        <div className='ml-auto flex flex-wrap gap-1'>
          <Link
            to='/homepage/expenses'
            className={navLinkClass("/homepage/expenses")}
          >
            Expenses
          </Link>
          <Link
            to='/homepage/analytics'
            className={navLinkClass("/homepage/analytics")}
          >
            Analytics
          </Link>
          {(isAdmin || isManager) && (
            <Link
              to='/homepage/approvals'
              className={navLinkClass("/homepage/approvals")}
            >
              Approval Panel
            </Link>
          )}
          {isAdmin && (
            <>
              <Link
                to='/homepage/audit-logs'
                className={navLinkClass("/homepage/audit-logs")}
              >
                Audit Logs
              </Link>
              <Link
                to='/homepage/users'
                className={navLinkClass("/homepage/users")}
              >
                User Management
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TopPanel;
