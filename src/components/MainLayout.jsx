import React from 'react';
import Navbar from "./Navbar/Navbar";
import Sidebar from "./Sidebar/Sidebar";
import BottomNavigation from "./BottomNavigation/BottomNavigation";

export default function MainLayout({ children, sidebarOpen, setSidebarOpen }) {
  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {children}
      <BottomNavigation />
    </>
  );
}
