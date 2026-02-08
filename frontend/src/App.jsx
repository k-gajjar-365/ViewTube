import { useState } from "react";
import NoVideo from "./Components/NoVideo";
import Layout from "./Components/Layout";
import { Route, Routes } from "react-router-dom";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import AuthGaurd from "./Components/Auth/AuthGaurd";

function App() {
   return (
      <Routes>
         <Route element={<AuthGaurd redirectIfAuth={true} />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
         </Route>

         <Route element={<Layout />}>
            <Route element={<AuthGaurd />}>
               <Route path="/" element={<NoVideo />} />
            </Route>
         </Route>
      </Routes>
   );
}

export default App;
