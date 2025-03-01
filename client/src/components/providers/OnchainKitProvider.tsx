import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { custom, createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import { useConfig } from 'wagmi';

// Define the context shape
export interface OnchainContextType {
  apiKey: string;
  isLoading: boolean;
  walletClient: any;
  setApiKey: (key: string) => void;
  initializeCoinbase: () => boolean;
  createCharge: (params: any) => Promise<any>;
}

// Create context with default values
export const OnchainContext = createContext<OnchainContextType>({
  apiKey: '',
  isLoading: false,
  walletClient: null,
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
  
  // We use state variables to store the API key and wallet client
  const [apiKey, setApiKey] = useState<string>(initialApiKey || defaultApiKey || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [walletClient, setWalletClient] = useState<any>(null);

  // Initialize wallet client and Coinbase integration on mount
  useEffect(() => {
    const initWallet = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          // Create a wallet client using viem
          const client = createWalletClient({
            chain: mainnet,
            transport: custom(window.ethereum)
          });
          
          setWalletClient(client);
          console.log('Wallet client initialized');
          
          // Initialize Coinbase if we have an API key
          if (apiKey) {
            console.log('Initializing Coinbase with API key');
            initializeCoinbase();
          }
        } catch (error) {
          console.error('Error initializing wallet client:', error);
        }
      }
    };
    
    initWallet();
  }, [apiKey]);

  // Initialize Coinbase - this is a mock function for now
  const initializeCoinbase = () => {
    console.log('Initializing Coinbase with API key:', apiKey);
    // Additional Coinbase initialization logic would go here
    return true;
  };

  // Create a charge - this actually interacts with blockchain
  const createCharge = async (params: any) => {
    console.log('Creating charge with params:', params);
    setIsLoading(true);
    
    try {
      if (!walletClient) {
        throw new Error('Wallet client not initialized');
      }
      
      // Format the amount as wei
      const amount = (parseFloat(params.amount) * 1e18).toString();
      
      // Get the address (could be passed in or retrieved from the wallet)
      let fromAddress = params.from;
      if (!fromAddress) {
        const [address] = await walletClient.getAddresses();
        fromAddress = address;
      }
      
      // Create the transaction request
      const txRequest = {
        to: params.to || '0xd8da6bf26964af9d7eed9e03e53415d37aa96045', // Vitalik's address as default
        value: BigInt(amount),
        from: fromAddress
      };
      
      console.log('Sending transaction:', txRequest);
      
      // Send the transaction
      const txHash = await walletClient.sendTransaction(txRequest);
      
      setIsLoading(false);
      
      // Return the transaction data in a format similar to Coinbase
      return {
        id: txHash,
        status: 'pending',
        pricing: {
          local: {
            amount: params.amount || '0.01',
            currency: 'ETH'
          }
        },
        hosted_url: `https://etherscan.io/tx/${txHash}`,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 3600000).toISOString(),
        transaction_hash: txHash
      };
    } catch (error) {
      console.error('Error creating charge:', error);
      setIsLoading(false);
      throw error;
    }
  };

  // Better method to pass/receive API key changes
  const updateApiKey = (key: string) => {
    console.log('Updating API key:', key);
    setApiKey(key);
  };

  return (
    <OnchainContext.Provider value={{ 
      apiKey, 
      isLoading,
      walletClient,
      setApiKey: updateApiKey, 
      initializeCoinbase, 
      createCharge 
    }}>
      {children}
    </OnchainContext.Provider>
  );
};

export default OnchainKitProvider;
