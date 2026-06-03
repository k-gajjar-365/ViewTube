import { memo } from "react";
import { Link } from "react-router-dom";
import { formatDuration, formatRelativeTime, formatViews } from "../../lib/format";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../../lib/images";

const VideoCard = ({ video }) => {
   const ownerUsername = video?.owner?.username || "unknown";
   const ownerLabel = video?.owner?.fullName || ownerUsername;

   return (
      <article className="group">
         <Link to={`/video/${video?._id}`} className="block">
            <div className="relative overflow-hidden rounded-card border border-app-border bg-app-card">
               <img
                  src={video?.thumbnail || FALLBACK_THUMBNAIL}
                  alt={video?.title}
                  width="640"
                  height="360"
                  loading="lazy"
                  onError={handleThumbnailError}
                  className="aspect-video w-full object-cover transition duration-300 group-hover:scale-[1.02]"
               />
               <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white">
                  {formatDuration(video?.duration)}
               </span>
            </div>
         </Link>

         <div className="mt-2 flex gap-3">
            <Link
               to={`/channel/${ownerUsername}`}
               className="mt-0.5 h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-app-border"
            >
               <img
                  src={video?.owner?.avatar || FALLBACK_THUMBNAIL}
                  alt={ownerLabel}
                  width="36"
                  height="36"
                  loading="lazy"
                  onError={handleThumbnailError}
                  className="h-full w-full object-cover"
               />
            </Link>

            <div className="min-w-0">
               <Link to={`/video/${video?._id}`}>
                  <h3 className="line-clamp-2 text-sm font-medium text-white">{video?.title}</h3>
               </Link>
               <Link
                  to={`/channel/${ownerUsername}`}
                  className="mt-1 block text-xs text-app-text-secondary transition hover:text-white"
               >
                  {ownerLabel}
               </Link>
               <p className="mt-0.5 text-xs text-app-text-secondary">
                  {formatViews(video?.views)} - {formatRelativeTime(video?.createdAt)}
               </p>
            </div>
         </div>
      </article>
   );
};

export default memo(VideoCard);

