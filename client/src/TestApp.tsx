import React from 'react';
import { ChakraProvider, Box, VStack, Text, Container, Card, CardBody, Divider, useColorModeValue } from '@chakra-ui/react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './config/zkSyncAuth';
import { ZkSyncAuthButton } from './components/ZkSyncAuthButton';
import { theme } from './theme';

const TestApp = () => {
  const cardBg = useColorModeValue('carbon.800', 'carbon.800');
  const borderColor = useColorModeValue('carbon.700', 'carbon.700');
  const textColor = useColorModeValue('carbon.100', 'carbon.100');

  return (
    <WagmiConfig config={wagmiConfig}>
      <ChakraProvider theme={theme}>
        <Box 
          bg="carbon.900" 
          minH="100vh" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          color="white"
          fontSize="16px"
        >
          <Container maxW="container.sm">
            <Card 
              bg={cardBg} 
              shadow="xl" 
              borderRadius="xl" 
              borderColor={borderColor} 
              borderWidth={1}
              color="white"
            >
              <CardBody>
                <VStack spacing={6} align="center" p={4}>
                  <Text fontSize="2xl" fontWeight="bold" color={textColor}>Welcome to the Formicary</Text>
                  <Text color={textColor}>Sign in to continue</Text>
                  <Divider borderColor={borderColor} />
                  <ZkSyncAuthButton />
                </VStack>
              </CardBody>
            </Card>
          </Container>
        </Box>
      </ChakraProvider>
    </WagmiConfig>
  );
};

export default TestApp;
