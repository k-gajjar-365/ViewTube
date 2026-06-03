import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const AppLayout = () => {
   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

   return (
      <div className="min-h-screen bg-app-bg text-app-text-primary">
         <TopBar onToggleMenu={() => setIsMobileSidebarOpen(true)} />
         <Sidebar
            isMobileOpen={isMobileSidebarOpen}
            onClose={() => setIsMobileSidebarOpen(false)}
         />

         <main className="pt-14 desktop:pl-[220px] tablet:pl-14">
            <div className="min-h-[calc(100vh-56px)] px-3 py-4 tablet:px-4 desktop:px-6">
               <Outlet />
            </div>
         </main>
      </div>
   );
};

export default AppLayout;
