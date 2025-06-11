import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import Profile from "./components/auth/Profile";
import HomePage from "./components/HomePage";
import { Toaster } from "react-hot-toast";
import Contact from "./components/common/Contact";
import About from "./components/common/About";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import Introduction from "./components/common/Introduction";
import Expenses from "./components/expenses/Expenses";
import WelcomePage from "./components/common/WelcomePage";
import AuditLog from "./components/audit-log/AuditLog";
import Dashboard from "./components/Dashboard";

function App() {
  const location = useLocation();
  const showPage = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showPage && <NavBar />}
      <Toaster position='bottom-center' reverseOrder={false} />
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/' element={<Introduction />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />

        {/* Dashboard + Nested Routes */}
        <Route path='/homepage' element={<HomePage />}>
          <Route index element={<WelcomePage />} /> {/* default view */}
          <Route path='expenses' element={<Expenses />} />
          <Route path='audit-logs' element={<AuditLog />} />
        </Route>
      </Routes>
      {showPage && <Footer />}
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
