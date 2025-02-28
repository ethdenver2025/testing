import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Image
} from '@chakra-ui/react';
import { FaWallet } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, loginWithWallet, loginWithGoogle, handleMockAuth } = useAuth();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Please check your credentials and try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleWalletLogin = async () => {
    try {
      await loginWithWallet();
      toast({
        title: 'Wallet connected successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Could not connect to wallet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // For demo, we just pass a dummy token
      await loginWithGoogle("dummy-google-token");
      toast({
        title: 'Google login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Google login failed',
        description: 'Could not authenticate with Google',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
      <Stack spacing={8}>
        <Stack spacing={6} textAlign="center">
          <Image
            src="/logo.png"
            fallbackSrc="https://via.placeholder.com/150/1a202c/FFFFFF?text=Formicary"
            alt="Formicary Logo"
            mx="auto"
            maxH="80px"
            objectFit="contain"
          />
          <Heading size="xl" fontWeight="extrabold">
            Sign in to your account
          </Heading>
          <Text color="gray.500">
            Connect with your preferred method to access Formicary
          </Text>
        </Stack>

        <Box
          py={{ base: '0', sm: '8' }}
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg-surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing={6}>
            <Stack spacing={4}>
              <Button
                leftIcon={<Icon as={FaWallet} />}
                colorScheme="blue"
                variant="outline"
                onClick={handleWalletLogin}
                isLoading={isLoading}
                size="lg"
                width="100%"
              >
                Connect Wallet
              </Button>
              <Button
                leftIcon={<Icon as={FcGoogle} fontSize="1.5em" />}
                colorScheme="gray"
                variant="outline"
                onClick={handleGoogleLogin}
                isLoading={isLoading}
                size="lg"
                width="100%"
              >
                Sign in with Google
              </Button>

              <HStack spacing={2} justify="center">
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
                  or continue with
                </Text>
                <Divider />
              </HStack>
            </Stack>

            <form onSubmit={handleLogin}>
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" isLoading={isLoading}>
                  Sign in
                </Button>
              </Stack>
            </form>

            <Divider />

            <Button 
              variant="link" 
              colorScheme="blue" 
              leftIcon={<Icon as={FiUser} />}
              onClick={handleMockAuth}
            >
              Use Mock Authentication (for testing)
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
