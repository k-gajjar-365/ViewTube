import { cn } from "../../lib/cn";

export const Skeleton = ({ className = "" }) => (
   <div
      className={cn(
         "animate-pulse rounded bg-gradient-to-r from-app-card via-app-border to-app-card",
         className
      )}
   />
);

export const VideoCardSkeleton = () => (
   <div className="space-y-3">
      <Skeleton className="aspect-video w-full rounded-card" />
      <div className="space-y-2">
         <Skeleton className="h-4 w-11/12" />
         <Skeleton className="h-4 w-9/12" />
         <Skeleton className="h-3 w-5/12" />
      </div>
   </div>
);

export const ListItemSkeleton = () => (
   <div className="flex gap-3">
      <Skeleton className="h-24 w-44 rounded-card" />
      <div className="flex-1 space-y-2">
         <Skeleton className="h-4 w-10/12" />
         <Skeleton className="h-4 w-7/12" />
         <Skeleton className="h-3 w-5/12" />
      </div>
   </div>
);
