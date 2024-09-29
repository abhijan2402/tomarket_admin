import React from "react";
import { Button } from "./components/ui/button";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Advertisement from "./pages/Advertisement";
import LogoManagement from "./pages/LogoManagement";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to='/dashboard' />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="task" element={<Task />} />
          <Route path="logo-management" element={<LogoManagement />} />
          <Route path="advertisement" element={<Advertisement />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
