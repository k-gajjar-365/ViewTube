import { memo } from "react";
import Button from "../ui/Button";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../../lib/images";

const ChannelHeader = ({
   channel,
   onSubscribe,
   subscribeLoading = false,
   compact = false,
}) => {
   if (!channel) {
      return null;
   }

   if (compact) {
      return (
         <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-app-border bg-app-sidebar p-4">
            <div className="flex items-center gap-3">
               <img
                  src={channel.avatar || FALLBACK_THUMBNAIL}
                  alt={channel.username || "channel"}
                  width="44"
                  height="44"
                  loading="lazy"
                  onError={handleThumbnailError}
                  className="h-11 w-11 rounded-full border border-app-border object-cover"
               />
               <div>
                  <p className="text-sm font-semibold text-white">
                     {channel.fullName || channel.username}
                  </p>
                  <p className="text-xs text-app-text-secondary">
                     {channel.subscribersCount || 0} subscribers
                  </p>
               </div>
            </div>
            {onSubscribe ? (
               <Button onClick={onSubscribe} loading={subscribeLoading}>
                  {channel.isSubscribed ? "Subscribed" : "Subscribe"}
               </Button>
            ) : null}
         </div>
      );
   }

   return (
      <div className="overflow-hidden rounded-card border border-app-border bg-app-sidebar">
         {channel.coverImage ? (
            <img
               src={channel.coverImage}
               alt={channel.username || "channel cover"}
               width="1280"
               height="256"
               loading="lazy"
               onError={handleThumbnailError}
               className="h-44 w-full object-cover"
            />
         ) : (
            <div className="h-44 w-full bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900" />
         )}
         <div className="relative px-4 pb-4 pt-0">
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
               <div className="flex items-end gap-3">
                  <img
                     src={channel.avatar || FALLBACK_THUMBNAIL}
                     alt={channel.username || "channel"}
                     width="80"
                     height="80"
                     loading="lazy"
                     onError={handleThumbnailError}
                     className="h-20 w-20 rounded-full border-4 border-app-sidebar object-cover"
                  />
                  <div className="pb-1">
                     <h2 className="text-xl font-semibold text-white">
                        {channel.fullName || channel.username}
                     </h2>
                     <p className="text-sm text-app-text-secondary">@{channel.username}</p>
                     <p className="text-sm text-app-text-secondary">
                        {channel.subscribersCount || 0} subscribers -{" "}
                        {channel.channelsSubscribedToCount || 0} subscribed
                     </p>
                  </div>
               </div>

               {onSubscribe ? (
                  <Button onClick={onSubscribe} loading={subscribeLoading}>
                     {channel.isSubscribed ? "Subscribed" : "Subscribe"}
                  </Button>
               ) : null}
            </div>
         </div>
      </div>
   );
};

export default memo(ChannelHeader);
