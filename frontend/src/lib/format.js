const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
   numeric: "auto",
});

const secondsByUnit = {
   year: 31536000,
   month: 2592000,
   week: 604800,
   day: 86400,
   hour: 3600,
   minute: 60,
   second: 1,
};

export const formatDuration = (seconds) => {
   const totalSeconds = Number.isFinite(seconds) ? Math.floor(seconds) : 0;
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const remainingSeconds = totalSeconds % 60;

   if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
         remainingSeconds
      ).padStart(2, "0")}`;
   }

   return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

export const formatViews = (value) => {
   const views = Number(value || 0);
   return `${new Intl.NumberFormat("en", {
      notation: views > 9999 ? "compact" : "standard",
      maximumFractionDigits: 1,
   }).format(views)} views`;
};

export const formatDate = (value) => {
   if (!value) return "Unknown date";

   return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
};

export const formatRelativeTime = (value) => {
   if (!value) return "Just now";

   const dateValue = new Date(value).getTime();
   if (Number.isNaN(dateValue)) return "Just now";

   const elapsedSeconds = Math.floor((dateValue - Date.now()) / 1000);

   for (const [unit, secondsInUnit] of Object.entries(secondsByUnit)) {
      if (Math.abs(elapsedSeconds) >= secondsInUnit || unit === "second") {
         const delta = Math.round(elapsedSeconds / secondsInUnit);
         return relativeTimeFormatter.format(delta, unit);
      }
   }

   return "Just now";
};
