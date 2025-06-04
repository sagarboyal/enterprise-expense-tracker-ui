import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Toaster position='buttom-center' reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
