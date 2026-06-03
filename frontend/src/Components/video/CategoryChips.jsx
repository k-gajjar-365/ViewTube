import { memo } from "react";
import { cn } from "../../lib/cn";

const CategoryChips = ({ categories, activeCategory, onChange }) => (
   <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
      {categories.map((category) => {
         const isActive = activeCategory === category;

         return (
            <button
               key={category}
               type="button"
               onClick={() => onChange(category)}
               className={cn(
                  "min-h-11 whitespace-nowrap rounded-pill border px-4 text-sm font-medium transition",
                  isActive
                     ? "border-app-accent bg-app-accent text-white"
                     : "border-app-border bg-app-sidebar text-app-text-secondary hover:bg-app-card hover:text-white"
               )}
            >
               {category}
            </button>
         );
      })}
   </div>
);

export default memo(CategoryChips);
