import axios from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [auth, setAuth] = useState(null);

   useEffect(() => {
      axios
         .get("/api/v1/users/check-auth", { withCredentials: true })
         .then(() => setAuth(true))
         .catch(() => setAuth(false));
   }, []);
   return (
      <AuthContext.Provider value={{ auth, setAuth }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
