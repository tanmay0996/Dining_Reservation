import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";
import Homepage from "./components/Homepage";
import HotelInfo from "./components/HotelInfo";
import Footer from "./components/Footer";
import BookTable from "./components/BookTable";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ManagerLogin from "./components/ManagerLogin";
import User from "./components/User";
import ForgotPassword from "./components/ForgotPassword";
import BookedPage from "./components/BookedPage";
import ManagerSignup from "./components/ManagerSignUp";
import ManagerProfile from "./components/ManagerProfile";
import ManagerForgotPassword from "./components/ManagerForgotPassword";
import AddHotel from "./components/AddHotel";
import UnsuccessfulPayment from "./components/UnsuccessfulPayment";
import NotFound from "./components/NotFound";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <UserContextProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/usersignup" element={<SignUp />} />
            <Route path="/userlogin" element={<Login />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/hotel/:id" element={<HotelInfo />} />
            <Route path="/hotel/:id/book" element={<BookTable />} />
            <Route path="/user/:id/booked/:id1" element={<BookedPage />} />
            <Route path="/userforgotpassword" element={<ForgotPassword />} />
            <Route path="/managersignup" element={<ManagerSignup />} />
            <Route path="/managerlogin" element={<ManagerLogin />} />
            <Route path="/managerprofile/:id" element={<ManagerProfile />} />
            <Route path="/manager/:id/addhotel" element={<AddHotel />} />
            <Route
              path="/managerforgotpassword"
              element={<ManagerForgotPassword />}
            />
            <Route
              path="/cancel/:id/:tableselected/:slotselected"
              element={<UnsuccessfulPayment />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserContextProvider>
      </BrowserRouter>
      <Footer />
    </div>
  );
};

export default App;
