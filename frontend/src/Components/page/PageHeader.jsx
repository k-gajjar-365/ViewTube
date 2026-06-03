const PageHeader = ({ title, subtitle, action }) => (
   <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
         <h1 className="text-2xl font-semibold text-white">{title}</h1>
         {subtitle ? <p className="mt-1 text-sm text-app-text-secondary">{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
   </div>
);

export default PageHeader;
