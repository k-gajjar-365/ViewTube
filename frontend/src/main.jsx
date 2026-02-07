import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from "sonner"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    <Toaster
  theme="dark"
  richColors={false}
  position="top-right"
  toastOptions={{
    className:
      "bg-[#141414] text-white border border-[#2a2a2a] shadow-2xl rounded-xl backdrop-blur-md",
    descriptionClassName: "text-zinc-400",
    actionButtonClassName:
      "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]",
    cancelButtonClassName:
      "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]",
  }}
/>
    </BrowserRouter>
  </StrictMode>,
)
