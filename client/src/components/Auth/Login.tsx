import React from 'react';
import {
  Box,
  Button,
  VStack,
  Text,
  Container,
  Heading,
  useToast,
  Icon,
  Link,
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useZkSyncAuth } from '../../hooks/useZkSyncAuth';

export const Login: React.FC = () => {
  const { loginWithGoogle, loginWithZkSync, isLoading, user } = useAuth();
  const { connect: connectWallet } = useZkSyncAuth();
  const toast = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user?.isProfileComplete) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleWalletConnect = async () => {
    try {
      await loginWithZkSync();
    } catch (error) {
      if (error instanceof Error && error.message.includes('MetaMask is not installed')) {
        toast({
          title: 'MetaMask Required',
          description: (
            <Text>
              Please install MetaMask to continue.{' '}
              <Link href="https://metamask.io/download/" isExternal color="blue.400">
                Download here
              </Link>
            </Text>
          ),
          status: 'warning',
          duration: 10000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Connection Failed',
          description: error instanceof Error ? error.message : 'Failed to connect wallet',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await loginWithGoogle(response);
      } catch (error) {
        toast({
          title: 'Login Failed',
          description: 'Failed to login with Google. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      toast({
        title: 'Google Login Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="carbon.900"
    >
      <Container maxW="container.sm">
        <Box bg="carbon.800" p={8} borderRadius="lg" w="full">
          <VStack spacing={6}>
            <Heading color="carbon.100" size="lg">Welcome to Formicary</Heading>
            
            <Text color="carbon.100" fontSize="md" textAlign="center">
              Sign in to continue
            </Text>

            <VStack spacing={4} width="full">
              <Button
                w="full"
                size="lg"
                onClick={() => handleGoogleLogin()}
                leftIcon={<Icon as={FcGoogle} />}
                colorScheme="gray"
                variant="solid"
                isLoading={isLoading}
                loadingText="Connecting..."
              >
                Sign in with Google
              </Button>

              <Button
                w="full"
                size="lg"
                onClick={handleWalletConnect}
                leftIcon={<Icon as={FaWallet} />}
                colorScheme="blue"
                isLoading={isLoading}
                loadingText="Connecting..."
              >
                Connect Wallet
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};
