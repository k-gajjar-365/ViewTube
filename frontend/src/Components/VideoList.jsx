import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const VideoList = () => {
   const [videos, setVideos] = useState([]);
   const [searchParams] = useSearchParams();

   const query = searchParams.get("q") || "";

   useEffect(() => {
      (async () => {
         try {
            const response = await axios.get(`/api/v1/videos?query=${query}`);

            setVideos(response.data.data.docs);
            console.log(response.data.data.docs);
            
         } catch (error) {
            toast.error(error?.response?.data?.message || "Error");
         }
      })();
   }, [query]);

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
         {videos.map((video) => (
            <a
               href={video.videoFile}
               key={video._id}
               className="m-1 p-1 rounded-lg"
            >
               <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="mb-1 border rounded-2xl w-full object-cover"
               />

               <div className="flex gap-2 py-1">
                  <div className="flex mt-2 items-center justify-center w-12 h-12 mx-1 rounded-full overflow-hidden">
                     <img
                        src={video.owner?.avatar}
                        alt=""
                        className="size-10 rounded-full"
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
                        {video.views} Views
                     </div>
                  </div>
               </div>
            </a>
         ))}
      </div>
   );
};

export default VideoList;
