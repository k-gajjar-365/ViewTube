import { useState } from 'react'
import NoVideo from './Components/NoVideo'
import Layout from './Components/Layout'
import { Route, Routes} from "react-router-dom"
function App() {

  return (
    <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<NoVideo />}/>
        </Route>
    </Routes>
  )
}

export default App
