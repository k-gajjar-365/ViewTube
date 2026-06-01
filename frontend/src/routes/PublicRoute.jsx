import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FullPageLoader } from "../Components/ui/Loader";

const PublicRoute = () => {
   const { isAuthenticated, isBootstrapping } = useAuth();

   if (isBootstrapping) {
      return <FullPageLoader label="Checking your account..." />;
   }

   if (isAuthenticated) {
      return <Navigate to="/" replace />;
   }

   return <Outlet />;
};

export default PublicRoute;

