import { useState } from "react";

export default function CollapsibleText({ text }) {
   const [open, setOpen] = useState(false);

   return (
      <div>
         <p className={`${open? "text-zinc-100": "text-zinc-700"} ${open ? "" : "line-clamp-2"}`}>{text}</p>

         <button
            onClick={() => setOpen(!open)}
            className="mt-1 text-sm cursor-pointer text-indigo-600 hover:underline"
         >
            {open ? "Show Less" : "Show More"}
         </button>
      </div>
   );
}
