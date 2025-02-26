import React from 'react';
import { ChakraProvider, Box, Text } from '@chakra-ui/react';
import { WagmiConfig } from 'wagmi';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { theme } from './theme';
import { wagmiConfig } from './config/zkSyncAuth';

const Debug = () => {
  return (
    <WagmiConfig config={wagmiConfig}>
      <ChakraProvider theme={theme}>
        <Router>
          <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
            <Routes>
              <Route path="/" element={
                <Box bg="carbon.900" minH="100vh" display="flex" alignItems="center" justifyContent="center">
                  <Text fontSize="2xl" color="carbon.100">Debug Test with Google Provider</Text>
                </Box>
              } />
            </Routes>
          </GoogleOAuthProvider>
        </Router>
      </ChakraProvider>
    </WagmiConfig>
  );
};

export default Debug;
