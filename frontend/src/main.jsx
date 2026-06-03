import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./Context/AuthContext";
import AppErrorBoundary from "./Components/ui/AppErrorBoundary";
import GlobalNetworkIndicator from "./Components/ui/GlobalNetworkIndicator";

createRoot(document.getElementById("root")).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <BrowserRouter>
            <GlobalNetworkIndicator />
            <AppErrorBoundary>
               <AuthProvider>
                  <App />
                  <Toaster
                     theme="dark"
                     position="top-right"
                     toastOptions={{
                        className:
                           "bg-app-sidebar text-white border border-app-border rounded-card",
                        descriptionClassName: "text-app-text-secondary",
                     }}
                  />
               </AuthProvider>
            </AppErrorBoundary>
         </BrowserRouter>
      </QueryClientProvider>
   </StrictMode>
);

