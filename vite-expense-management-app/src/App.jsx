import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import HomePage from "./components/dashboard/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position='buttom-center' reverseOrder={false} />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/register' element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
