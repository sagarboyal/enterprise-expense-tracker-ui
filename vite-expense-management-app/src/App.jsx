import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import HomePage from "./components/HomePage";
import { Toaster } from "react-hot-toast";
import Contact from "./components/common/Contact";
import About from "./components/common/About";
import ResetPassword from "./components/auth/ResetPassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import NavBar from "./components/common/NavBar";
import Footer from "./components/common/Footer";
import Dashboard from "./components/Dashboard";
import Introduction from "./components/common/Introduction";

function App() {
  const location = useLocation();
  // Only render NavBar and Footer if not on login or register page
  const showPage = !["/login", "/register"].includes(location.pathname);

  return (
    <>
      {showPage && <NavBar />}
      <Toaster position='bottom-center' reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<Introduction />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/homepage' element={<HomePage />} />
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
