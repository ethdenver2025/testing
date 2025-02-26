import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleWalletLogin = async () => {
    try {
      await login();
    } catch (error) {
      // Error is already handled by AuthContext
      console.error('Login error:', error);
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Box
        py={{ base: '8', sm: '12' }}
        px={{ base: '4', sm: '10' }}
        bg={bgColor}
        boxShadow={{ base: 'none', sm: 'md' }}
        borderRadius={{ base: 'none', sm: 'xl' }}
        borderWidth={{ base: '0', sm: '1px' }}
        borderColor={borderColor}
      >
        <VStack spacing="8">
          <VStack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading size={{ base: 'xs', md: 'sm' }}>
              Welcome to Formicary
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.500">
              Connect your wallet to get started
            </Text>
          </VStack>
          <Button
            leftIcon={<FiLock />}
            onClick={handleWalletLogin}
            colorScheme="green"
            width="full"
            size="lg"
          >
            Connect Wallet
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};
