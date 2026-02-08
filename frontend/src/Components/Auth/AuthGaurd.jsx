import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";

const AuthGaurd = ({ redirectIfAuth = false }) => {
   const {auth} = useAuth();

   if(auth === null) return null;

   if(!redirectIfAuth && !auth) return <Navigate to="/login" replace/>

   if(redirectIfAuth && auth) return <Navigate to="/" replace/>

   return <Outlet />
};

export default AuthGaurd;
