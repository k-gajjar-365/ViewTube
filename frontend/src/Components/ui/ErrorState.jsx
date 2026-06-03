const ErrorState = ({
   title = "Something went wrong",
   description = "Please try again in a moment.",
   onRetry,
   compact = false,
}) => (
   <div
      className={`rounded-card border border-red-500/30 bg-red-950/20 ${
         compact ? "p-4" : "p-6"
      }`}
      role="alert"
   >
      <p className="text-base font-medium text-red-200">{title}</p>
      <p className="mt-1 text-sm text-red-200/80">{description}</p>
      {onRetry ? (
         <button
            type="button"
            onClick={onRetry}
            className="mt-4 min-h-11 rounded-pill bg-app-accent px-4 text-sm font-medium text-white transition hover:bg-app-accent-hover"
         >
            Retry
         </button>
      ) : null}
   </div>
);

export default ErrorState;
