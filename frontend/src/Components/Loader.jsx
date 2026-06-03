import React from "react";

const Loader = ({ size = 40 }) => {
   return (
      <div className="flex justify-center items-center h-[70vh] py-10">
         <div
            className="animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"
            style={{
               width: size,
               height: size,
            }}
         ></div>
      </div>
   );
};

export default Loader;
