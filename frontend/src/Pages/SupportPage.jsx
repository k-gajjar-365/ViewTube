import { useQuery } from "@tanstack/react-query";
import { healthCheck } from "../api/health.api";
import PageHeader from "../Components/page/PageHeader";
import { Skeleton } from "../Components/ui/Skeleton";
import ErrorState from "../Components/ui/ErrorState";
import { getErrorMessage } from "../lib/error";

const SupportPage = () => {
   const healthQuery = useQuery({
      queryKey: ["healthCheck"],
      queryFn: ({ signal }) => healthCheck({ signal }),
   });

   return (
      <section className="space-y-4">
         <PageHeader
            title="Support"
            subtitle="Need help? Check service status and reach out to maintainers."
         />

         <div className="rounded-card border border-app-border bg-app-sidebar p-4">
            <h2 className="text-base font-medium text-white">Backend status</h2>

            {healthQuery.isLoading ? <Skeleton className="mt-3 h-12 w-full rounded-card" /> : null}

            {healthQuery.isError ? (
               <ErrorState
                  compact
                  title="Service appears unavailable"
                  description={getErrorMessage(healthQuery.error)}
                  onRetry={() => healthQuery.refetch()}
               />
            ) : null}

            {!healthQuery.isLoading && !healthQuery.isError ? (
               <p className="mt-3 rounded-card border border-app-border bg-app-card p-3 text-sm text-app-text-secondary">
                  API is reachable and responding.
               </p>
            ) : null}
         </div>

         <div className="rounded-card border border-app-border bg-app-sidebar p-4">
            <h2 className="text-base font-medium text-white">Get help</h2>
            <p className="mt-2 text-sm text-app-text-secondary">
               If something is broken, share the page URL and the action you attempted.
            </p>
         </div>
      </section>
   );
};

export default SupportPage;

