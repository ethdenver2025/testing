import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const { loginWithWallet, loginWithGoogle } = useAuth();
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleWalletLogin = async () => {
    try {
      await loginWithWallet();
    } catch (error) {
      // Error is already handled by AuthContext
      console.error('Login error:', error);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await loginWithGoogle(response);
      } catch (error) {
        console.error('Google login error:', error);
        toast({
          title: 'Error',
          description: 'Failed to login with Google',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      console.error('Google login error:', error);
      toast({
        title: 'Error',
        description: 'Failed to login with Google',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    },
  });

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
              Connect to get started
            </Text>
          </VStack>

          <VStack spacing={4} w="full">
            <Button
              leftIcon={<Icon as={FcGoogle} />}
              onClick={() => handleGoogleLogin()}
              colorScheme="gray"
              width="full"
              size="lg"
            >
              Sign in with Google
            </Button>

            <Text color="gray.500" fontSize="sm">or</Text>

            <Button
              leftIcon={<Icon as={FaWallet} />}
              onClick={handleWalletLogin}
              colorScheme="green"
              width="full"
              size="lg"
            >
              Connect Wallet
            </Button>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};
