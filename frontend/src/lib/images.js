export const FALLBACK_THUMBNAIL = "/placeholder-thumbnail.jpg";

export const handleThumbnailError = (event) => {
   const element = event.currentTarget;
   element.onerror = null;
   element.src = FALLBACK_THUMBNAIL;
};
