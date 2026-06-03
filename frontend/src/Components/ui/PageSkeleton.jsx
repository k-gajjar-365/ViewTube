import { VideoCardSkeleton } from "./Skeleton";

const PageSkeleton = () => (
   <div className="min-h-screen bg-app-bg pt-14 desktop:pl-[220px] tablet:pl-14">
      <div className="px-3 py-4 tablet:px-4 desktop:px-6">
         <div className="mb-4 space-y-2">
            <div className="h-8 w-52 animate-pulse rounded bg-app-card" />
            <div className="h-4 w-72 max-w-full animate-pulse rounded bg-app-card" />
         </div>
         <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {Array.from({ length: 9 }).map((_, index) => (
               <VideoCardSkeleton key={index} />
            ))}
         </div>
      </div>
   </div>
);

export default PageSkeleton;
