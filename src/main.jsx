import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import ProfilePage from "./pages/Profile/ProfilePage";
import ProtectedRoute from "./context/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";

import CreateEventPage from "./pages/Events/CreateEventPage";
import FriendsPage from "./pages/Friends/FriendsPage";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";

import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Головний layout */}
        <Route path="/" element={<MainLayout />}>
          {/* Публічні сторінки */}
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="friends" element={<FriendsPage />} />
          <Route path="/user-profile/:userId" element={<UserProfilePage />} />

          {/* Захищені сторінки */}
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="create-event"
            element={
              <ProtectedRoute>
                <CreateEventPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
