import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept and cleanly handle any browser-level decompression stream errors
window.addEventListener('unhandledrejection', (event) => {
  const msg = String(event.reason?.message || event.reason || '');
  if (
    msg.includes('compressed data was not valid') ||
    msg.includes('incorrect header check') ||
    msg.includes('invalid block type') ||
    msg.includes('too many length or distance symbols') ||
    msg.includes('invalid stored block lengths')
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
