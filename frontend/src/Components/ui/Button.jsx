import { cn } from "../../lib/cn";
import { Spinner } from "./Loader";

const variantStyles = {
   primary:
      "bg-app-accent text-white hover:bg-app-accent-hover border border-app-accent",
   ghost:
      "bg-transparent text-app-text-primary hover:bg-app-card border border-app-border",
   subtle: "bg-app-card text-app-text-primary hover:bg-zinc-800 border border-app-border",
   danger: "bg-red-600 text-white hover:bg-red-500 border border-red-500",
};

const sizeStyles = {
   sm: "min-h-10 px-3 text-sm",
   md: "min-h-11 px-4 text-sm",
   lg: "min-h-12 px-5 text-base",
};

const Button = ({
   children,
   className = "",
   variant = "primary",
   size = "md",
   loading = false,
   disabled = false,
   type = "button",
   ...props
}) => (
   <button
      type={type}
      disabled={disabled || loading}
      className={cn(
         "inline-flex items-center justify-center gap-2 rounded-pill font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-accent focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:opacity-60",
         variantStyles[variant],
         sizeStyles[size],
         className
      )}
      {...props}
   >
      {loading ? <Spinner className="h-4 w-4 border-white border-r-transparent" /> : null}
      {children}
   </button>
);

export default Button;
