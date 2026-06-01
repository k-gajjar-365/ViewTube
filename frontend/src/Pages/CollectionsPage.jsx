import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
   createPlaylist,
   deletePlaylist,
   getPlaylists,
} from "../api/playlist.api";
import { useAuth } from "../Context/AuthContext";
import PageHeader from "../Components/page/PageHeader";
import Button from "../Components/ui/Button";
import { FieldError, Input, Label, TextArea } from "../Components/ui/FormField";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { Skeleton } from "../Components/ui/Skeleton";
import { getErrorMessage } from "../lib/error";

const schema = z.object({
   name: z.string().min(2, "Playlist name is required"),
   description: z.string().min(4, "Description is required"),
});

const CollectionsPage = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();

   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm({
      resolver: zodResolver(schema),
      defaultValues: {
         name: "",
         description: "",
      },
   });

   const playlistsQuery = useQuery({
      queryKey: ["playlists", user?._id],
      queryFn: ({ signal }) => getPlaylists(user._id, { signal }),
      enabled: Boolean(user?._id),
   });

   const createMutation = useMutation({
      mutationFn: createPlaylist,
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
         reset();
         toast.success("Playlist created");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const deleteMutation = useMutation({
      mutationFn: (playlistId) => deletePlaylist(playlistId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["playlists", user?._id] });
         toast.success("Playlist deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const playlists = playlistsQuery.data || [];

   return (
      <section className="space-y-5">
         <PageHeader
            title="Collections"
            subtitle="Build playlists and organize your favorites."
         />

         <div className="max-w-xl rounded-card border border-app-border bg-app-sidebar p-4">
            <h2 className="text-base font-medium text-white">Create playlist</h2>
            <form
               className="mt-3 space-y-3"
               onSubmit={handleSubmit((values) => createMutation.mutate(values))}
            >
               <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Frontend tutorials" {...register("name")} />
                  <FieldError message={errors.name?.message} />
               </div>
               <div>
                  <Label htmlFor="description">Description</Label>
                  <TextArea
                     id="description"
                     placeholder="Playlist description"
                     {...register("description")}
                  />
                  <FieldError message={errors.description?.message} />
               </div>
               <Button type="submit" loading={createMutation.isPending}>
                  Create Playlist
               </Button>
            </form>
         </div>

         {playlistsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-36 rounded-card" />
               ))}
            </div>
         ) : null}

         {playlistsQuery.isError ? (
            <ErrorState
               title="Could not load playlists"
               description={getErrorMessage(playlistsQuery.error)}
               onRetry={() => playlistsQuery.refetch()}
            />
         ) : null}

         {!playlistsQuery.isLoading && !playlistsQuery.isError && playlists.length === 0 ? (
            <EmptyState
               title="No playlists yet"
               description="Create your first playlist to get started."
            />
         ) : null}

         {!playlistsQuery.isLoading && !playlistsQuery.isError ? (
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
               {playlists.map((playlist) => (
                  <article
                     key={playlist._id}
                     className="rounded-card border border-app-border bg-app-sidebar p-4"
                  >
                     <Link to={`/collections/${playlist._id}`}>
                        <h3 className="text-base font-medium text-white">{playlist.name}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-app-text-secondary">
                           {playlist.description}
                        </p>
                        <p className="mt-2 text-xs text-app-text-secondary">
                           {playlist.totalVideos || 0} videos
                        </p>
                     </Link>

                     <Button
                        variant="danger"
                        size="sm"
                        className="mt-3"
                        loading={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(playlist._id)}
                     >
                        Delete
                     </Button>
                  </article>
               ))}
            </div>
         ) : null}
      </section>
   );
};

export default CollectionsPage;

