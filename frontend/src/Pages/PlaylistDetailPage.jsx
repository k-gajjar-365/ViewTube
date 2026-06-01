import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
   addToPlaylist,
   getPlaylistById,
   removeFromPlaylist,
   updatePlaylist,
} from "../api/playlist.api";
import { getVideoById } from "../api/video.api";
import { getChannelVideos } from "../api/dashboard.api";
import PageHeader from "../Components/page/PageHeader";
import Button from "../Components/ui/Button";
import { FieldError, Input, Label, TextArea } from "../Components/ui/FormField";
import ErrorState from "../Components/ui/ErrorState";
import EmptyState from "../Components/ui/EmptyState";
import { ListItemSkeleton, Skeleton } from "../Components/ui/Skeleton";
import VideoListItem from "../Components/video/VideoListItem";
import { getErrorMessage } from "../lib/error";

const schema = z.object({
   name: z.string().min(2, "Name is required"),
   description: z.string().min(4, "Description is required"),
});

const PlaylistDetailPage = () => {
   const { id } = useParams();
   const queryClient = useQueryClient();

   const playlistQuery = useQuery({
      queryKey: ["playlist", id],
      queryFn: ({ signal }) => getPlaylistById(id, { signal }),
      enabled: Boolean(id),
   });

   const playlistVideosQuery = useQuery({
      queryKey: ["playlistVideos", id, playlistQuery.data?.videos],
      queryFn: async ({ signal }) => {
         const videoIds = playlistQuery.data?.videos || [];

         if (videoIds.length === 0) {
            return [];
         }

         const videos = await Promise.all(
            videoIds.map((videoId) => getVideoById(videoId, { signal }))
         );
         return videos;
      },
      enabled: Boolean(playlistQuery.data),
   });

   const myVideosQuery = useQuery({
      queryKey: ["dashboard", "videos", "playlistOptions"],
      queryFn: ({ signal }) => getChannelVideos({ signal }),
   });

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(schema),
      values: {
         name: playlistQuery.data?.name || "",
         description: playlistQuery.data?.description || "",
      },
   });

   const updateMutation = useMutation({
      mutationFn: (payload) => updatePlaylist(id, payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["playlist", id] });
         toast.success("Playlist updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const addMutation = useMutation({
      mutationFn: (videoId) => addToPlaylist(id, videoId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["playlist", id] });
         toast.success("Video added to playlist");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const removeMutation = useMutation({
      mutationFn: (videoId) => removeFromPlaylist(id, videoId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["playlist", id] });
         toast.success("Video removed");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const availableVideos = myVideosQuery.data || [];
   const currentPlaylistVideoIds = useMemo(
      () => new Set(playlistQuery.data?.videos || []),
      [playlistQuery.data?.videos]
   );

   const addableVideos = availableVideos.filter(
      (video) => !currentPlaylistVideoIds.has(video._id)
   );

   if (playlistQuery.isLoading) {
      return (
         <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-card" />
            <Skeleton className="h-40 w-full rounded-card" />
         </div>
      );
   }

   if (playlistQuery.isError) {
      return (
         <ErrorState
            title="Could not load playlist"
            description={getErrorMessage(playlistQuery.error)}
            onRetry={() => playlistQuery.refetch()}
         />
      );
   }

   return (
      <section className="space-y-5">
         <PageHeader
            title={playlistQuery.data?.name || "Playlist"}
            subtitle="Manage playlist details and videos."
         />

         <div className="rounded-card border border-app-border bg-app-sidebar p-4">
            <h2 className="text-base font-medium text-white">Playlist details</h2>
            <form
               className="mt-3 grid grid-cols-1 gap-3 tablet:grid-cols-2"
               onSubmit={handleSubmit((values) => updateMutation.mutate(values))}
            >
               <div>
                  <Label htmlFor="playlist-name">Name</Label>
                  <Input id="playlist-name" {...register("name")} />
                  <FieldError message={errors.name?.message} />
               </div>
               <div className="tablet:col-span-2">
                  <Label htmlFor="playlist-description">Description</Label>
                  <TextArea id="playlist-description" {...register("description")} />
                  <FieldError message={errors.description?.message} />
               </div>
               <div className="tablet:col-span-2">
                  <Button type="submit" loading={updateMutation.isPending}>
                     Save Playlist
                  </Button>
               </div>
            </form>
         </div>

         <div className="rounded-card border border-app-border bg-app-sidebar p-4">
            <h2 className="text-base font-medium text-white">Add videos</h2>

            {myVideosQuery.isLoading ? <Skeleton className="mt-3 h-16 w-full rounded-card" /> : null}

            {myVideosQuery.isError ? (
               <ErrorState
                  compact
                  title="Could not load your videos"
                  description={getErrorMessage(myVideosQuery.error)}
                  onRetry={() => myVideosQuery.refetch()}
               />
            ) : null}

            {addableVideos.length === 0 ? (
               <p className="mt-2 text-sm text-app-text-secondary">
                  No additional videos available to add.
               </p>
            ) : (
               <div className="mt-3 grid grid-cols-1 gap-2 tablet:grid-cols-2">
                  {addableVideos.map((video) => (
                     <button
                        key={video._id}
                        type="button"
                        className="flex min-h-11 items-center justify-between rounded-card border border-app-border bg-app-card px-3 text-left text-sm text-white transition hover:border-app-accent"
                        onClick={() => addMutation.mutate(video._id)}
                     >
                        <span className="line-clamp-1">{video.title}</span>
                        <span className="text-xs text-app-text-secondary">Add</span>
                     </button>
                  ))}
               </div>
            )}
         </div>

         <div>
            <h2 className="mb-3 text-base font-medium text-white">Playlist videos</h2>

            {playlistVideosQuery.isLoading ? (
               <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                     <ListItemSkeleton key={index} />
                  ))}
               </div>
            ) : null}

            {playlistVideosQuery.isError ? (
               <ErrorState
                  compact
                  title="Could not load playlist videos"
                  description={getErrorMessage(playlistVideosQuery.error)}
                  onRetry={() => playlistVideosQuery.refetch()}
               />
            ) : null}

            {!playlistVideosQuery.isLoading &&
            !playlistVideosQuery.isError &&
            playlistVideosQuery.data?.length === 0 ? (
               <EmptyState
                  title="Playlist is empty"
                  description="Add videos from your content list above."
               />
            ) : null}

            {!playlistVideosQuery.isLoading && !playlistVideosQuery.isError ? (
               <div className="space-y-3">
                  {playlistVideosQuery.data?.map((video) => (
                     <div
                        key={video._id}
                        className="rounded-card border border-app-border bg-app-sidebar p-2"
                     >
                        <VideoListItem video={video} />
                        <Button
                           size="sm"
                           variant="danger"
                           className="mt-2"
                           loading={removeMutation.isPending}
                           onClick={() => removeMutation.mutate(video._id)}
                        >
                           Remove
                        </Button>
                     </div>
                  ))}
               </div>
            ) : null}
         </div>
      </section>
   );
};

export default PlaylistDetailPage;

