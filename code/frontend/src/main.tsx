import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UserModeProvider } from './context/UserModeContext.tsx'
import { BrowserRouter } from 'react-router'
import '@carbon/styles/css/styles.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserModeProvider>
        <App />
      </UserModeProvider>
    </BrowserRouter>
  </StrictMode>,
);