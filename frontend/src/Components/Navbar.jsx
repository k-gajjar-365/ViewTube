import React, { useState, useRef, useEffect } from "react";

const CloseSvg = () => {
   return (
      <div className="absolute top-3.5 right-2 scale-112">
         <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
         >
            <path
               stroke="currentColor"
               stroke-linecap="round"
               stroke-linejoin="round"
               stroke-width="2"
               d="m15 9-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
         </svg>
      </div>
   );
};

const Navbar = () => {
   const [menuOpen, setMenuOpen] = useState(false);
   const [searchOpen, setSearchOpen] = useState(false);

   const inputRef = useRef(null);

   // Auto focus when mobile search opens
   useEffect(() => {
      if (searchOpen) {
         inputRef.current?.focus();
      }
   }, [searchOpen]);

   return (
      <header className="w-full bg-[#121212] text-white px-4 py-3">
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
            <div className="hidden md:flex items-center gap-3">
               <a
                  href="/"
                  className="px-4 py-1 rounded transition-all duration-300 hover:bg-[#2b2b2b]"
               >
                  Login
               </a>

               <a
                  href="/"
                  className="px-4 py-1 rounded transition-all duration-300 bg-[#ae7aff] hover:bg-[#9f65fd]"
               >
                  Sign up
               </a>
            </div>

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
            <div className="md:hidden mt-3 px-2">
               <input
                  ref={inputRef}
                  type="search"
                  placeholder="Search..."
                  className="w-full bg-transparent border rounded px-3 py-2 outline-none"
               />
            </div>
         )}

         {/* Mobile Menu */}
         {menuOpen && (
            <div className="md:hidden mt-3 bg-[#1a1a1a] rounded p-4 space-y-3">
               <a
                  href="/"
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
            </div>
         )}
      </header>
   );
};

export default Navbar;
