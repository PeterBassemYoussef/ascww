import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import { RootErrorBoundary } from './components/RootErrorBoundary';
import './input.css';
import '../css/main.css';
import './responsive-overrides.css';

const routerMode = String(import.meta.env.VITE_ROUTER_MODE || 'browser').toLowerCase();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootErrorBoundary>
      <HelmetProvider>
        {routerMode === 'hash' ? (
          <HashRouter>
            <App />
          </HashRouter>
        ) : (
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <App />
          </BrowserRouter>
        )}
      </HelmetProvider>
    </RootErrorBoundary>
  </React.StrictMode>
);

