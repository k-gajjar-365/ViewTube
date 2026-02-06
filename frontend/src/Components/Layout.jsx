import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = () => {
   return (
      <div className="min-h-screen bg-[#121212] text-white">
         {/* Navbar on top */}
         <Navbar />

         {/* Body */}
         <div className="flex">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-4 overflow-y-auto">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default Layout;
