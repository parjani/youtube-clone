// Layout/MainLayout.jsx

import { useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="bg-black min-h-screen">
      {/* HEADER */}
      <Header toggleSidebar={toggleSidebar} />

      {/* SIDEBAR */}
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* PAGE CONTENT */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-60" : "ml-20"
        }`}
      >
        <Outlet context={{ sidebarOpen }} />
      </div>
    </div>
  );
}

export default MainLayout;