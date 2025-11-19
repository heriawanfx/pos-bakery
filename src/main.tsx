import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/globals.css";
import App from './App.tsx'
import { applyTheme, getInitialTheme } from './utils/theme.ts';


// Terapkan theme SEBELUM render
applyTheme(getInitialTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
