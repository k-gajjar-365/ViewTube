import { memo } from "react";
import VideoCard from "./VideoCard";
import { VideoCardSkeleton } from "../ui/Skeleton";
import EmptyState from "../ui/EmptyState";

const VideoGrid = ({
   videos = [],
   isLoading = false,
   isError = false,
   errorContent = null,
   emptyTitle = "No videos found",
   emptyDescription = "Try a different filter or check back later.",
   skeletonCount = 9,
   showLoadMore = false,
   onLoadMore,
   isFetchingMore = false,
   hasNextPage = false,
}) => {
   if (isLoading) {
      return (
         <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {Array.from({ length: skeletonCount }).map((_, index) => (
               <VideoCardSkeleton key={index} />
            ))}
         </div>
      );
   }

   if (isError) {
      return errorContent;
   }

   if (videos.length === 0) {
      return <EmptyState title={emptyTitle} description={emptyDescription} />;
   }

   return (
      <div className="space-y-4">
         <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
            {videos.map((video) => (
               <VideoCard key={video._id} video={video} />
            ))}
         </div>

         {showLoadMore && hasNextPage ? (
            <div className="flex justify-center">
               <button
                  type="button"
                  onClick={onLoadMore}
                  disabled={isFetchingMore}
                  className="min-h-11 rounded-pill border border-app-border bg-app-sidebar px-5 text-sm font-medium text-white transition hover:bg-app-card disabled:cursor-not-allowed disabled:opacity-60"
               >
                  {isFetchingMore ? "Loading..." : "Load More"}
               </button>
            </div>
         ) : null}
      </div>
   );
};

export default memo(VideoGrid);
