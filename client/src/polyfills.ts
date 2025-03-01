// Polyfills for web3 and browser compatibility

// For ethers library
if (typeof window !== 'undefined') {
  // Add required globals
  window.global = window;
  
  // Buffer polyfill
  window.Buffer = window.Buffer || require('buffer').Buffer;
  
  // Process polyfill for web3 libraries
  window.process = window.process || {
    env: { NODE_ENV: process.env.NODE_ENV },
    version: '',
    nextTick: (fn: Function) => setTimeout(fn, 0)
  };
}

// This fixes some compatibility issues between modules
if (typeof global !== 'undefined') {
  // @ts-ignore
  global.Buffer = global.Buffer || require('buffer').Buffer;
}
