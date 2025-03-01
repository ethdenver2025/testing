import React from 'react';
import { ChakraProvider, Box, Heading, Text, Button, VStack, HStack, Container, Divider, Badge } from '@chakra-ui/react';

const SimpleFallback: React.FC = () => {
  return (
    <ChakraProvider>
      <Container maxW="container.md" py={10}>
        <VStack spacing={8} align="stretch">
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <Heading as="h1" size="xl" mb={4} color="purple.600">Formicary App</Heading>
            <Text fontSize="lg" mb={4}>
              This is a temporary display while we resolve some technical issues with the main application.
            </Text>
            <Divider my={4} />
            <HStack>
              <Badge colorScheme="green">Running</Badge>
              <Badge colorScheme="blue">Chakra UI</Badge>
              <Badge colorScheme="purple">React</Badge>
            </HStack>
          </Box>
          
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
            <Heading as="h2" size="md" mb={4}>Status Update</Heading>
            <Text mb={4}>
              The application is currently being updated to restore all UI components. We're working on fixing 
              compatibility issues with web3 libraries.
            </Text>
            <Button colorScheme="purple" onClick={() => alert('UI Components Working!')}>
              Click Me
            </Button>
          </Box>
        </VStack>
      </Container>
    </ChakraProvider>
  );
};

export default SimpleFallback;
