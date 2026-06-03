import { cn } from "../../lib/cn";

export const Input = ({
   id,
   type = "text",
   className = "",
   ...props
}) => (
   <input
      id={id}
      type={type}
      className={cn(
         "min-h-11 w-full rounded-card border border-app-border bg-app-card px-3 text-sm text-app-text-primary outline-none transition placeholder:text-app-text-secondary focus:border-app-accent",
         className
      )}
      {...props}
   />
);

export const TextArea = ({ id, className = "", ...props }) => (
   <textarea
      id={id}
      className={cn(
         "min-h-24 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-app-text-primary outline-none transition placeholder:text-app-text-secondary focus:border-app-accent",
         className
      )}
      {...props}
   />
);

export const Label = ({ htmlFor, children, className = "" }) => (
   <label
      htmlFor={htmlFor}
      className={cn("mb-1.5 block text-sm font-medium text-app-text-primary", className)}
   >
      {children}
   </label>
);

export const FieldError = ({ message }) =>
   message ? <p className="mt-1 text-xs text-red-300">{message}</p> : null;
