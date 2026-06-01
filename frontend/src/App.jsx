import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import AppLayout from "./Components/layout/AppLayout";
import PageSkeleton from "./Components/ui/PageSkeleton";

const HomePage = lazy(() => import("./Pages/HomePage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const SignupPage = lazy(() => import("./Pages/SignupPage"));
const SearchPage = lazy(() => import("./Pages/SearchPage"));
const WatchPage = lazy(() => import("./Pages/WatchPage"));
const ChannelPage = lazy(() => import("./Pages/ChannelPage"));
const LikedVideosPage = lazy(() => import("./Pages/LikedVideosPage"));
const HistoryPage = lazy(() => import("./Pages/HistoryPage"));
const MyContentPage = lazy(() => import("./Pages/MyContentPage"));
const UploadPage = lazy(() => import("./Pages/UploadPage"));
const CollectionsPage = lazy(() => import("./Pages/CollectionsPage"));
const PlaylistDetailPage = lazy(() => import("./Pages/PlaylistDetailPage"));
const SubscribersPage = lazy(() => import("./Pages/SubscribersPage"));
const TweetsPage = lazy(() => import("./Pages/TweetsPage"));
const SettingsPage = lazy(() => import("./Pages/SettingsPage"));
const SupportPage = lazy(() => import("./Pages/SupportPage"));
const NotFoundPage = lazy(() => import("./Pages/NotFoundPage"));

function App() {
   return (
      <Suspense fallback={<PageSkeleton />}>
         <Routes>
            <Route  element={<PublicRoute />}>
               <Route  path="/login" element={<LoginPage />} />
               <Route path="/signup" element={<SignupPage />} />
               <Route path="/register" element={<Navigate to="/signup" replace />} />
            </Route>

            <Route element={<PrivateRoute />}>
               <Route element={<AppLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/video/:id" element={<WatchPage />} />
                  <Route path="/channel/:username" element={<ChannelPage />} />
                  <Route path="/liked" element={<LikedVideosPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/my-content" element={<MyContentPage />} />
                  <Route path="/my-content/upload" element={<UploadPage />} />
                  <Route path="/collections" element={<CollectionsPage />} />
                  <Route path="/collections/:id" element={<PlaylistDetailPage />} />
                  <Route path="/subscribers" element={<SubscribersPage />} />
                  <Route path="/tweets" element={<TweetsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/support" element={<SupportPage />} />
               </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
         </Routes>
      </Suspense>
   );
}

export default App;
