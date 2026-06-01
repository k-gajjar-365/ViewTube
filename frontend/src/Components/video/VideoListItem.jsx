import { memo } from "react";
import { Link } from "react-router-dom";
import { formatDuration, formatRelativeTime, formatViews } from "../../lib/format";
import { cn } from "../../lib/cn";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../../lib/images";

const VideoListItem = ({ video, compact = false }) => {
   const ownerUsername = video?.owner?.username || "unknown";
   const ownerLabel = video?.owner?.fullName || ownerUsername;

   return (
      <article
         className={cn(
            "group flex gap-3",
            compact ? "rounded-card p-1.5 transition hover:bg-app-card" : "rounded-card border border-app-border bg-app-sidebar p-2"
         )}
      >
         <Link
            to={`/video/${video?._id}`}
            className={cn(
               "relative block flex-shrink-0 overflow-hidden rounded-card border border-app-border",
               compact ? "w-44" : "w-52 mobile:w-40"
            )}
         >
            <img
               src={video?.thumbnail || FALLBACK_THUMBNAIL}
               alt={video?.title}
               width="640"
               height="360"
               loading="lazy"
               onError={handleThumbnailError}
               className="aspect-video h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] text-white">
               {formatDuration(video?.duration)}
            </span>
         </Link>

         <div className="min-w-0">
            <Link to={`/video/${video?._id}`}>
               <h3 className="line-clamp-2 text-sm font-medium text-white">{video?.title}</h3>
            </Link>
            <Link
               to={`/channel/${ownerUsername}`}
               className="mt-1 block text-xs text-app-text-secondary hover:text-white"
            >
               {ownerLabel}
            </Link>
            <p className="mt-0.5 text-xs text-app-text-secondary">
               {formatViews(video?.views)} - {formatRelativeTime(video?.createdAt)}
            </p>
            {!compact ? (
               <p className="mt-2 line-clamp-2 text-xs text-app-text-secondary">
                  {video?.description}
               </p>
            ) : null}
         </div>
      </article>
   );
};

export default memo(VideoListItem);

