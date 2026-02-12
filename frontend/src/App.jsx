import { useState } from "react";
import Layout from './Layout/Layout'
import { Route, Routes } from "react-router-dom";

import Register from './Pages/Register'
import Login from './Pages/Login'
import AuthGaurd from './Auth/AuthGaurd'
import VideoList from './Pages/VideoList'

function App() {
   return (
      <Routes>
         <Route element={<AuthGaurd redirectIfAuth={true} />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
         </Route>

         <Route element={<Layout />}>
            <Route element={<AuthGaurd />}>
               <Route path="/" element={<VideoList />} />
            </Route>
         </Route>
      </Routes>
   );
}

export default App;
