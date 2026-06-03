import { useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getVideos } from "../api/video.api";
import CategoryChips from "../Components/video/CategoryChips";
import VideoGrid from "../Components/video/VideoGrid";
import ErrorState from "../Components/ui/ErrorState";
import PageHeader from "../Components/page/PageHeader";
import { getErrorMessage } from "../lib/error";
import { useDebounce } from "../hooks/useDebounce";

const categories = [
   "All",
   "JavaScript",
   "React",
   "Node.js",
   "Python",
   "CSS",
   "MongoDB",
   "Express",
   "Web Dev",
];

const HomePage = () => {
   const [activeCategory, setActiveCategory] = useState("All");
   const debouncedCategory = useDebounce(activeCategory, 300);

   const videosQuery = useInfiniteQuery({
      queryKey: ["videos", "home", debouncedCategory],
      queryFn: ({ pageParam = 1, signal }) =>
         getVideos({
            page: pageParam,
            limit: 12,
            query: debouncedCategory === "All" ? "" : debouncedCategory,
            sortBy: "createdAt",
            sortType: "desc",
            signal,
         }),
      getNextPageParam: (lastPage) => (lastPage?.hasNextPage ? lastPage.page + 1 : undefined),
      initialPageParam: 1,
   });

   const videos = useMemo(
      () => videosQuery.data?.pages.flatMap((page) => page.docs) || [],
      [videosQuery.data?.pages]
   );

   const handleCategoryChange = useCallback((category) => {
      setActiveCategory(category);
   }, []);

   const handleLoadMore = useCallback(() => {
      videosQuery.fetchNextPage();
   }, [videosQuery]);

   return (
      <section>
         <PageHeader
            title="Home"
            subtitle="Discover the newest videos from your feed."
         />

         <CategoryChips
            categories={categories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
         />

         <VideoGrid
            videos={videos}
            isLoading={videosQuery.isLoading}
            isError={videosQuery.isError}
            errorContent={
               <ErrorState
                  title="Unable to load videos"
                  description={getErrorMessage(videosQuery.error)}
                  onRetry={() => videosQuery.refetch()}
               />
            }
            emptyTitle="No videos found"
            emptyDescription="Try selecting another category or upload your own content."
            showLoadMore
            onLoadMore={handleLoadMore}
            isFetchingMore={videosQuery.isFetchingNextPage}
            hasNextPage={Boolean(videosQuery.hasNextPage)}
         />
      </section>
   );
};

export default HomePage;
