import { memo, useCallback, useState } from "react";
import { Heart, Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { formatRelativeTime } from "../../lib/format";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../../lib/images";

const CommentItem = ({
   comment,
   canModify,
   onDelete,
   onUpdate,
   onLike,
   isLiking,
}) => {
   const [editing, setEditing] = useState(false);
   const [draft, setDraft] = useState(comment?.content || "");
   const handleCancelEdit = useCallback(() => {
      setEditing(false);
      setDraft(comment?.content || "");
   }, [comment?.content]);

   const handleSave = useCallback(() => {
      onUpdate(draft);
      setEditing(false);
   }, [draft, onUpdate]);

   return (
      <article className="rounded-card border border-app-border bg-app-sidebar p-3">
         <div className="flex gap-3">
            <img
               src={comment?.owner?.avatar || FALLBACK_THUMBNAIL}
               alt={comment?.owner?.username}
               width="36"
               height="36"
               loading="lazy"
               onError={handleThumbnailError}
               className="h-9 w-9 rounded-full border border-app-border object-cover"
            />

            <div className="min-w-0 flex-1">
               <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-white">
                     @{comment?.owner?.username || "user"}
                  </p>
                  <span className="text-xs text-app-text-secondary">
                     {formatRelativeTime(comment?.createdAt)}
                  </span>
               </div>

               {editing ? (
                  <div className="mt-2 space-y-2">
                     <textarea
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        className="min-h-20 w-full rounded-card border border-app-border bg-app-card px-3 py-2 text-sm text-white outline-none focus:border-app-accent"
                     />
                     <div className="flex justify-end gap-2">
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={handleCancelEdit}
                        >
                           Cancel
                        </Button>
                        <Button
                           size="sm"
                           onClick={handleSave}
                           disabled={!draft.trim()}
                        >
                           Save
                        </Button>
                     </div>
                  </div>
               ) : (
                  <p className="mt-2 text-sm text-app-text-primary">{comment?.content}</p>
               )}

               <div className="mt-3 flex items-center gap-2">
                  <button
                     type="button"
                     className="inline-flex min-h-11 items-center gap-1 rounded-pill border border-app-border px-3 text-xs text-app-text-secondary transition hover:bg-app-card hover:text-white"
                     onClick={onLike}
                     disabled={isLiking}
                  >
                     <Heart size={14} />
                     {isLiking ? "Liking..." : "Like"}
                  </button>

                  {canModify ? (
                     <>
                        <button
                           type="button"
                           className="inline-flex min-h-11 items-center gap-1 rounded-pill border border-app-border px-3 text-xs text-app-text-secondary transition hover:bg-app-card hover:text-white"
                           onClick={() => setEditing(true)}
                        >
                           <Pencil size={14} />
                           Edit
                        </button>
                        <button
                           type="button"
                           className="inline-flex min-h-11 items-center gap-1 rounded-pill border border-red-500/40 px-3 text-xs text-red-300 transition hover:bg-red-500/10"
                           onClick={onDelete}
                        >
                           <Trash2 size={14} />
                           Delete
                        </button>
                     </>
                  ) : null}
               </div>
            </div>
         </div>
      </article>
   );
};

export default memo(CommentItem);
