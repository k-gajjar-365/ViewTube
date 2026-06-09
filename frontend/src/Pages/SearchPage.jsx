import { useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { getVideos } from "../api/video.api";
import { useDebounce } from "../hooks/useDebounce";
import PageHeader from "../Components/page/PageHeader";
import VideoListItem from "../Components/video/VideoListItem";
import { ListItemSkeleton } from "../Components/ui/Skeleton";
import ErrorState from "../Components/ui/ErrorState";
import EmptyState from "../Components/ui/EmptyState";
import { getErrorMessage } from "../lib/error";

const SearchPage = () => {
   const [searchParams] = useSearchParams();
   const parentRef = useRef(null);
   const query = useMemo(() => searchParams.get("q") || "", [searchParams]);
   const debouncedQuery = useDebounce(query, 300);

   const searchQuery = useInfiniteQuery({
      queryKey: ["videos", "search", debouncedQuery],
      queryFn: ({ pageParam = 1, signal }) =>
         getVideos({
            page: pageParam,
            limit: 12,
            query: debouncedQuery,
            sortBy: "createdAt",
            sortType: "desc",
            signal,
         }),
      getNextPageParam: (lastPage) => (lastPage?.hasNextPage ? lastPage.page + 1 : undefined),
      initialPageParam: 1,
      enabled: Boolean(debouncedQuery.trim()),
   });

   const videos = useMemo(
      () => searchQuery.data?.pages.flatMap((page) => page.docs) || [],
      [searchQuery.data?.pages]
   );

   const shouldVirtualize = videos.length > 50;
   const virtualizer = useVirtualizer({
      count: shouldVirtualize ? videos.length : 0,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 132,
      overscan: 8,
   });
   const virtualRows = virtualizer.getVirtualItems();

   const handleLoadMore = useCallback(() => {
      searchQuery.fetchNextPage();
   }, [searchQuery]);

   return (
      <section>
         <PageHeader
            title="Search Results"
            subtitle={
               query.trim()
                  ? `Showing results for "${query}"`
                  : "Type something in search to find videos."
            }
         />

         {!query.trim() ? (
            <EmptyState
               title="Start searching"
               description="Use the search bar above to find channels and videos."
            />
         ) : null}

         {searchQuery.isLoading ? (
            <div className="space-y-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <ListItemSkeleton key={index} />
               ))}
            </div>
         ) : null}

         {searchQuery.isError ? (
            <ErrorState
               title="Search failed"
               description={getErrorMessage(searchQuery.error)}
               onRetry={() => searchQuery.refetch()}
            />
         ) : null}

         {!searchQuery.isLoading && !searchQuery.isError && query.trim() && videos.length === 0 ? (
            <EmptyState
               title="No matching videos"
               description="Try a different keyword or shorter phrase."
            />
         ) : null}

         {!searchQuery.isLoading && !searchQuery.isError && query.trim() && shouldVirtualize ? (
            <div
               ref={parentRef}
               className="max-h-[640px] overflow-auto rounded-card border border-app-border bg-app-sidebar p-2"
            >
               <div
                  style={{
                     height: `${virtualizer.getTotalSize()}px`,
                     position: "relative",
                     width: "100%",
                  }}
               >
                  {virtualRows.map((row) => {
                     const video = videos[row.index];

                     return (
                        <div
                           key={video._id}
                           style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              transform: `translateY(${row.start}px)`,
                           }}
                        >
                           <VideoListItem video={video} />
                        </div>
                     );
                  })}
               </div>
            </div>
         ) : null}

         {!searchQuery.isLoading && !searchQuery.isError && query.trim() && !shouldVirtualize ? (
            <div className="space-y-3">
               {videos.map((video) => (
                  <VideoListItem key={video._id} video={video} />
               ))}
            </div>
         ) : null}

         {!searchQuery.isLoading &&
         !searchQuery.isError &&
         query.trim() &&
         videos.length > 0 &&
         searchQuery.hasNextPage ? (
            <div className="mt-4 flex justify-center">
               <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={searchQuery.isFetchingNextPage}
                  className="min-h-11 rounded-pill border border-app-border bg-app-sidebar px-5 text-sm font-medium text-white transition hover:bg-app-card disabled:cursor-not-allowed disabled:opacity-60"
               >
                  {searchQuery.isFetchingNextPage ? "Loading..." : "Load More"}
               </button>
            </div>
         ) : null}
      </section>
   );
};

export default SearchPage;
