import React, { useState } from "react";

const CloseSvg = () => {
   return (
      <div className="absolute top-1 scale-115">
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
const Sidebar = () => {
   const [openMenu, setopenMenu] = useState(false);

   return (
      <div className="flex fixed  lg:static z-40 bg-[#121212]">
         <div className="group hidden sm:flex flex-col gap-4 pt-10 w-[10vh] lg:w-[30vh] hover:w-[30vh] h-screen p-5">
            <a
               href="/"
               className=" text-center hover:bg-(--primary) cursor-pointer p-1 rounded-sm flex gap-2"
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
                     d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                  />
               </svg>
               <span className="lg:block group-hover:block hidden">Home</span>
            </a>
            <a
               href="/"
               className=" hover:bg-(--primary)  text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
               <span className="lg:block group-hover:block hidden">
                  Liked Videos
               </span>
            </a>
            <a
               href="/"
               className=" hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                     d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5"
                  />
               </svg>

               <span className="lg:block group-hover:block hidden">
                  Watch History
               </span>
            </a>
            <a
               href="/"
               className=" hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                     d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
                  />
               </svg>
               <span className="lg:block group-hover:block hidden">
                  My Content
               </span>
            </a>
            <a
               href="/"
               className=" hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
               <span className="lg:block group-hover:block hidden">
                  Collections
               </span>
            </a>
            <a
               href="/"
               className=" hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                     strokeWidth="2"
                     d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
               </svg>
               <span className="lg:block group-hover:block hidden">
                  Subscribers
               </span>
            </a>
         </div>

         <button
            onClick={() => setopenMenu(!openMenu)}
            className={`sm:hidden text-2xl px-2 ${openMenu && "bg-[#121212]"} h-11 absolute w-full -top-11`}
         >
            {openMenu ? <CloseSvg /> : "☰"}
         </button>

         {openMenu && (
            <div
               className="group flex flex-col gap-4 sm:hidden w-[30vh] h-screen"
               onClick={() => setopenMenu}
            >
               <div
                  className="group flex flex-col gap-4 pt-10 w-[30vh] h-screen p-5 bg-[#121212]"
                  onClick={(e) => e.stopPropagation()}
               >
                  <a
                     href="/"
                     className="border text-center hover:bg-(--primary) cursor-pointer p-1 rounded-sm flex gap-2"
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
                           d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                        />
                     </svg>
                     <span>Home</span>
                  </a>
                  <a
                     href="/"
                     className="border hover:bg-(--primary)  text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                     <span>Liked Videos</span>
                  </a>
                  <a
                     href="/"
                     className="border hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                           strokeWidth="2"
                           d="M5 7h14M5 12h14M5 17h14"
                        />
                     </svg>
                     <span>Watch History</span>
                  </a>
                  <a
                     href="/"
                     className="border hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                           d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z"
                        />
                     </svg>
                     <span>My Content</span>
                  </a>
                  <a
                     href="/"
                     className="border hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                     <span>Collections</span>
                  </a>
                  <a
                     href="/"
                     className="border hover:bg-(--primary) text-center cursor-pointer p-1 rounded-sm flex gap-2"
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
                           strokeWidth="2"
                           d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                     </svg>
                     <span>Subscribers</span>
                  </a>
               </div>
            </div>
         )}

         <div
            className="w-px h-screen"
            style={{
               boxShadow: "4px 0 5px rgba(0, 0, 0, 0.5)",
            }}
         ></div>
      </div>
   );
};

export default Sidebar;
