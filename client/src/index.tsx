// Import polyfills first
import './polyfills';

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Debug logging to help track rendering
console.log('Starting app initialization...');

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

// Handle errors during rendering
try {
  console.log('Rendering App component...');
  
  // Render the app
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('App component rendered successfully');
} catch (error) {
  console.error('Error rendering App component:', error);
  
  // Attempt to render a fallback UI if the main app fails
  try {
    console.log('Rendering fallback UI...');
    
    root.render(
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '600px',
        margin: '50px auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#d32f2f' }}>Something went wrong</h1>
        <p>We encountered an error while loading the application.</p>
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Error details</summary>
          <pre style={{ 
            backgroundColor: '#f1f1f1', 
            padding: '10px', 
            borderRadius: '4px',
            overflowX: 'auto' 
          }}>
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        </details>
      </div>
    );
    
    console.log('Fallback UI rendered successfully');
  } catch (fallbackError) {
    console.error('Failed to render fallback UI:', fallbackError);
  }
}
