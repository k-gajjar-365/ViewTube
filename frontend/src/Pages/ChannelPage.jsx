import { useCallback, useMemo, useState } from "react";
import {
   useInfiniteQuery,
   useMutation,
   useQuery,
   useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { getChannel, getSubscribedChannels, toggleSubscribe } from "../api/user.api";
import { getVideos } from "../api/video.api";
import { getPlaylists } from "../api/playlist.api";
import { getUserTweets } from "../api/tweet.api";
import PageHeader from "../Components/page/PageHeader";
import VideoGrid from "../Components/video/VideoGrid";
import Button from "../Components/ui/Button";
import ErrorState from "../Components/ui/ErrorState";
import EmptyState from "../Components/ui/EmptyState";
import { Skeleton } from "../Components/ui/Skeleton";
import { getErrorMessage } from "../lib/error";
import { formatDate } from "../lib/format";
import ChannelHeader from "../Components/channel/ChannelHeader";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../lib/images";

const tabs = ["Videos", "Playlist", "Tweets", "Subscribed"];

const ChannelPage = () => {
   const { username } = useParams();
   const [activeTab, setActiveTab] = useState("Videos");
   const queryClient = useQueryClient();

   const channelQuery = useQuery({
      queryKey: ["channel", username],
      queryFn: ({ signal }) => getChannel(username, { signal }),
      enabled: Boolean(username),
   });

   const videosQuery = useInfiniteQuery({
      queryKey: ["videos", "channel", channelQuery.data?._id],
      queryFn: ({ pageParam = 1, signal }) =>
         getVideos({
            page: pageParam,
            limit: 12,
            userId: channelQuery.data?._id,
            query: "",
            sortBy: "createdAt",
            sortType: "desc",
            signal,
         }),
      getNextPageParam: (lastPage) => (lastPage?.hasNextPage ? lastPage.page + 1 : undefined),
      initialPageParam: 1,
      enabled: activeTab === "Videos" && Boolean(channelQuery.data?._id),
   });

   const playlistsQuery = useQuery({
      queryKey: ["playlists", channelQuery.data?._id],
      queryFn: ({ signal }) => getPlaylists(channelQuery.data?._id, { signal }),
      enabled: activeTab === "Playlist" && Boolean(channelQuery.data?._id),
   });

   const tweetsQuery = useQuery({
      queryKey: ["tweets", channelQuery.data?._id],
      queryFn: ({ signal }) => getUserTweets(channelQuery.data?._id, { signal }),
      enabled: activeTab === "Tweets" && Boolean(channelQuery.data?._id),
   });

   const subscribedQuery = useQuery({
      queryKey: ["subscribedChannels", channelQuery.data?._id],
      queryFn: ({ signal }) => getSubscribedChannels(channelQuery.data?._id, { signal }),
      enabled: activeTab === "Subscribed" && Boolean(channelQuery.data?._id),
   });

   const subscribeMutation = useMutation({
      mutationFn: () => toggleSubscribe(channelQuery.data?._id),
      onMutate: async () => {
         await queryClient.cancelQueries({ queryKey: ["channel", username] });
         const previous = queryClient.getQueryData(["channel", username]);

         queryClient.setQueryData(["channel", username], (current) => {
            if (!current) return current;
            const nextIsSubscribed = !current.isSubscribed;
            const delta = nextIsSubscribed ? 1 : -1;
            return {
               ...current,
               isSubscribed: nextIsSubscribed,
               subscribersCount: Math.max(0, (current.subscribersCount || 0) + delta),
            };
         });

         return { previous };
      },
      onError: (error, _variables, context) => {
         if (context?.previous) {
            queryClient.setQueryData(["channel", username], context.previous);
         }
         toast.error(getErrorMessage(error));
      },
      onSettled: () => {
         queryClient.invalidateQueries({ queryKey: ["channel", username] });
      },
   });

   const videos = useMemo(
      () => videosQuery.data?.pages.flatMap((page) => page.docs) || [],
      [videosQuery.data?.pages]
   );
   const playlists = playlistsQuery.data || [];
   const tweets = tweetsQuery.data || [];
   const subscribedChannels = subscribedQuery.data || [];

   const handleLoadMoreVideos = useCallback(() => {
      videosQuery.fetchNextPage();
   }, [videosQuery]);

   const renderTabContent = () => {
      if (activeTab === "Videos") {
         return (
            <VideoGrid
               videos={videos}
               isLoading={videosQuery.isLoading}
               isError={videosQuery.isError}
               errorContent={
                  <ErrorState
                     title="Unable to load channel videos"
                     description={getErrorMessage(videosQuery.error)}
                     onRetry={() => videosQuery.refetch()}
                  />
               }
               emptyTitle="No videos published"
               emptyDescription="This channel has not uploaded public videos yet."
               showLoadMore
               onLoadMore={handleLoadMoreVideos}
               isFetchingMore={videosQuery.isFetchingNextPage}
               hasNextPage={Boolean(videosQuery.hasNextPage)}
               skeletonCount={6}
            />
         );
      }

      if (activeTab === "Playlist") {
         if (playlistsQuery.isLoading) {
            return <Skeleton className="h-40 w-full rounded-card" />;
         }

         if (playlistsQuery.isError) {
            return (
               <ErrorState
                  title="Unable to load playlists"
                  description={getErrorMessage(playlistsQuery.error)}
                  onRetry={() => playlistsQuery.refetch()}
               />
            );
         }

         if (playlists.length === 0) {
            return (
               <EmptyState
                  title="No playlists yet"
                  description="This channel has not created any playlists."
               />
            );
         }

         return (
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
               {playlists.map((playlist) => (
                  <article
                     key={playlist._id}
                     className="rounded-card border border-app-border bg-app-sidebar p-4"
                  >
                     <h3 className="text-base font-medium text-white">{playlist.name}</h3>
                     <p className="mt-1 line-clamp-2 text-sm text-app-text-secondary">
                        {playlist.description}
                     </p>
                     <p className="mt-3 text-xs text-app-text-secondary">
                        {playlist.totalVideos || 0} videos
                     </p>
                  </article>
               ))}
            </div>
         );
      }

      if (activeTab === "Tweets") {
         if (tweetsQuery.isLoading) {
            return (
               <div className="space-y-3">
                  <Skeleton className="h-24 w-full rounded-card" />
                  <Skeleton className="h-24 w-full rounded-card" />
               </div>
            );
         }

         if (tweetsQuery.isError) {
            return (
               <ErrorState
                  title="Unable to load tweets"
                  description={getErrorMessage(tweetsQuery.error)}
                  onRetry={() => tweetsQuery.refetch()}
               />
            );
         }

         if (tweets.length === 0) {
            return (
               <EmptyState
                  title="No tweets yet"
                  description="This channel has not posted any tweets."
               />
            );
         }

         return (
            <div className="space-y-3">
               {tweets.map((tweet) => (
                  <article
                     key={tweet._id}
                     className="rounded-card border border-app-border bg-app-sidebar p-4"
                  >
                     <p className="text-sm text-white">{tweet.content}</p>
                     <p className="mt-2 text-xs text-app-text-secondary">
                        {formatDate(tweet.createdAt)}
                     </p>
                  </article>
               ))}
            </div>
         );
      }

      if (subscribedQuery.isLoading) {
         return (
            <div className="space-y-3">
               <Skeleton className="h-20 w-full rounded-card" />
               <Skeleton className="h-20 w-full rounded-card" />
            </div>
         );
      }

      if (subscribedQuery.isError) {
         return (
            <ErrorState
               title="Unable to load subscribed channels"
               description={getErrorMessage(subscribedQuery.error)}
               onRetry={() => subscribedQuery.refetch()}
            />
         );
      }

      if (subscribedChannels.length === 0) {
         return (
            <EmptyState
               title="No subscriptions"
               description="This channel is not subscribed to anyone yet."
            />
         );
      }

      return (
         <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
            {subscribedChannels.map((item) => (
               <article
                  key={item._id}
                  className="flex items-center gap-3 rounded-card border border-app-border bg-app-sidebar p-3"
               >
                  <img
                     src={item.avatar || FALLBACK_THUMBNAIL}
                     alt={item.username}
                     width="44"
                     height="44"
                     loading="lazy"
                     onError={handleThumbnailError}
                     className="h-11 w-11 rounded-full border border-app-border object-cover"
                  />
                  <div>
                     <p className="text-sm font-medium text-white">@{item.username}</p>
                  </div>
               </article>
            ))}
         </div>
      );
   };

   if (channelQuery.isLoading) {
      return (
         <div className="space-y-4">
            <Skeleton className="h-44 w-full rounded-card" />
            <Skeleton className="h-20 w-full rounded-card" />
            <Skeleton className="h-44 w-full rounded-card" />
         </div>
      );
   }

   if (channelQuery.isError) {
      return (
         <ErrorState
            title="Unable to load channel"
            description={getErrorMessage(channelQuery.error)}
            onRetry={() => channelQuery.refetch()}
         />
      );
   }

   return (
      <section>
         <PageHeader title={channelQuery.data.fullName || `@${channelQuery.data.username}`} />

         <ChannelHeader
            channel={channelQuery.data}
            onSubscribe={() => subscribeMutation.mutate()}
            subscribeLoading={subscribeMutation.isPending}
         />

         <div className="mt-4 border-b border-app-border">
            <div className="flex flex-wrap gap-4">
               {tabs.map((tab) => (
                  <button
                     key={tab}
                     type="button"
                     onClick={() => setActiveTab(tab)}
                     className={`min-h-11 border-b-2 px-1 text-sm font-medium transition ${
                        activeTab === tab
                           ? "border-app-accent text-white"
                           : "border-transparent text-app-text-secondary hover:text-white"
                     }`}
                  >
                     {tab}
                  </button>
               ))}
            </div>
         </div>

         <div className="mt-4">{renderTabContent()}</div>
      </section>
   );
};

export default ChannelPage;
