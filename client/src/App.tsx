import React from 'react';
import { ChakraProvider, extendTheme, CSSReset } from '@chakra-ui/react';
import { WorkerDashboard } from './components/WorkerDashboard/WorkerDashboard';
import { WalletProvider } from './contexts/WalletContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { MetaDashboard } from './components/MetaDashboard/MetaDashboard';

// Extend the theme to include custom colors, fonts, etc
const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true,
  },
  colors: {
    brand: {
      50: '#E6F6FF',
      100: '#BAE3FF',
      200: '#7CC4FA',
      300: '#47A3F3',
      400: '#2186EB',
      500: '#0967D2',
      600: '#0552B5',
      700: '#03449E',
      800: '#01337D',
      900: '#002159',
    },
  },
});

const mockWorker = {
  name: 'John Doe',
  reputationScore: 4.8,
  skillTier: 'Expert',
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <WalletProvider>
        <DashboardProvider>
          <MetaDashboard />
        </DashboardProvider>
      </WalletProvider>
    </ChakraProvider>
  );
};

export default App;
