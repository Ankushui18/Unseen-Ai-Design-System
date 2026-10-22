import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Apply the persisted theme before the first paint to avoid a flash.
try {
  const stored = window.localStorage.getItem('unseen-ds-theme');
  document.documentElement.classList.toggle('dark', stored === 'dark');
} catch {
  /* storage unavailable — fall back to light */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
