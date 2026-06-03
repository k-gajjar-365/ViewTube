import { useIsFetching, useIsMutating } from "@tanstack/react-query";

const GlobalNetworkIndicator = () => {
   const isFetching = useIsFetching();
   const isMutating = useIsMutating();
   const isActive = isFetching + isMutating > 0;

   return (
      <div
         aria-hidden="true"
         className={`pointer-events-none fixed left-0 right-0 top-0 z-[70] h-0.5 bg-transparent transition-opacity duration-200 ${
            isActive ? "opacity-100" : "opacity-0"
         }`}
      >
         <div
            className={`h-full w-full bg-app-accent shadow-[0_0_12px_rgba(124,58,237,0.8)] ${
               isActive ? "animate-pulse" : ""
            }`}
         />
      </div>
   );
};

export default GlobalNetworkIndicator;
