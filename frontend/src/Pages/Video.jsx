import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import second from "../assets/icons/logo.svg";
import CollapsibleText from "../Components/CollapsibleText";
import VideoList from "./VideoList";
import Comments from "../Components/Comments";
import logo from "../assets/icons/logo.svg"

const Video = () => {
   const params = useParams();
   const { videoId } = params;

   const [video, setVideo] = useState(null);
   const [like, setLike] = useState(false);
   const [comment, setComment] = useState("");
   const [disLike, setDisLike] = useState(false);
   const [showComments, setShowComments] = useState(false);
   
   //    useEffect(() => {
   //     (async () => {
   //         try {
   //             const response = await axios.get(`/api/v1/videos/${videoId}`, {withCredentials: true})

   //             setVideo(response.data.data)

   //         } catch (error) {
   //             toast.error(error.response.data.message || "Error while fetching video details")
   //         }
   //     })()
   //    }, []);

   const handleLike = () => {
      setDisLike(false);
      setLike(!like);
   };

   const handleDislike = () => {
      setLike(false);
      setDisLike(!disLike);
   };

   return (
      <div className="lg:grid grid-cols-3">
         <div className="flex flex-col gap-4 col-span-2">
            <div className="rounded-sm ">
               <video
                  src="https://www.pexels.com/download/video/35361237/"
                  controls
                  className="rounded"
               />
            </div>
            <div className="flex rounded-lg bg-[#131313] shadow-black shadow-sm flex-col  p-5 gap-4 mt-2">
               <div className="flex flex-col">
                  <b>Advanced React Patterns</b>
                  <span>30,164 views ·18 hours ago</span>
               </div>
               <div className="flex justify-between">
                  <div className="flex">
                     {like ? (
                        <button
                           className="flex gap-1 cursor-pointer border bg-white text-black px-2 py-1 rounded-l-lg"
                           onClick={handleLike}
                        >
                           <span>
                              <svg
                                 class="w-6 h-6 text-gray-800 dark:text-black"
                                 aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="24"
                                 height="24"
                                 fill="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    fill-rule="evenodd"
                                    d="M15.03 9.684h3.965c.322 0 .64.08.925.232.286.153.532.374.717.645a2.109 2.109 0 0 1 .242 1.883l-2.36 7.201c-.288.814-.48 1.355-1.884 1.355-2.072 0-4.276-.677-6.157-1.256-.472-.145-.924-.284-1.348-.404h-.115V9.478a25.485 25.485 0 0 0 4.238-5.514 1.8 1.8 0 0 1 .901-.83 1.74 1.74 0 0 1 1.21-.048c.396.13.736.397.96.757.225.36.32.788.269 1.211l-1.562 4.63ZM4.177 10H7v8a2 2 0 1 1-4 0v-6.823C3 10.527 3.527 10 4.176 10Z"
                                    clip-rule="evenodd"
                                 />
                              </svg>
                           </span>
                           <span>3050</span>
                        </button>
                     ) : (
                        <button
                           className="flex gap-1 cursor-pointer border px-2 py-1 rounded-l-lg"
                           onClick={handleLike}
                        >
                           <span>
                              <svg
                                 className="w-6 h-6 text-gray-800 dark:text-white"
                                 aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="24"
                                 height="24"
                                 fill="none"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 11c.889-.086 1.416-.543 2.156-1.057a22.323 22.323 0 0 0 3.958-5.084 1.6 1.6 0 0 1 .582-.628 1.549 1.549 0 0 1 1.466-.087c.205.095.388.233.537.406a1.64 1.64 0 0 1 .384 1.279l-1.388 4.114M7 11H4v6.5A1.5 1.5 0 0 0 5.5 19v0A1.5 1.5 0 0 0 7 17.5V11Zm6.5-1h4.915c.286 0 .372.014.626.15.254.135.472.332.637.572a1.874 1.874 0 0 1 .215 1.673l-2.098 6.4C17.538 19.52 17.368 20 16.12 20c-2.303 0-4.79-.943-6.67-1.475"
                                 />
                              </svg>
                           </span>
                           <span>3050</span>
                        </button>
                     )}

                     {disLike ? (
                        <button
                           className="flex gap-1 cursor-pointer border px-2 py-1 bg-white text-black rounded-r-lg "
                           onClick={handleDislike}
                        >
                           <span>
                              <svg
                                 class="w-6 h-6 text-gray-800 dark:text-black"
                                 aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="24"
                                 height="24"
                                 fill="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    fill-rule="evenodd"
                                    d="M8.97 14.316H5.004c-.322 0-.64-.08-.925-.232a2.022 2.022 0 0 1-.717-.645 2.108 2.108 0 0 1-.242-1.883l2.36-7.201C5.769 3.54 5.96 3 7.365 3c2.072 0 4.276.678 6.156 1.256.473.145.925.284 1.35.404h.114v9.862a25.485 25.485 0 0 0-4.238 5.514c-.197.376-.516.67-.901.83a1.74 1.74 0 0 1-1.21.048 1.79 1.79 0 0 1-.96-.757 1.867 1.867 0 0 1-.269-1.211l1.562-4.63ZM19.822 14H17V6a2 2 0 1 1 4 0v6.823c0 .65-.527 1.177-1.177 1.177Z"
                                    clip-rule="evenodd"
                                 />
                              </svg>
                           </span>
                           <span>152</span>
                        </button>
                     ) : (
                        <button
                           className="flex gap-1 cursor-pointer border px-2 py-1 rounded-r-lg "
                           onClick={handleDislike}
                        >
                           <span>
                              <svg
                                 class="w-6 h-6 text-gray-800 dark:text-white"
                                 aria-hidden="true"
                                 xmlns="http://www.w3.org/2000/svg"
                                 width="24"
                                 height="24"
                                 fill="none"
                                 viewBox="0 0 24 24"
                              >
                                 <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17 13c-.889.086-1.416.543-2.156 1.057a22.322 22.322 0 0 0-3.958 5.084 1.6 1.6 0 0 1-.582.628 1.549 1.549 0 0 1-1.466.087 1.587 1.587 0 0 1-.537-.406 1.666 1.666 0 0 1-.384-1.279l1.389-4.114M17 13h3V6.5A1.5 1.5 0 0 0 18.5 5v0A1.5 1.5 0 0 0 17 6.5V13Zm-6.5 1H5.585c-.286 0-.372-.014-.626-.15a1.797 1.797 0 0 1-.637-.572 1.873 1.873 0 0 1-.215-1.673l2.098-6.4C6.462 4.48 6.632 4 7.88 4c2.302 0 4.79.943 6.67 1.475"
                                 />
                              </svg>
                           </span>
                           <span>152</span>
                        </button>
                     )}
                  </div>

                  <div>
                     <button class="peer cursor-pointer flex items-center gap-x-2 rounded-lg bg-white px-4 py-1.5 text-black">
                        <span class="inline-block w-5">
                           <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                           >
                              <path
                                 strokeLinecap="round"
                                 strokeLinejoin="round"
                                 d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
                              ></path>
                           </svg>
                        </span>
                        Save
                     </button>
                  </div>
               </div>

               <div className="flex  justify-between px-1">
                  <div className="flex gap-2">
                     <div className="flex mt-2 items-center justify-center w-12 h-12 mx-1 rounded-full overflow-hidden">
                        <img
                           src={second}
                           alt=""
                           className="inline-block size-10 rounded-full ring-2 ring-gray-900 outline -outline-offset-1 outline-white/10"
                        />
                     </div>

                     <div className="flex mt-2 flex-col">
                        <span className="font-bold text-md">
                           React Patterns
                        </span>
                        <span className="text-gray-500 text-sm">
                           757K Subscribers
                        </span>
                     </div>
                  </div>

                  <div>
                     <button className="px-4 py-2 cursor-pointer bg-(--primary) hover:bg-(--primary-on-hover) rounded-lg mt-2">
                        Subscribe
                     </button>
                  </div>
               </div>
               <div class="w-full mt-3 h-[0.5px] bg-gray-500 mx-auto"></div>
               <div>
                  <CollapsibleText
                     text={
                        "🚀 Dive into the world of React with our latest tutorial series: 'Advanced React Patterns'! 🛠️ Whether you're a seasoned developer or just starting out, this series is designed to elevate your React skills to the next level."
                     }
                  />
               </div>
            </div>

            <div className="hidden lg:flex rounded-lg bg-[#131313] shadow-black shadow-sm flex-col  p-5 gap-4">
               <div className="flex  flex-col gap-4" id="comment-header">
                  <span>573 Comments</span>
                  <input
                     type="text"
                     value={comment}
                     onChange={(e) => setComment(e.target.value)}
                     className="border w-full rounded-md px-4 py-2 bg-transparent"
                     placeholder="Add a comment"
                  />
               </div>
               <div className="w-full h-[0.1px] bg-zinc-700" />

               <div className="h-screen overflow-y-auto px-2">
                  {Array.from({ length: 573 }).map((_, index) => (
                     <div key={index} className="mb-4">
                        <div className="flex gap-2">
                           <img
                              src={logo}
                              alt=""
                              className="w-10 h-10 rounded-full"
                           />

                           <div>
                              <p className="text-sm font-medium">
                                 Sarah Johnson
                              </p>
                              <p className="text-xs text-gray-500">
                                 17 hours ago
                              </p>
                           </div>
                        </div>

                        <p className="ml-12 mt-1 text-sm">
                           This series is exactly what I've been looking for!
                        </p>

                        <div className="w-full h-[0.5px] bg-gray-700 mt-3" />
                     </div>
                  ))}
               </div>
            </div>
            <div className="mt-4 lg:hidden">
               <button
                  className="shadow-black hover:bg-[#171717] shadow-sm cursor-pointer text-start px-6 rounded w-full p-4"
                  onClick={() => setShowComments(!showComments)}
               >
                  573 Comments...
               </button>
               {showComments && (
                  <div className="mt-4">
                     <Comments />
                  </div>
               )}
            </div>
         </div>
         <div className="mt-4 lg:mt-0 col-span-1 lg:ml-2">
            <VideoList gridCols={1} />
         </div>
      </div>
   );
};

export default Video;
