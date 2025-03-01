import React, { createContext, useState, ReactNode, useEffect } from 'react';

// Define the context shape
export interface OnchainContextType {
  apiKey: string;
  isLoading: boolean;
  setApiKey: (key: string) => void;
  initializeCoinbase: () => boolean;
  createCharge: (params: any) => Promise<any>;
}

// Create context with default values
export const OnchainContext = createContext<OnchainContextType>({
  apiKey: '',
  isLoading: false,
  setApiKey: () => {},
  initializeCoinbase: () => false,
  createCharge: async () => ({}),
});

interface OnchainKitProviderProps {
  children: ReactNode;
  apiKey?: string;
}

const OnchainKitProvider: React.FC<OnchainKitProviderProps> = ({ children, apiKey: initialApiKey }) => {
  // Default API key - in a real app this would come from environment variables
  const defaultApiKey = "organizations/0b8a9fc9-65b5-48af-9b6f-c9f1e169a93e/apiKeys/362f2d6f-a23c-408c-81f6-6de651a04ecc";
  
  // We use a state variable to store the API key
  const [apiKey, setApiKey] = useState<string>(initialApiKey || defaultApiKey || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize Coinbase - this is a mock function for now
  const initializeCoinbase = () => {
    console.log('Initializing Coinbase with API key:', apiKey);
    return true;
  };

  // Create a charge - this is a mock function for now
  const createCharge = async (params: any) => {
    console.log('Creating charge with params:', params);
    setIsLoading(true);
    
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        setIsLoading(false);
        resolve({
          id: 'mock-charge-' + Math.random().toString(36).slice(2, 9),
          status: 'pending',
          paymentUrl: 'https://example.com/pay',
        });
      }, 1500);
    });
  };

  // Provide context values
  const contextValue: OnchainContextType = {
    apiKey,
    isLoading,
    setApiKey,
    initializeCoinbase,
    createCharge,
  };

  return (
    <OnchainContext.Provider value={contextValue}>
      {children}
    </OnchainContext.Provider>
  );
};

export default OnchainKitProvider;
