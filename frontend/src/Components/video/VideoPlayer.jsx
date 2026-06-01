import { memo } from "react";
import { FALLBACK_THUMBNAIL } from "../../lib/images";

const VideoPlayer = ({ src, poster, title }) => (
   <div className="overflow-hidden rounded-card border border-app-border bg-black">
      <video
         controls
         preload="metadata"
         controlsList="nodownload"
         src={src}
         poster={poster || FALLBACK_THUMBNAIL}
         className="aspect-video w-full bg-black"
      />
      <span className="sr-only">{title}</span>
   </div>
);

export default memo(VideoPlayer);
