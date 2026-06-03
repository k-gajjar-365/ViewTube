import { cn } from "../../lib/cn";

export const Spinner = ({ className = "" }) => (
   <span
      className={cn(
         "inline-block h-5 w-5 animate-spin rounded-full border-2 border-app-text-secondary border-r-transparent",
         className
      )}
      aria-hidden="true"
   />
);

export const FullPageLoader = ({ label = "Loading..." }) => (
   <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="flex items-center gap-3 rounded-card border border-app-border bg-app-sidebar px-5 py-4 text-sm text-app-text-secondary">
         <Spinner />
         <span>{label}</span>
      </div>
   </div>
);
