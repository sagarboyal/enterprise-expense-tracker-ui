import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "@/features/auth/Login";
import Registration from "@/features/auth/registration/Registration";
import Profile from "@/features/auth/Profile";
import HomePage from "@/pages/HomePage";
import { Toaster } from "react-hot-toast";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import ResetPassword from "@/features/auth/ResetPassword";
import ForgotPassword from "@/features/auth/ForgotPassword";
import NavBar from "@/layouts/NavBar";
import Footer from "@/layouts/Footer";
import Introduction, {
  EnterpriseIntro,
} from "@/features/introduction/Introduction";
import Expenses from "@/features/expenses/Expenses";
import WelcomePage from "@/pages/WelcomePage";
import Notifications from "@/features/notifications/Notifications";
import AuditLog from "@/features/audit-log/AuditLog";
import ApprovalPanel from "@/features/approval/ApprovalPanel";
import AnalyticsDashboard from "@/features/analytics/AnalyticsDashboard";
import UserManagementDashboard from "@/features/users/UserManagementDashboard";
import InvoiceDashboard from "@/features/invoice/InvoiceDashboard";
import Terms from "@/pages/Terms";
import Policy from "@/pages/Policy";
import UserInvoiceDashboard from "@/features/invoice/UserInvoiceDashboard.jsx";
import Category from "@/features/categories/Category.jsx";
import ContactReq from "@/features/contactrequest/ContactReq.jsx";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("trex-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

function App() {
  const location = useLocation();
  const showPage = !["/login", "/register"].includes(location.pathname);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("trex-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors duration-300 ${
        theme === "dark" ? "bg-[#030712]" : "bg-slate-100"
      }`}
    >
      {showPage && <NavBar theme={theme} onToggleTheme={toggleTheme} />}
      <Toaster position="bottom-center" reverseOrder={false} />
      <main className="flex-1">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/" element={<Introduction theme={theme} />} />
          <Route
            path="/enterprise"
            element={<EnterpriseIntro theme={theme} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<Policy />} />

          <Route path="/homepage" element={<HomePage />}>
            <Route index element={<WelcomePage />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="analytics" element={<AnalyticsDashboard />} />
            <Route path="audit-logs" element={<AuditLog />} />
            <Route path="approvals" element={<ApprovalPanel />} />
            <Route path="users" element={<UserManagementDashboard />} />
            <Route path="invoice" element={<InvoiceDashboard />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="billings" element={<UserInvoiceDashboard />} />
            <Route path="categories" element={<Category />} />
            <Route path="contact-requests" element={<ContactReq />} />
          </Route>
        </Routes>
      </main>
      {showPage && <Footer theme={theme} />}
    </div>
  );
}

export default function AppWrapper() {
  return <App />;
}
