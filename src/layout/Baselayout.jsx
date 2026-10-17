import { useState } from "react";
import { Outlet } from "react-router-dom";

import NavbarMenu from "../components/NavbarMenu.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Baselayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <main className="app-shell">
      <Sidebar
        open={sidebarOpen}
        onClose={handleCloseSidebar}
      />

      
      <NavbarMenu onMenuClick={handleMenuClick} />

     
      <section className="full-box app-content">
        <Outlet />
      </section>
      
    </main>
  );
}

export default Baselayout;
