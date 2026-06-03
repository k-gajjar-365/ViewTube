import { Inbox } from "lucide-react";

const EmptyState = ({
   title = "Nothing here yet",
   description = "There is no data to show right now.",
   action,
}) => (
   <div className="rounded-card border border-app-border bg-app-sidebar p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-app-card text-app-text-secondary">
         <Inbox size={20} />
      </div>
      <p className="text-lg font-medium text-app-text-primary">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-app-text-secondary">
         {description}
      </p>
      {action ? <div className="mt-4">{action}</div> : null}
   </div>
);

export default EmptyState;
