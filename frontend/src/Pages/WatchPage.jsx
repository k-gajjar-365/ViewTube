import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
   ThumbsUp,
   ThumbsDown,
   Share2,
   BookmarkPlus,
   ChevronDown,
   ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { getVideoById, getVideos } from "../api/video.api";
import { getChannel, toggleSubscribe } from "../api/user.api";
import { likeVideo, unlikeVideo } from "../api/like.api";
import { formatDate, formatViews } from "../lib/format";
import { getErrorMessage } from "../lib/error";
import ErrorState from "../Components/ui/ErrorState";
import { ListItemSkeleton, Skeleton } from "../Components/ui/Skeleton";
import Button from "../Components/ui/Button";
import VideoListItem from "../Components/video/VideoListItem";
import VideoPlayer from "../Components/video/VideoPlayer";
import CommentSection from "../Components/comments/CommentSection";
import ChannelHeader from "../Components/channel/ChannelHeader";
import EmptyState from "../Components/ui/EmptyState";

const WatchPage = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const queryClient = useQueryClient();
   const [showDescription, setShowDescription] = useState(false);

   const videoQuery = useQuery({
      queryKey: ["video", id],
      queryFn: ({ signal }) => getVideoById(id, { signal }),
      enabled: Boolean(id),
   });

   const channelQuery = useQuery({
      queryKey: ["channel", videoQuery.data?.owner?.username],
      queryFn: ({ signal }) =>
         getChannel(videoQuery.data?.owner?.username, { signal }),
      enabled: Boolean(videoQuery.data?.owner?.username),
   });

   const relatedQuery = useQuery({
      queryKey: ["videos", "related", id, videoQuery.data?.title],
      queryFn: ({ signal }) =>
         getVideos({
            page: 1,
            limit: 12,
            query: videoQuery.data?.title?.split(" ")?.[0] || "",
            sortBy: "createdAt",
            sortType: "desc",
            signal,
         }),
      enabled: Boolean(videoQuery.data?.title),
   });

   const likeMutation = useMutation({
      mutationFn: () => (liked ? unlikeVideo(id) : likeVideo(id)),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: ["video", id] });
         const previous = queryClient.getQueryData(["video", id]);

         queryClient.setQueryData(["video", id], (current) => {
            if (!current) return current;

            const currentlyLiked = Boolean(current.isLikedByCurrentUser);
            const likesCount = Number(current.likesCount || 0);
            return {
               ...current,
               isLikedByCurrentUser: !currentlyLiked,
               likesCount: Math.max(0, likesCount + (currentlyLiked ? -1 : 1)),
            };
         });

         return { previous };
      },
      onError: (error, _variables, context) => {
         if (context?.previous) {
            queryClient.setQueryData(["video", id], context.previous);
         }
         toast.error(getErrorMessage(error, "Like update failed"));
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["video", id] });
         queryClient.invalidateQueries({ queryKey: ["likedVideos"] });
      },
   });

   const subscribeMutation = useMutation({
      mutationFn: (channelId) => toggleSubscribe(channelId),
      onMutate: async (channelId) => {
         await queryClient.cancelQueries({
            queryKey: ["channel", videoQuery.data?.owner?.username],
         });

         const previous = queryClient.getQueryData([
            "channel",
            videoQuery.data?.owner?.username,
         ]);

         queryClient.setQueryData(["channel", videoQuery.data?.owner?.username], (current) => {
            if (!current || current._id !== channelId) return current;
            const nextIsSubscribed = !current.isSubscribed;
            const diff = nextIsSubscribed ? 1 : -1;
            return {
               ...current,
               isSubscribed: nextIsSubscribed,
               subscribersCount: Math.max(0, (current.subscribersCount || 0) + diff),
            };
         });

         return { previous };
      },
      onError: (error, _channelId, context) => {
         if (context?.previous) {
            queryClient.setQueryData(
               ["channel", videoQuery.data?.owner?.username],
               context.previous
            );
         }
         toast.error(getErrorMessage(error, "Subscription update failed"));
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: ["channel", videoQuery.data?.owner?.username],
         });
      },
   });

   const video = videoQuery.data;
   const channel = channelQuery.data;
   const liked = Boolean(video?.isLikedByCurrentUser);
   const likeCount = Number(video?.likesCount || 0);
   
   const relatedVideos = useMemo(() => {
      const docs = relatedQuery.data?.docs || [];
      return docs.filter((relatedVideo) => relatedVideo._id !== id);
   }, [id, relatedQuery.data?.docs]);

   const handleCopyLink = useCallback(async () => {
      try {         
         await navigator.clipboard.writeText(window.location.href);
         toast.success("Video link copied");
      } catch {
         toast.error("Unable to copy link");
      }
   }, []);

   const toggleDescription = useCallback(() => {
      setShowDescription((prev) => !prev);
   }, []);

   if (videoQuery.isLoading) {
      return (
         <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-card" />
            <Skeleton className="h-8 w-11/12" />
            <Skeleton className="h-28 w-full rounded-card" />
         </div>
      );
   }

   if (videoQuery.isError) {
      return (
         <ErrorState
            title="Unable to load this video"
            description={getErrorMessage(videoQuery.error)}
            onRetry={() => videoQuery.refetch()}
         />
      );
   }

   return (
      <section className="grid grid-cols-1 gap-4 desktop:grid-cols-[minmax(0,1fr)_360px]">
         <div className="space-y-4">
            <VideoPlayer src={video?.videoFile} poster={video?.thumbnail} title={video?.title} />

            <div>
               <h1 className="text-xl font-semibold text-white">{video?.title}</h1>
               <p className="mt-1 text-sm text-app-text-secondary">
                  {formatViews(video?.views)} - Uploaded {formatDate(video?.createdAt)}
               </p>
            </div>

            <div className="flex flex-wrap gap-2">
               <Button
                  variant={liked ? "primary" : "ghost"}
                  onClick={() => likeMutation.mutate()}
                  loading={likeMutation.isPending}
               >
                  <ThumbsUp size={16} />
                  Like {likeCount > 0 ? `(${likeCount})` : ""}
               </Button>
               <Button variant="ghost">
                  <ThumbsDown size={16} />
                  Dislike
               </Button>
               <Button variant="ghost" onClick={handleCopyLink}>
                  <Share2 size={16} />
                  Share
               </Button>
               <Button variant="ghost" onClick={() => navigate("/collections")}>
                  <BookmarkPlus size={16} />
                  Save
               </Button>
            </div>

            <ChannelHeader
               compact
               channel={channel || video?.owner}
               onSubscribe={() => subscribeMutation.mutate(video?.owner?._id)}
               subscribeLoading={subscribeMutation.isPending}
            />

            <div className="rounded-card border border-app-border bg-app-sidebar p-4">
               <button
                  type="button"
                  onClick={toggleDescription}
                  className="flex min-h-11 w-full items-center justify-between text-left"
               >
                  <span className="text-sm font-medium text-white">Description</span>
                  {showDescription ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
               </button>
               <p
                  className={`text-sm text-app-text-secondary ${
                     showDescription ? "mt-2" : "line-clamp-3"
                  }`}
               >
                  {video?.description}
               </p>
            </div>

            <CommentSection videoId={id} />
         </div>

         <aside className="space-y-3">
            <h2 className="text-base font-semibold text-white">Up Next</h2>

            {relatedQuery.isLoading
               ? Array.from({ length: 6 }).map((_, index) => (
                    <ListItemSkeleton key={index} />
                 ))
               : null}

            {relatedQuery.isError ? (
               <ErrorState
                  compact
                  title="Related videos failed"
                  description={getErrorMessage(relatedQuery.error)}
                  onRetry={() => relatedQuery.refetch()}
               />
            ) : null}

            {!relatedQuery.isLoading && !relatedQuery.isError && relatedVideos.length === 0 ? (
               <EmptyState
                  title="No related videos"
                  description="Try exploring more from the home feed."
               />
            ) : null}

            {!relatedQuery.isLoading && !relatedQuery.isError
               ? relatedVideos.map((relatedVideo) => (
                    <VideoListItem key={relatedVideo._id} video={relatedVideo} compact />
                 ))
               : null}
         </aside>
      </section>
   );
};

export default WatchPage;
