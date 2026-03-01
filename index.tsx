
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { trackEvent } from './lib/analytics';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Fire once when the JS bundle loads — marks the start of every session.
trackEvent('app_init');
trackEvent('session_start_custom');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
