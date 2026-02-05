import React from "react";

const Navbar = () => {
   return (
      <header className="flex justify-between mb-3 mt-2 py-2 px-2">
         <a href="/" className="text-xl font-extrabold text-amber-50 ml-5">
            ViewTube
         </a>
         <div className="flex gap-2 w-[40vh] relative">
            <input
               className="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
               placeholder="Search"
            />
            <span className="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth=""
                  stroke="currentColor"
                  aria-hidden="true"
                  className="h-4 w-4"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  ></path>
               </svg>
            </span>
         </div>
         <div className="flex gap-3">
            <a href="/" className="hover:bg-[#383737] px-5 py-1 rounded">
               Login
            </a>
            <a
               href="/"
               className="hover:bg-(--primary) bg-[#ae7aff] px-5 py-1 rounded"
            >
               Sign up
            </a>
         </div>
      </header>
   );
};

export default Navbar;
