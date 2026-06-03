import { NavLink } from "react-router-dom";
import {
   Home,
   Heart,
   History,
   Clapperboard,
   ListVideo,
   Users,
   LifeBuoy,
   Settings,
   X,
} from "lucide-react";
import { cn } from "../../lib/cn";

const primaryItems = [
   { to: "/", label: "Home", icon: Home, exact: true },
   { to: "/liked", label: "Liked Videos", icon: Heart },
   { to: "/history", label: "History", icon: History },
   { to: "/my-content", label: "My Content", icon: Clapperboard },
   { to: "/collections", label: "Collections", icon: ListVideo },
   { to: "/subscribers", label: "Subscribers", icon: Users },
];

const secondaryItems = [
   { to: "/support", label: "Support", icon: LifeBuoy },
   { to: "/settings", label: "Settings", icon: Settings },
];

const linkBaseClass =
   "group relative flex min-h-11 items-center gap-3 rounded-card px-3 text-sm font-medium transition";

const SidebarLink = ({ item, compact, closeMobile }) => (
   <NavLink
      to={item.to}
      end={item.exact}
      title={compact ? item.label : undefined}
      onClick={closeMobile}
      className={({ isActive }) =>
         cn(
            linkBaseClass,
            isActive
               ? "bg-app-card text-white before:absolute before:left-0 before:top-1/2 before:h-7 before:w-1 before:-translate-y-1/2 before:rounded-r before:bg-app-accent"
               : "text-app-text-secondary hover:bg-app-card hover:text-white",
            compact ? "justify-center px-0" : ""
         )
      }
   >
      <item.icon size={20} />
      <span
         className={cn(
            "truncate",
            compact ? "absolute left-full ml-2 hidden rounded border border-app-border bg-app-sidebar px-2 py-1 text-xs group-hover:block" : ""
         )}
      >
         {item.label}
      </span>
   </NavLink>
);

const SidebarContent = ({ compact = false, closeMobile }) => (
   <div className="flex h-full flex-col p-3">
      <nav className="space-y-1">
         {primaryItems.map((item) => (
            <SidebarLink
               key={item.to}
               item={item}
               compact={compact}
               closeMobile={closeMobile}
            />
         ))}
      </nav>

      <div className="mt-auto border-t border-app-border pt-3">
         <nav className="space-y-1">
            {secondaryItems.map((item) => (
               <SidebarLink
                  key={item.to}
                  item={item}
                  compact={compact}
                  closeMobile={closeMobile}
               />
            ))}
         </nav>
      </div>
   </div>
);

const Sidebar = ({ isMobileOpen, onClose }) => (
   <>
      <aside className="fixed left-0 top-14 hidden h-[calc(100vh-56px)] border-r border-app-border bg-app-sidebar desktop:block desktop:w-[220px]">
         <SidebarContent />
      </aside>

      <aside className="fixed left-0 top-14 hidden h-[calc(100vh-56px)] border-r border-app-border bg-app-sidebar tablet:block tablet:w-14">
         <SidebarContent compact />
      </aside>

      {isMobileOpen ? (
         <div className="fixed inset-0 z-40 bg-black/60 desktop:hidden tablet:hidden">
            <aside className="h-full w-[220px] border-r border-app-border bg-app-sidebar">
               <div className="flex h-14 items-center justify-between border-b border-app-border px-3">
                  <span className="text-sm font-semibold text-white">Navigation</span>
                  <button
                     type="button"
                     onClick={onClose}
                     className="flex h-11 w-11 items-center justify-center rounded-full text-white hover:bg-app-card"
                     aria-label="Close sidebar"
                  >
                     <X size={18} />
                  </button>
               </div>
               <SidebarContent closeMobile={onClose} />
            </aside>
         </div>
      ) : null}
   </>
);

export default Sidebar;
