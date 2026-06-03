import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteVideo, togglePublishVideo, updateVideo } from "../api/video.api";
import { getChannelStats, getChannelVideos } from "../api/dashboard.api";
import PageHeader from "../Components/page/PageHeader";
import StatCard from "../Components/page/StatCard";
import Button from "../Components/ui/Button";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { Skeleton } from "../Components/ui/Skeleton";
import { formatDuration, formatViews } from "../lib/format";
import { getErrorMessage } from "../lib/error";
import { FieldError, Input, Label, TextArea } from "../Components/ui/FormField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../lib/images";

const editSchema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string().min(1, "Description is required"),
   thumbnail: z.any().optional(),
});

const MyContentPage = () => {
   const queryClient = useQueryClient();
   const [editingVideo, setEditingVideo] = useState(null);
   const [visibleCount, setVisibleCount] = useState(12);

   const statsQuery = useQuery({
      queryKey: ["dashboard", "stats"],
      queryFn: ({ signal }) => getChannelStats({ signal }),
   });

   const videosQuery = useQuery({
      queryKey: ["dashboard", "videos"],
      queryFn: ({ signal }) => getChannelVideos({ signal }),
   });

   const deleteMutation = useMutation({
      mutationFn: (videoId) => deleteVideo(videoId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["dashboard", "videos"] });
         queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
         toast.success("Video deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const publishMutation = useMutation({
      mutationFn: (videoId) => togglePublishVideo(videoId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["dashboard", "videos"] });
         toast.success("Publish status updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const updateMutation = useMutation({
      mutationFn: ({ videoId, formData }) => updateVideo(videoId, formData),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["dashboard", "videos"] });
         setEditingVideo(null);
         toast.success("Video updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(editSchema),
      values: {
         title: editingVideo?.title || "",
         description: editingVideo?.description || "",
         thumbnail: undefined,
      },
   });

   const stats = statsQuery.data || {};
   const videos = useMemo(() => videosQuery.data ?? [], [videosQuery.data]);
   const visibleVideos = useMemo(() => videos.slice(0, visibleCount), [videos, visibleCount]);

   return (
      <section>
         <PageHeader
            title="My Content"
            subtitle="Manage uploads, visibility, and channel metrics."
            action={
               <Link to="/my-content/upload">
                  <Button>Upload Video</Button>
               </Link>
            }
         />

         {statsQuery.isLoading ? (
            <div className="mb-4 grid grid-cols-2 gap-3 desktop:grid-cols-4">
               {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 rounded-card" />
               ))}
            </div>
         ) : null}

         {statsQuery.isError ? (
            <div className="mb-4">
               <ErrorState
                  compact
                  title="Could not load channel stats"
                  description={getErrorMessage(statsQuery.error)}
                  onRetry={() => statsQuery.refetch()}
               />
            </div>
         ) : null}

         {!statsQuery.isLoading && !statsQuery.isError ? (
            <div className="mb-4 grid grid-cols-2 gap-3 desktop:grid-cols-4">
               <StatCard label="Subscribers" value={stats.totalSubscribers || 0} />
               <StatCard label="Videos" value={stats.totalVideos || 0} />
               <StatCard label="Views" value={stats.totalViews || 0} />
               <StatCard label="Likes" value={stats.totalLikes || 0} />
            </div>
         ) : null}

         {videosQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-56 rounded-card" />
               ))}
            </div>
         ) : null}

         {videosQuery.isError ? (
            <ErrorState
               title="Could not load your videos"
               description={getErrorMessage(videosQuery.error)}
               onRetry={() => videosQuery.refetch()}
            />
         ) : null}

         {!videosQuery.isLoading && !videosQuery.isError && videos.length === 0 ? (
            <EmptyState
               title="No uploads yet"
               description="Upload your first video to start your channel journey."
               action={
                  <Link to="/my-content/upload">
                     <Button>Upload Your First Video</Button>
                  </Link>
               }
            />
         ) : null}

         {!videosQuery.isLoading && !videosQuery.isError ? (
            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 desktop:grid-cols-3">
               {visibleVideos.map((video) => (
                  <article
                     key={video._id}
                     className="overflow-hidden rounded-card border border-app-border bg-app-sidebar"
                  >
                     <img
                        src={video.thumbnail || FALLBACK_THUMBNAIL}
                        alt={video.title}
                        width="640"
                        height="360"
                        loading="lazy"
                        onError={handleThumbnailError}
                        className="aspect-video w-full object-cover"
                     />
                     <div className="space-y-2 p-3">
                        <h3 className="line-clamp-2 text-sm font-medium text-white">
                           {video.title}
                        </h3>
                        <p className="text-xs text-app-text-secondary">
                           {formatViews(video.views)} - {formatDuration(video.duration)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                           <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => publishMutation.mutate(video._id)}
                              loading={publishMutation.isPending}
                           >
                              {video.isPublished ? "Unpublish" : "Publish"}
                           </Button>
                           <Button
                              size="sm"
                              variant="subtle"
                              onClick={() => {
                                 setEditingVideo(video);
                                 reset({
                                    title: video.title,
                                    description: video.description,
                                    thumbnail: undefined,
                                 });
                              }}
                           >
                              Edit
                           </Button>
                           <Button
                              size="sm"
                              variant="danger"
                              onClick={() => deleteMutation.mutate(video._id)}
                              loading={deleteMutation.isPending}
                           >
                              Delete
                           </Button>
                        </div>
                     </div>
                  </article>
               ))}
            </div>
         ) : null}

         {!videosQuery.isLoading && !videosQuery.isError && videos.length > visibleCount ? (
            <div className="mt-4 flex justify-center">
               <Button variant="ghost" onClick={() => setVisibleCount((count) => count + 12)}>
                  Load More
               </Button>
            </div>
         ) : null}

         {editingVideo ? (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4">
               <div className="w-full max-w-lg rounded-card border border-app-border bg-app-sidebar p-5">
                  <h2 className="text-lg font-semibold text-white">Edit video</h2>
                  <form
                     className="mt-4 space-y-3"
                     onSubmit={handleSubmit((values) => {
                        const formData = new FormData();
                        formData.append("title", values.title);
                        formData.append("description", values.description);
                        if (
                           values.thumbnail instanceof FileList &&
                           values.thumbnail.length > 0
                        ) {
                           formData.append("thumbnail", values.thumbnail[0]);
                        }

                        updateMutation.mutate({
                           videoId: editingVideo._id,
                           formData,
                        });
                     })}
                  >
                     <div>
                        <Label htmlFor="edit-title">Title</Label>
                        <Input id="edit-title" {...register("title")} />
                        <FieldError message={errors.title?.message} />
                     </div>

                     <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <TextArea id="edit-description" {...register("description")} />
                        <FieldError message={errors.description?.message} />
                     </div>

                     <div>
                        <Label htmlFor="edit-thumbnail">New Thumbnail</Label>
                        <Input
                           id="edit-thumbnail"
                           type="file"
                           accept="image/*"
                           {...register("thumbnail")}
                        />
                     </div>

                     <div className="flex justify-end gap-2">
                        <Button
                           variant="ghost"
                           onClick={() => setEditingVideo(null)}
                           type="button"
                        >
                           Cancel
                        </Button>
                        <Button type="submit" loading={updateMutation.isPending}>
                           Save Changes
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         ) : null}
      </section>
   );
};

export default MyContentPage;


