import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PopUpProvider } from './PopUp/PopUpContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopUpProvider>
      <App />
    </PopUpProvider>
  </StrictMode>,
)

