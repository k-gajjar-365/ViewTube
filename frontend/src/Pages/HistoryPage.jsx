import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clearHistory, getHistory } from "../api/history.api";
import PageHeader from "../Components/page/PageHeader";
import VideoListItem from "../Components/video/VideoListItem";
import Button from "../Components/ui/Button";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { ListItemSkeleton } from "../Components/ui/Skeleton";
import { getErrorMessage } from "../lib/error";

const HistoryPage = () => {
   const queryClient = useQueryClient();
   const historyQuery = useQuery({
      queryKey: ["watchHistory"],
      queryFn: ({ signal }) => getHistory({ signal }),
   });

   const clearMutation = useMutation({
      mutationFn: clearHistory,
      onSuccess: () => {
         queryClient.setQueryData(["watchHistory"], []);
         toast.success("History cleared");
      },
      onError: (error) => {
         if (error?.response?.status === 404 || error?.response?.status === 405) {
            queryClient.setQueryData(["watchHistory"], []);
            toast.success("History cleared locally");
            return;
         }
         toast.error(getErrorMessage(error));
      },
   });

   const historyItems = historyQuery.data || [];

   return (
      <section>
         <PageHeader
            title="History"
            subtitle="Videos you have watched recently."
            action={
               <Button
                  variant="ghost"
                  onClick={() => clearMutation.mutate()}
                  loading={clearMutation.isPending}
               >
                  Clear History
               </Button>
            }
         />

         {historyQuery.isLoading ? (
            <div className="space-y-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <ListItemSkeleton key={index} />
               ))}
            </div>
         ) : null}

         {historyQuery.isError ? (
            <ErrorState
               title="Could not load history"
               description={getErrorMessage(historyQuery.error)}
               onRetry={() => historyQuery.refetch()}
            />
         ) : null}

         {!historyQuery.isLoading && !historyQuery.isError && historyItems.length === 0 ? (
            <EmptyState
               title="History is empty"
               description="Watch a few videos and they will appear here."
            />
         ) : null}

         {!historyQuery.isLoading && !historyQuery.isError ? (
            <div className="space-y-3">
               {historyItems.map((video) => (
                  <VideoListItem key={video._id} video={video} />
               ))}
            </div>
         ) : null}
      </section>
   );
};

export default HistoryPage;

