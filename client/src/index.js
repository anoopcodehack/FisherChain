import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Web3Provider } from './contexts/Web3Context';
import reportWebVitals from './reportWebVitals';

// Intercept noisy chrome extension crashes (MetaMask inpage.js, etc.) during capture phase
if (typeof window !== 'undefined') {
  const isExtensionError = (msg, file) => {
    const text = String(msg || '');
    const filename = String(file || '');
    return (
      filename.includes('chrome-extension://') ||
      filename.includes('inpage.js') ||
      text.includes('MetaMask') ||
      text.includes('Failed to connect to MetaMask')
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionError(event.message, event.filename)) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    },
    true // capture phase
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const reasonMsg = event.reason?.message || String(event.reason || '');
      const reasonStack = event.reason?.stack || '';
      if (isExtensionError(reasonMsg, reasonStack)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true // capture phase
  );

  // Auto-remove any CRA error overlay iframes in development
  const observer = new MutationObserver(() => {
    const overlays = document.querySelectorAll('iframe');
    overlays.forEach((frame) => {
      if (
        frame.id === 'webpack-dev-server-client-overlay' ||
        frame.style.position === 'fixed'
      ) {
        frame.style.display = 'none';
        frame.style.pointerEvents = 'none';
      }
    });
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);

reportWebVitals();
