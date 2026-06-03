import { useCallback, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { toast } from "sonner";
import {
   addComment,
   deleteComment,
   getComments,
   updateComment,
} from "../../api/comment.api";
import { likeComment } from "../../api/like.api";
import { useAuth } from "../../Context/AuthContext";
import { getErrorMessage } from "../../lib/error";
import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import ErrorState from "../ui/ErrorState";
import { Skeleton } from "../ui/Skeleton";
import CommentItem from "./CommentItem";

const CommentSection = ({ videoId }) => {
   const queryClient = useQueryClient();
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const parentRef = useRef(null);

   const commentsQuery = useQuery({
      queryKey: ["comments", videoId],
      queryFn: ({ signal }) => getComments(videoId, { page: 1, limit: 100, signal }),
      enabled: Boolean(videoId),
   });

   const addMutation = useMutation({
      mutationFn: (commentText) => addComment(videoId, commentText),
      onMutate: async (commentText) => {
         await queryClient.cancelQueries({ queryKey: ["comments", videoId] });

         const previous = queryClient.getQueryData(["comments", videoId]);
         const optimisticComment = {
            _id: `temp-${Date.now()}`,
            content: commentText,
            createdAt: new Date().toISOString(),
            owner: {
               _id: user?._id,
               username: user?.username || "you",
               avatar: user?.avatar || "",
            },
         };

         queryClient.setQueryData(["comments", videoId], (current) => ({
            ...(current || {}),
            docs: [optimisticComment, ...(current?.docs || [])],
         }));

         setContent("");
         return { previous };
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
         toast.success("Comment posted");
      },
      onError: (error, _commentText, context) => {
         if (context?.previous) {
            queryClient.setQueryData(["comments", videoId], context.previous);
         }
         toast.error(getErrorMessage(error, "Could not post comment"));
      },
   });

   const updateMutation = useMutation({
      mutationFn: ({ commentId, text }) => updateComment(commentId, text),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
         toast.success("Comment updated");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Could not update comment")),
   });

   const deleteMutation = useMutation({
      mutationFn: (commentId) => deleteComment(commentId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
         toast.success("Comment deleted");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Could not delete comment")),
   });

   const likeMutation = useMutation({
      mutationFn: (commentId) => likeComment(commentId),
      onSuccess: () => {
         toast.success("Comment like updated");
      },
      onError: (error) => toast.error(getErrorMessage(error, "Could not like comment")),
   });

   const comments = useMemo(() => commentsQuery.data?.docs ?? [], [commentsQuery.data?.docs]);
   const shouldVirtualize = comments.length > 50;
   const virtualizer = useVirtualizer({
      count: shouldVirtualize ? comments.length : 0,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 170,
      overscan: 6,
   });

   const virtualRows = virtualizer.getVirtualItems();

   const handleSubmit = useCallback(
      (event) => {
         event.preventDefault();
         if (!content.trim()) return;
         addMutation.mutate(content.trim());
      },
      [addMutation, content]
   );

   return (
      <section className="rounded-card border border-app-border bg-app-sidebar p-4 desktop:p-5">
         <h2 className="text-base font-medium text-white">Comments</h2>

         <form className="mt-3 flex flex-col gap-2" onSubmit={handleSubmit}>
            <textarea
               value={content}
               onChange={(event) => setContent(event.target.value)}
               placeholder="Add a comment"
               className="min-h-24 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white outline-none placeholder:text-app-text-secondary focus:border-app-accent"
            />
            <div className="flex justify-end">
               <Button type="submit" loading={addMutation.isPending} disabled={!content.trim()}>
                  Post Comment
               </Button>
            </div>
         </form>

         <div className="mt-4 space-y-3">
            {commentsQuery.isLoading ? (
               <>
                  <Skeleton className="h-28 w-full rounded-card" />
                  <Skeleton className="h-28 w-full rounded-card" />
               </>
            ) : null}

            {commentsQuery.isError ? (
               <ErrorState
                  compact
                  title="Could not load comments"
                  description={getErrorMessage(commentsQuery.error)}
                  onRetry={() => commentsQuery.refetch()}
               />
            ) : null}

            {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 ? (
               <EmptyState
                  title="No comments yet"
                  description="Start the conversation by writing the first comment."
               />
            ) : null}

            {!commentsQuery.isLoading && !commentsQuery.isError && shouldVirtualize ? (
               <div
                  ref={parentRef}
                  className="max-h-[560px] overflow-auto rounded-card border border-app-border bg-app-bg p-2"
               >
                  <div
                     style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        position: "relative",
                        width: "100%",
                     }}
                  >
                     {virtualRows.map((virtualRow) => {
                        const comment = comments[virtualRow.index];

                        return (
                           <div
                              key={comment._id}
                              style={{
                                 position: "absolute",
                                 top: 0,
                                 left: 0,
                                 width: "100%",
                                 transform: `translateY(${virtualRow.start}px)`,
                              }}
                           >
                              <CommentItem
                                 comment={comment}
                                 canModify={comment?.owner?._id === user?._id}
                                 onLike={() => likeMutation.mutate(comment._id)}
                                 isLiking={likeMutation.isPending}
                                 onDelete={() => deleteMutation.mutate(comment._id)}
                                 onUpdate={(text) =>
                                    updateMutation.mutate({ commentId: comment._id, text })
                                 }
                              />
                           </div>
                        );
                     })}
                  </div>
               </div>
            ) : null}

            {!commentsQuery.isLoading && !commentsQuery.isError && !shouldVirtualize
               ? comments.map((comment) => (
                    <CommentItem
                       key={comment._id}
                       comment={comment}
                       canModify={comment?.owner?._id === user?._id}
                       onLike={() => likeMutation.mutate(comment._id)}
                       isLiking={likeMutation.isPending}
                       onDelete={() => deleteMutation.mutate(comment._id)}
                       onUpdate={(text) =>
                          updateMutation.mutate({ commentId: comment._id, text })
                       }
                    />
                 ))
               : null}
         </div>
      </section>
   );
};

export default CommentSection;
