import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";

const DashboardLayout = () => {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />

        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
