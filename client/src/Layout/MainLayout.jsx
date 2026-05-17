// Layout/MainLayout.jsx

import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

function MainLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  const [isMobile, setIsMobile] = useState(false);


  

 const toggleSidebar = () => {
  if (isMobile) {
    setMobileOpen((prev) => !prev);
  } else {
    setDesktopCollapsed((prev) => !prev);
  }
};


  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <div className="bg-black min-h-screen">
      <Header toggleSidebar={toggleSidebar} />

      <Sidebar
        mobileOpen={mobileOpen}
        desktopCollapsed={desktopCollapsed}
        setMobileOpen={setMobileOpen}
      />

      <div
  className={`transition-all duration-300 ${
    isMobile
      ? mobileOpen
        ? "ml-2"
        : "ml-0"
      : desktopCollapsed
        ? "ml-10"
        : "ml-60"
  }`}
>
  <Outlet />
</div>
    </div>
  );
}

export default MainLayout;