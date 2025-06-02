import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/auth/Login";
import HomePage from "./components/dashboard/HomePage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <BrowserRouter>
      <Toaster position='buttom-center' reverseOrder={false} />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/homePage' element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
