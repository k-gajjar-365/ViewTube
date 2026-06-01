const StatCard = ({ label, value }) => (
   <div className="rounded-card border border-app-border bg-app-sidebar p-4">
      <p className="text-xs uppercase tracking-wide text-app-text-secondary">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
   </div>
);

export default StatCard;
