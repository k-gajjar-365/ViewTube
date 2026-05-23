import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, logout as logoutRequest } from "../api/auth.api";
import { queryClient } from "../lib/queryClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [isBootstrapping, setIsBootstrapping] = useState(true);

   const clearSession = useCallback(() => {
      localStorage.removeItem("accessToken");
      setUser(null);
      queryClient.clear();
   }, []);

   const restoreSession = useCallback(async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
         setIsBootstrapping(false);
         return;
      }

      try {
         const authenticatedUser = await getMe();
         setUser(authenticatedUser);
      } catch {
         clearSession();
      } finally {
         setIsBootstrapping(false);
      }
   }, [clearSession]);

   useEffect(() => {
      restoreSession();
   }, [restoreSession]);

   useEffect(() => {
      const handleForcedLogout = () => {
         clearSession();
      };

      window.addEventListener("auth:logout", handleForcedLogout);
      return () => window.removeEventListener("auth:logout", handleForcedLogout);
   }, [clearSession]);

   const saveSession = useCallback((sessionPayload) => {
      const token = sessionPayload?.accessToken;

      if (token) {
         localStorage.setItem("accessToken", token);
      }

      setUser(sessionPayload?.user || null);
   }, []);

   const logout = useCallback(async () => {
      try {
         await logoutRequest();
      } catch {
         // Ignore logout endpoint failures because local cleanup is authoritative.
      } finally {
         clearSession();
      }
   }, [clearSession]);

   const refreshMe = useCallback(async () => {
      const authenticatedUser = await getMe();
      setUser(authenticatedUser);
      return authenticatedUser;
   }, []);

   const value = useMemo(
      () => ({
         user,
         isBootstrapping,
         isAuthenticated: Boolean(user),
         saveSession,
         logout,
         refreshMe,
         clearSession,
      }),
      [clearSession, isBootstrapping, logout, refreshMe, saveSession, user]
   );

   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
   const context = useContext(AuthContext);

   if (!context) {
      throw new Error("useAuth must be used within AuthProvider");
   }

   return context;
};
