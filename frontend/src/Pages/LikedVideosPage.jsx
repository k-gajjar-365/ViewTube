import { useQuery } from "@tanstack/react-query";
import { getLikedVideos } from "../api/like.api";
import PageHeader from "../Components/page/PageHeader";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { Skeleton } from "../Components/ui/Skeleton";
import { formatDuration } from "../lib/format";
import { getErrorMessage } from "../lib/error";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../lib/images";

const LikedVideosPage = () => {
   const likedVideosQuery = useQuery({
      queryKey: ["likedVideos"],
      queryFn: ({ signal }) => getLikedVideos({ signal }),
   });

   const videos = likedVideosQuery.data || [];

   return (
      <section>
         <PageHeader
            title="Liked Videos"
            subtitle="Your saved likes from across the platform."
         />

         {likedVideosQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-56 rounded-card" />
               ))}
            </div>
         ) : null}

         {likedVideosQuery.isError ? (
            <ErrorState
               title="Could not load liked videos"
               description={getErrorMessage(likedVideosQuery.error)}
               onRetry={() => likedVideosQuery.refetch()}
            />
         ) : null}

         {!likedVideosQuery.isLoading && !likedVideosQuery.isError && videos.length === 0 ? (
            <EmptyState
               title="No liked videos yet"
               description="Like a video to add it to this list."
            />
         ) : null}

         {!likedVideosQuery.isLoading && !likedVideosQuery.isError ? (
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
               {videos.map((video, index) => (
                  <article
                     key={`${video.title}-${index}`}
                     className="overflow-hidden rounded-card border border-app-border bg-app-sidebar"
                  >
                     <div className="relative">
                        <img
                           src={video.thumbnail || FALLBACK_THUMBNAIL}
                           alt={video.title}
                           width="640"
                           height="360"
                           loading="lazy"
                           onError={handleThumbnailError}
                           className="aspect-video w-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-white">
                           {formatDuration(video.duration)}
                        </span>
                     </div>

                     <div className="p-3">
                        <h3 className="line-clamp-2 text-sm font-medium text-white">
                           {video.title}
                        </h3>
                        <p className="mt-1 text-xs text-app-text-secondary">
                           @{video.owner?.username}
                        </p>
                     </div>
                  </article>
               ))}
            </div>
         ) : null}
      </section>
   );
};

export default LikedVideosPage;

