import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CloseSvg = () => {
   return (
      <div className="absolute top-3.5 right-2 scale-112">
         <svg
            className="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
         >
            <path
               stroke="currentColor"
               strokeLinecap="round"
               strokeLinejoin="round"
               strokeWidth="2"
               d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
         </svg>
      </div>
   );
};

const Navbar = () => {
   const { auth } = useAuth();
   const [menuOpen, setMenuOpen] = useState(false);
   const [searchOpen, setSearchOpen] = useState(false);
   const navigation = useNavigate();
   const [serachValue, setSerachValue] = useState("");
   const inputRef = useRef(null);

   const handleKeyDown = (e) => {
      if (e.key === "Enter") {
         if (!serachValue.trim()) return;
         setTimeout(() => {
            document.title = `${serachValue} - ViewTube`
            navigation(`/?q=${encodeURIComponent(serachValue)}`);
         }, 200);
         setTimeout(() => {
            setSearchOpen(false)
         }, 400);
      }
   };
   // Auto focus when mobile search opens
   useEffect(() => {
      if (searchOpen) {
         inputRef.current?.focus();
      }
   }, [searchOpen]);

   const handleLogout = async () => {
      try {
         const response = await axios.post("/api/v1/users/logout");
         toast.success(response.data.message);
         window.location.reload();
      } catch (error) {
         toast.error(error.response?.data?.message);
      }
   };
   return (
      <header className="w-full sticky bg-[#121212] top-0 z-40 text-white px-4 py-3">
         {/* Main Row */}
         <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Logo */}
            <a href="/" className="text-xl ml-8 sm:ml-0 font-extrabold">
               ViewTube
            </a>

            {/* Desktop Search */}
            <div className="hidden md:flex relative flex-1 max-w-md">
               <input
                  type="search"
                  placeholder="Search..."
                  value={serachValue}
                  onChange={(e) => setSerachValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border rounded pl-9 pr-3 py-1 outline-none"
               />

               <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth=""
                     stroke="currentColor"
                     aria-hidden="true"
                     className="h-4 w-4"
                  >
                     {" "}
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                     ></path>{" "}
                  </svg>
               </span>
            </div>

            {/* Desktop Buttons */}
            {auth ? (
               <div className="hidden md:flex items-center gap-3">
                  <button
                     onClick={handleLogout}
                     className="px-4 bg-red-700 cursor-pointer py-1 rounded transition-all duration-300 hover:bg-red-500"
                  >
                     Logout
                  </button>
               </div>
            ) : (
               <div className="hidden md:flex items-center gap-3">
                  <a
                     href="/login"
                     className="px-4 py-1 rounded transition-all duration-300 hover:bg-[#2b2b2b]"
                  >
                     Login
                  </a>

                  <a
                     href="/register"
                     className="px-4 py-1 rounded transition-all duration-300 bg-[#ae7aff] hover:bg-[#9f65fd]"
                  >
                     Sign up
                  </a>
               </div>
            )}

            {/* Mobile Controls */}
            <div className="flex items-center gap-5 md:hidden">
               {/* Search Toggle */}
               <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="scale-130 mr-3"
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     strokeWidth=""
                     stroke="currentColor"
                     aria-hidden="true"
                     className="h-4 w-4"
                  >
                     {" "}
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                     ></path>{" "}
                  </svg>
               </button>

               {/* Menu Toggle */}
               <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="text-2xl"
               >
                  {menuOpen ? <CloseSvg /> : "☰"}
               </button>
            </div>
         </div>

         {/* Mobile Search */}
         {searchOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-black/60 pt-20 px-4">
               <input
                  ref={inputRef}
                  type="search"
                  value={serachValue}
                  onChange={(e) => setSerachValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full border bg-[#151515] rounded px-3 py-2 outline-none"
               />
            </div>
         )}

         {/* Mobile Menu */}

         {menuOpen && (
            <div className="md:hidden fixed inset-0 z-50 top-10 h-0 mt-3 bg-[#121212] rounded p-4 space-y-3">
               {!auth ? (
                  <>
                     <a
                        href="/login"
                        className="block text-center py-2 rounded transition-all duration-300 hover:bg-[#2b2b2b]"
                     >
                        Login
                     </a>

                     <a
                        href="/register"
                        className="block text-center py-2 rounded transition-all duration-300 bg-[#ae7aff] hover:bg-[#9f65fd]"
                     >
                        Sign up
                     </a>
                  </>
               ) : (
                  <button
                     onClick={handleLogout}
                     className="block w-full text-center py-2 rounded-lg transition-all duration-300 bg-red-600 hover:bg-red-400"
                  >
                     Logout
                  </button>
               )}
            </div>
         )}
      </header>
   );
};

export default Navbar;
