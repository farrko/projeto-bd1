import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { UserModeProvider } from './context/UserModeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserModeProvider>
      <App />
    </UserModeProvider>
  </StrictMode>,
);
