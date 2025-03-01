import React from 'react';

// A super simple component with no dependencies or context requirements
const SimpleTest: React.FC = () => {
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: 'white', 
      margin: '40px auto',
      maxWidth: '600px',
      borderRadius: '8px', 
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center'
    }}>
      <h1 style={{ 
        color: '#2979FF', 
        fontSize: '32px',
        marginBottom: '20px'
      }}>
        Simple Test Component
      </h1>
      <p style={{ 
        fontSize: '18px',
        lineHeight: '1.6',
        marginBottom: '20px'
      }}>
        This is a simple test component with no dependencies to verify if basic React rendering is working.
      </p>
      <button 
        style={{ 
          backgroundColor: '#2979FF', 
          color: 'white', 
          padding: '12px 24px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
};

export default SimpleTest;
