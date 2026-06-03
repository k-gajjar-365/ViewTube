import React, { useState } from "react";
import logo from "../assets/icons/logo.svg";

const Comments = () => {
   const [comment, setComment] = useState("");
   const [open, setOpen] = useState(true);

   return (
      open && (
         <div
            className="fixed inset-0 z-50 bg-black/60 flex justify-center items-end"
            onClick={() => setOpen(false)}
         >
            <div
               className="bg-[#131313] w-full h-[90vh] rounded-t-2xl flex flex-col gap-3 px-4 py-5"
               onClick={(e) => e.stopPropagation()}
            >
               <div className="flex justify-between items-center">
                  <span className="font-semibold">Comments</span>

                  <button className="scale-110" onClick={() => setOpen(false)}>
                     ✕
                  </button>
               </div>

               <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="border w-full rounded-md px-4 py-2 bg-transparent"
                  placeholder="Add a comment"
               />

               <div className="w-full h-[0.1px] bg-zinc-700" />

               <div className="flex-1 overflow-y-auto px-2">
                  {Array.from({ length: 10 }).map((_, index) => (
                     <div key={index} className="mb-4">
                        <div className="flex gap-2">
                           <img
                              src={logo}
                              alt=""
                              className="w-10 h-10 rounded-full"
                           />

                           <div>
                              <p className="text-sm font-medium">
                                 Sarah Johnson
                              </p>
                              <p className="text-xs text-gray-500">
                                 17 hours ago
                              </p>
                           </div>
                        </div>

                        <p className="ml-12 mt-1 text-sm">
                           This series is exactly what I've been looking for!
                        </p>

                        <div className="w-full h-[0.5px] bg-gray-700 mt-3" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )
   );
};

export default Comments;
