import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
   createTweet,
   deleteTweet,
   getUserTweets,
   updateTweet,
} from "../api/tweet.api";
import { likeTweet } from "../api/like.api";
import { useAuth } from "../Context/AuthContext";
import PageHeader from "../Components/page/PageHeader";
import Button from "../Components/ui/Button";
import { formatDate } from "../lib/format";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { Skeleton } from "../Components/ui/Skeleton";
import { getErrorMessage } from "../lib/error";

const TweetsPage = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();
   const [newTweet, setNewTweet] = useState("");
   const [editingId, setEditingId] = useState("");
   const [editingText, setEditingText] = useState("");

   const tweetsQuery = useQuery({
      queryKey: ["tweets", user?._id, "own"],
      queryFn: ({ signal }) => getUserTweets(user._id, { signal }),
      enabled: Boolean(user?._id),
   });

   const createMutation = useMutation({
      mutationFn: (content) => createTweet(content),
      onSuccess: () => {
         setNewTweet("");
         queryClient.invalidateQueries({ queryKey: ["tweets", user?._id, "own"] });
         toast.success("Tweet posted");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const updateMutation = useMutation({
      mutationFn: ({ tweetId, content }) => updateTweet(tweetId, content),
      onSuccess: () => {
         setEditingId("");
         setEditingText("");
         queryClient.invalidateQueries({ queryKey: ["tweets", user?._id, "own"] });
         toast.success("Tweet updated");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const deleteMutation = useMutation({
      mutationFn: (tweetId) => deleteTweet(tweetId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["tweets", user?._id, "own"] });
         toast.success("Tweet deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const likeMutation = useMutation({
      mutationFn: (tweetId) => likeTweet(tweetId),
      onSuccess: () => toast.success("Tweet like updated"),
      onError: (error) => toast.error(getErrorMessage(error)),
   });

   const tweets = tweetsQuery.data || [];

   return (
      <section className="space-y-4">
         <PageHeader
            title="Tweets"
            subtitle="Post short updates to your subscribers."
         />

         <div className="rounded-card border border-app-border bg-app-sidebar p-4">
            <textarea
               value={newTweet}
               onChange={(event) => setNewTweet(event.target.value)}
               className="min-h-24 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white outline-none placeholder:text-app-text-secondary focus:border-app-accent"
               placeholder="What's happening?"
            />
            <div className="mt-2 flex justify-end">
               <Button
                  loading={createMutation.isPending}
                  disabled={!newTweet.trim()}
                  onClick={() => createMutation.mutate(newTweet.trim())}
               >
                  Post Tweet
               </Button>
            </div>
         </div>

         {tweetsQuery.isLoading ? (
            <div className="space-y-3">
               {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-28 rounded-card" />
               ))}
            </div>
         ) : null}

         {tweetsQuery.isError ? (
            <ErrorState
               title="Could not load tweets"
               description={getErrorMessage(tweetsQuery.error)}
               onRetry={() => tweetsQuery.refetch()}
            />
         ) : null}

         {!tweetsQuery.isLoading && !tweetsQuery.isError && tweets.length === 0 ? (
            <EmptyState
               title="No tweets yet"
               description="Share your first short update."
            />
         ) : null}

         {!tweetsQuery.isLoading && !tweetsQuery.isError ? (
            <div className="space-y-3">
               {tweets.map((tweet) => (
                  <article
                     key={tweet._id}
                     className="rounded-card border border-app-border bg-app-sidebar p-4"
                  >
                     {editingId === tweet._id ? (
                        <div className="space-y-2">
                           <textarea
                              value={editingText}
                              onChange={(event) => setEditingText(event.target.value)}
                              className="min-h-20 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white outline-none focus:border-app-accent"
                           />
                           <div className="flex justify-end gap-2">
                              <Button
                                 variant="ghost"
                                 size="sm"
                                 onClick={() => {
                                    setEditingId("");
                                    setEditingText("");
                                 }}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 size="sm"
                                 onClick={() =>
                                    updateMutation.mutate({
                                       tweetId: tweet._id,
                                       content: editingText.trim(),
                                    })
                                 }
                                 loading={updateMutation.isPending}
                                 disabled={!editingText.trim()}
                              >
                                 Save
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <>
                           <p className="text-sm text-white">{tweet.content}</p>
                           <p className="mt-2 text-xs text-app-text-secondary">
                              {formatDate(tweet.createdAt)}
                           </p>
                        </>
                     )}

                     <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                           size="sm"
                           variant="ghost"
                           onClick={() => likeMutation.mutate(tweet._id)}
                           loading={likeMutation.isPending}
                        >
                           <Heart size={14} />
                           Like
                        </Button>
                        <Button
                           size="sm"
                           variant="subtle"
                           onClick={() => {
                              setEditingId(tweet._id);
                              setEditingText(tweet.content);
                           }}
                        >
                           <Pencil size={14} />
                           Edit
                        </Button>
                        <Button
                           size="sm"
                           variant="danger"
                           onClick={() => deleteMutation.mutate(tweet._id)}
                           loading={deleteMutation.isPending}
                        >
                           <Trash2 size={14} />
                           Delete
                        </Button>
                     </div>
                  </article>
               ))}
            </div>
         ) : null}
      </section>
   );
};

export default TweetsPage;

