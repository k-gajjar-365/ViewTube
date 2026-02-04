import React from "react";
import { Outlet } from "react-router-dom";
const Layout = ({ children }) => {
   return (
      <>
         <header className="flex justify-between mb-3 mt-2 py-2 px-2">
            <a href="/" className="text-xl font-extrabold text-amber-50 ml-5">
               ViewTube
            </a>
            <div className="flex gap-2 w-[40vh] relative">
               <input
                  class="w-full border bg-transparent py-1 pl-8 pr-3 placeholder-white outline-none sm:py-2"
                  placeholder="Search"
               />
               <span class="absolute left-2.5 top-1/2 inline-block -translate-y-1/2">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke-width=""
                     stroke="currentColor"
                     aria-hidden="true"
                     class="h-4 w-4"
                  >
                     <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                  className="hover:bg-[#9164d9] bg-[#ae7aff] px-5 py-1 rounded"
               >
                  Sign up
               </a>
            </div>
         </header>

         <hr />

         <div className="flex gap-3">
            <div className="flex flex-col gap-4 pt-10 w-[30vh] h-screen p-5">
               <a
                  href="/"
                  className="border text-center hover:bg-[#9164d9] cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                     />
                  </svg>
                  Home
               </a>
               <a
                  href="/"
                  className="border hover:bg-[#9164d9]  text-center cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"
                     />
                  </svg>
                  Liked Videos
               </a>
               <a
                  href="/"
                  className="border hover:bg-[#9164d9] text-center cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        stroke-width="2"
                        d="M5 7h14M5 12h14M5 17h14"
                     />
                  </svg>
                  Watch History
               </a>
               <a
                  href="/"
                  className="border hover:bg-[#9164d9] text-center cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
                     />
                  </svg>
                  My Content
               </a>
               <a
                  href="/"
                  className="border hover:bg-[#9164d9] text-center cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        d="M13.5 8H4m0-2v13a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1h-5.032a1 1 0 0 1-.768-.36l-1.9-2.28a1 1 0 0 0-.768-.36H5a1 1 0 0 0-1 1Z"
                     />
                  </svg>
                  Collections
               </a>
               <a
                  href="/"
                  className="border hover:bg-[#9164d9] text-center cursor-pointer p-1 rounded-sm flex gap-2"
               >
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
                        stroke-width="2"
                        d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                     />
                  </svg>
                  Subscribers
               </a>
            </div>

            <div className="w-[0.4px] h-screen bg-gray-400"></div>

            <div className=" w-full">{children}</div>
         </div>
      </>
   );
};

export default Layout;
