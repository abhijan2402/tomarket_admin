import React from "react";
import { Button } from "./components/ui/button";
import { Navigate, Route, Routes } from "react-router-dom";
import { Task } from "./pages/Task";
import DashboardLayout from "./layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to='/dashboard' />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="task" element={<Task />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
