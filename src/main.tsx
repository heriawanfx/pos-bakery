import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App.tsx';
import { applyTheme, getInitialTheme } from './utils/theme.ts';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary.tsx';

// Terapkan theme SEBELUM render
applyTheme(getInitialTheme());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <GlobalErrorBoundary> */}
      <App />
    {/* </GlobalErrorBoundary> */}
  </StrictMode>
);
