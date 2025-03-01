// Import polyfills first
import './polyfills';

import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import SimpleFallback from './SimpleFallback';
import './index.css';

// Debug logging to help track rendering
console.log('Starting app initialization...');

// Lazy load the main App component to handle any errors gracefully
const App = lazy(() => import('./App'));

// Get the root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element!');
  throw new Error('Failed to find the root element');
} else {
  console.log('Found root element:', rootElement);
}

// Create a root
const root = createRoot(rootElement);
console.log('Created React root');

// Render the app with fallback
root.render(
  <Suspense fallback={<SimpleFallback />}>
    <App />
  </Suspense>
);
console.log('App component rendered with fallback');
