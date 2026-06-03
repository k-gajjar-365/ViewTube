import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSubscribers, getSubscribedChannels } from "../api/user.api";
import { useAuth } from "../Context/AuthContext";
import PageHeader from "../Components/page/PageHeader";
import EmptyState from "../Components/ui/EmptyState";
import ErrorState from "../Components/ui/ErrorState";
import { Skeleton } from "../Components/ui/Skeleton";
import { getErrorMessage } from "../lib/error";
import { FALLBACK_THUMBNAIL, handleThumbnailError } from "../lib/images";

const tabs = ["Subscribers", "Subscribed Channels"];

const SubscribersPage = () => {
   const { user } = useAuth();
   const [activeTab, setActiveTab] = useState("Subscribers");

   const subscribersQuery = useQuery({
      queryKey: ["subscribers", user?._id],
      queryFn: ({ signal }) => getSubscribers(user._id, { signal }),
      enabled: Boolean(user?._id),
   });

   const subscribedChannelsQuery = useQuery({
      queryKey: ["subscribedChannels", user?._id],
      queryFn: ({ signal }) => getSubscribedChannels(user._id, { signal }),
      enabled: Boolean(user?._id),
   });

   const isLoading =
      activeTab === "Subscribers"
         ? subscribersQuery.isLoading
         : subscribedChannelsQuery.isLoading;

   const isError =
      activeTab === "Subscribers"
         ? subscribersQuery.isError
         : subscribedChannelsQuery.isError;

   const error =
      activeTab === "Subscribers"
         ? subscribersQuery.error
         : subscribedChannelsQuery.error;

   const data =
      activeTab === "Subscribers"
         ? subscribersQuery.data || []
         : subscribedChannelsQuery.data || [];

   return (
      <section>
         <PageHeader
            title="Subscribers"
            subtitle="Track who follows you and who you follow."
         />

         <div className="mb-4 border-b border-app-border">
            <div className="flex gap-4">
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

         {isLoading ? (
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
               {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 rounded-card" />
               ))}
            </div>
         ) : null}

         {isError ? (
            <ErrorState
               title="Could not load subscribers"
               description={getErrorMessage(error)}
               onRetry={() =>
                  activeTab === "Subscribers"
                     ? subscribersQuery.refetch()
                     : subscribedChannelsQuery.refetch()
               }
            />
         ) : null}

         {!isLoading && !isError && data.length === 0 ? (
            <EmptyState
               title={`No ${
                  activeTab === "Subscribers" ? "subscribers yet" : "subscriptions yet"
               }`}
               description={
                  activeTab === "Subscribers"
                     ? "Share your content to grow your audience."
                     : "Subscribe to channels to see them listed here."
               }
            />
         ) : null}

         {!isLoading && !isError ? (
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
               {data.map((entry) => (
                  <article
                     key={entry._id}
                     className="flex items-center gap-3 rounded-card border border-app-border bg-app-sidebar p-3"
                  >
                     <img
                        src={entry.avatar || FALLBACK_THUMBNAIL}
                        alt={entry.username}
                        width="44"
                        height="44"
                        loading="lazy"
                        onError={handleThumbnailError}
                        className="h-11 w-11 rounded-full border border-app-border object-cover"
                     />
                     <div>
                        <p className="text-sm font-medium text-white">@{entry.username}</p>
                     </div>
                  </article>
               ))}
            </div>
         ) : null}
      </section>
   );
};

export default SubscribersPage;

