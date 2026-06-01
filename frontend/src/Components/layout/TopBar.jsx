import { Link, useLocation, useNavigate } from "react-router-dom";
import {
   Menu,
   Search,
   ChevronDown,
   LogOut,
   Settings,
   LayoutDashboard,
   MessageSquareText,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Button from "../ui/Button";
import AppLogo from "./AppLogo";
import { useDebounce } from "../../hooks/useDebounce";

const TopBar = ({ onToggleMenu }) => {
   const { isAuthenticated, user, logout } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();
   const searchParamQuery = new URLSearchParams(location.search).get("q") || "";
   const dropdownRef = useRef(null);
   const [query, setQuery] = useState(searchParamQuery);
   const [showMobileSearch, setShowMobileSearch] = useState(false);
   const [showDropdown, setShowDropdown] = useState(false);
   const debouncedQuery = useDebounce(query, 300);
   const isSearchRoute = location.pathname === "/search";

   useEffect(() => {
      setQuery(searchParamQuery);
   }, [searchParamQuery]);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (!dropdownRef.current?.contains(event.target)) {
            setShowDropdown(false);
         }
      };

      window.addEventListener("mousedown", handleClickOutside);
      return () => window.removeEventListener("mousedown", handleClickOutside);
   }, []);

   useEffect(() => {
      if (!isSearchRoute) return;

      const trimmed = debouncedQuery.trim();
      const currentQuery = (new URLSearchParams(location.search).get("q") || "").trim();

      if (trimmed === currentQuery) return;

      if (!trimmed) {
         navigate("/search", { replace: true });
         return;
      }

      navigate(`/search?q=${encodeURIComponent(trimmed)}`, { replace: true });
   }, [debouncedQuery, isSearchRoute, location.search, navigate]);

   const submitSearch = useCallback((event) => {
      event.preventDefault();
      const trimmed = query.trim();

      if (!trimmed) {
         navigate("/");
         return;
      }

      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setShowMobileSearch(false);
   }, [navigate, query]);

   const initials = user?.username ? user.username.slice(0, 2).toUpperCase() : "U";

   return (
      <header className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-app-border bg-app-sidebar">
         <div className="flex h-full items-center justify-between gap-3 px-3 desktop:px-6">
            <div className="flex items-center gap-3">
               <button
                  type="button"
                  onClick={onToggleMenu}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-app-text-primary transition hover:bg-app-card desktop:hidden"
                  aria-label="Open menu"
               >
                  <Menu size={20} />
               </button>
               <Link to="/">
                  <AppLogo />
               </Link>
            </div>

            <form
               onSubmit={submitSearch}
               className="hidden w-full max-w-2xl items-center desktop:flex tablet:flex"
            >
               <div className="relative w-full">
                  <Search
                     size={18}
                     className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary"
                  />
                  <input
                     type="search"
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     placeholder="Search"
                     className="h-11 w-full rounded-pill border border-app-border bg-app-card pl-10 pr-4 text-sm text-app-text-primary outline-none placeholder:text-app-text-secondary focus:border-app-accent"
                  />
               </div>
            </form>

            <div className="flex items-center gap-2">
               <button
                  type="button"
                  onClick={() => setShowMobileSearch((prev) => !prev)}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-app-text-primary transition hover:bg-app-card tablet:hidden desktop:hidden"
                  aria-label="Open search"
               >
                  <Search size={20} />
               </button>

               {!isAuthenticated ? (
                  <div className="hidden items-center gap-2 tablet:flex desktop:flex">
                     <Link
                        to="/login"
                        className="inline-flex min-h-11 items-center rounded-pill px-4 text-sm font-medium text-white transition hover:bg-app-card"
                     >
                        Log in
                     </Link>
                     <Link to="/signup">
                        <Button size="md" className="min-w-[96px]">
                           Sign up
                        </Button>
                     </Link>
                  </div>
               ) : (
                  <div className="relative" ref={dropdownRef}>
                     <button
                        type="button"
                        onClick={() => setShowDropdown((prev) => !prev)}
                        className="flex min-h-11 items-center gap-2 rounded-pill border border-app-border bg-app-card px-3 text-sm text-white transition hover:bg-zinc-800"
                     >
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-app-accent text-xs font-bold">
                           {initials}
                        </span>
                        <span className="hidden desktop:block">
                           @{user?.username || "user"}
                        </span>
                        <ChevronDown size={16} />
                     </button>

                     {showDropdown ? (
                        <div className="absolute right-0 mt-2 w-56 rounded-card border border-app-border bg-app-sidebar p-1 shadow-card">
                           <Link
                              to="/my-content"
                              className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-app-text-primary transition hover:bg-app-card"
                              onClick={() => setShowDropdown(false)}
                           >
                              <LayoutDashboard size={16} />
                              My Content
                           </Link>
                           <Link
                              to="/tweets"
                              className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-app-text-primary transition hover:bg-app-card"
                              onClick={() => setShowDropdown(false)}
                           >
                              <MessageSquareText size={16} />
                              Tweets
                           </Link>
                           <Link
                              to="/settings"
                              className="flex min-h-11 items-center gap-2 rounded-md px-3 text-sm text-app-text-primary transition hover:bg-app-card"
                              onClick={() => setShowDropdown(false)}
                           >
                              <Settings size={16} />
                              Settings
                           </Link>
                           <button
                              type="button"
                              onClick={async () => {
                                 setShowDropdown(false);
                                 await logout();
                                 navigate("/login");
                              }}
                              className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-red-200 transition hover:bg-red-500/10"
                           >
                              <LogOut size={16} />
                              Log out
                           </button>
                        </div>
                     ) : null}
                  </div>
               )}
            </div>
         </div>

         {showMobileSearch ? (
            <form
               onSubmit={submitSearch}
               className="border-t border-app-border bg-app-sidebar px-3 py-3 tablet:hidden desktop:hidden"
            >
               <div className="relative">
                  <Search
                     size={18}
                     className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary"
                  />
                  <input
                     autoFocus
                     type="search"
                     value={query}
                     onChange={(event) => setQuery(event.target.value)}
                     placeholder="Search"
                     className="h-11 w-full rounded-pill border border-app-border bg-app-card pl-10 pr-4 text-sm text-app-text-primary outline-none placeholder:text-app-text-secondary focus:border-app-accent"
                  />
               </div>
            </form>
         ) : null}
      </header>
   );
};

export default TopBar;
