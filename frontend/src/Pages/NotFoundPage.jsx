import { Link } from "react-router-dom";
import Button from "../Components/ui/Button";

const NotFoundPage = () => (
   <main className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="max-w-md rounded-card border border-app-border bg-app-sidebar p-6 text-center">
         <p className="text-5xl font-bold text-white">404</p>
         <p className="mt-2 text-sm text-app-text-secondary">
            The page you requested does not exist.
         </p>
         <Link to="/" className="mt-5 inline-block">
            <Button>Go Home</Button>
         </Link>
      </div>
   </main>
);

export default NotFoundPage;

