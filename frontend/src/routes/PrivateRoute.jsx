import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { FullPageLoader } from "../Components/ui/Loader";

const PrivateRoute = () => {
   const { isAuthenticated, isBootstrapping } = useAuth();
   const location = useLocation();

   if (isBootstrapping) {
      return <FullPageLoader label="Restoring your session..." />;
   }

   if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
   }

   return <Outlet />;
};

export default PrivateRoute;

