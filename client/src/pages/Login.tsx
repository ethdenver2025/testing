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
  HStack,
  Divider,
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';

export const Login = () => {
  const { loginWithWallet, loginWithGoogle, handleMockAuth } = useAuth();
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

  const googleLogin = useGoogleLogin({
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

          <VStack spacing={5} w="full" maxW="sm">
            <Button
              onClick={handleWalletLogin}
              w="full"
              colorScheme="blue"
              leftIcon={<Icon as={FaWallet} />}
            >
              Connect Wallet
            </Button>

            <Button
              w="full"
              variant="outline"
              onClick={googleLogin}
              leftIcon={<Icon as={FcGoogle} />}
            >
              Continue with Google
            </Button>

            {process.env.NODE_ENV === 'development' && (
              <>
                <Divider />
                <HStack w="full">
                  <Divider />
                  <Text fontSize="sm" color="gray.500">FOR DEVELOPMENT</Text>
                  <Divider />
                </HStack>
                <Button
                  w="full"
                  colorScheme="green"
                  leftIcon={<Icon as={FiUser} />}
                  onClick={handleMockAuth}
                >
                  Mock Login (Dev Only)
                </Button>
              </>
            )}
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
};
