import { useState } from 'react'
import NoVideo from './Components/NoVideo'
import Layout from './Components/Layout'
import { Route, Routes} from "react-router-dom"
import Register from './Components/Auth/Register'
import Login from './Components/Auth/Login'
function App() {

  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NoVideo />}/>
        </Route>
        <Route path='/register' element={<Register />}/>
        <Route path='/login' element={<Login />}/>
    </Routes>
  )
}

export default App
