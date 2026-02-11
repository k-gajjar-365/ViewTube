import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import NoVideo from "./NoVideo";
import Loader from "./Loader";

const VideoList = () => {
   const [videos, setVideos] = useState([]);
   const [searchParams] = useSearchParams();
   const [hoverOnVideo, setHoverOnVideo] = useState(null);
   const [loading, setLoading] = useState(false);
   const timerRef = useRef(null);

   const query = searchParams.get("q") || "";
   const sortBy = searchParams.get("sortBy") || "";
   const sortType = searchParams.get("sortType") || "";

   function calculateDuration(duration) {
      const totalSeconds = Math.floor(duration);

      const minutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;

      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
   }

   const handlePreview = (id) => {
      clearTimeout(timerRef.current);
      setHoverOnVideo(null);

      timerRef.current = setTimeout(() => {
         setHoverOnVideo(id);
      }, 500);
   };

   const handleMouseLeave = () => {
      clearTimeout(timerRef.current);
      setHoverOnVideo(null);
   };

   useEffect(() => {
      (async () => {
         try {
            setLoading(true);
            const response = await axios.get(
               `/api/v1/videos?query=${query}&sortBy=${sortBy}&sortType=${sortType}`
            );
            setVideos(response.data.data.docs);
         } catch (error) {
            toast.error(error?.response?.data?.message || "Error");
         } finally {
            setLoading(false);
         }
      })();
   }, [query, sortBy, sortType]);

   if (loading) return <Loader size={25} />;

   if (videos.length === 0) return <NoVideo search={query} />;

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {videos.map((video) => (
            <a
               href={video.videoFile}
               key={video._id}
               className="m-1 p-1 rounded-lg"
               onMouseEnter={() => handlePreview(video._id)}
               onMouseLeave={handleMouseLeave}
            >
               {hoverOnVideo === video._id ? (
                  <div className="relative">
                     <video
                        autoPlay
                        muted
                        src={video.videoFile}
                        className="mb-1 rounded-2xl w-full object-cover"
                     />
                  </div>
               ) : (
                  <div className="relative">
                     <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="mb-1 rounded-2xl w-full object-cover"
                     />
                     <span className="absolute bottom-2 right-2 bg-gray-900 opacity-80 px-1 rounded-md ">
                        {calculateDuration(video.duration)}
                     </span>
                  </div>
               )}

               <div className="flex gap-2 py-1">
                  <div className="flex mt-2 items-center justify-center w-12 h-12 mx-1 rounded-full overflow-hidden">
                     <img
                        src={video.owner?.avatar}
                        alt={video.description}
                        className="inline-block size-10 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
                     />
                  </div>

                  <div className="flex flex-col">
                     <div className="font-medium line-clamp-2">
                        {video.title}
                     </div>

                     <span className="text-sm text-gray-400">
                        {video.owner?.username}
                     </span>

                     <div className="text-sm text-gray-500">
                        {video.views} views
                     </div>
                  </div>
               </div>
            </a>
         ))}
      </div>
   );
};

export default VideoList;
