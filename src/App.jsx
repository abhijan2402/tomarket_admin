import React from "react";
import { Button } from "./components/ui/button";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Advertisement from "./pages/Advertisement";
import LogoManagement from "./pages/LogoManagement";
import Login from "./pages/Login";
import AuthGuard from "./guard/AuthGuard";
import GuestGuard from "./guard/GuestGuard";
import Category from "./pages/Category";
import SingleTask from "./pages/SingleTask";
import HomeLayout from "./pages/HomeLayout";
import Admins from "./pages/Admins";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          }
        >
          <Route path="" element={<Dashboard />} />
          <Route path="multi-task" element={<Task />} />
          <Route path="single-task" element={<SingleTask />} />
          <Route path="home-layout" element={<HomeLayout />} />
          <Route path="logo-management" element={<LogoManagement />} />
          <Route path="advertisement" element={<Advertisement />} />
          <Route path="admins" element={<Admins />} />
          <Route path="category" element={<Category />} />
        </Route>

        <Route
          path="/login"
          element={
            <GuestGuard>
              <Login />
            </GuestGuard>
          }
        />
      </Routes>
    </>
  );
};

export default App;
