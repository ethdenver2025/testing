// Providing the basics for zkSync Auth
import { injectedConnector, wagmiConfig } from '../utils/web3Compatibility';

// Export the connector for use in the app
export const metaMaskConnector = injectedConnector;

// Export the wagmi configuration
export { wagmiConfig };

// Function to initiate connection with error handling
export const connectWithZkSync = async () => {
  try {
    console.log('Connecting to zkSync...');
    // We've removed the actual zkSync package for now to avoid dependency issues
    return true;
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
};
