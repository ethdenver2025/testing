import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Container,
  Heading,
  Text,
  useToast,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileSetup = () => {
  const { user, updateUserProfile } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setUsernameError('');

    try {
      // Validate username format
      if (username.length < 3) {
        setUsernameError('Username must be at least 3 characters long');
        setIsLoading(false);
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        setUsernameError('Username can only contain letters, numbers, underscores, and hyphens');
        setIsLoading(false);
        return;
      }

      // Update profile
      await updateUserProfile({
        username,
        bio,
        isProfileComplete: true
      });

      toast({
        title: 'Profile Created',
        description: 'Welcome to Formicary!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="carbon.900"
      p={4}
    >
      <Container maxW="container.sm">
        <Box bg="carbon.800" p={8} borderRadius="lg" w="full">
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading color="carbon.100" size="lg">Complete Your Profile</Heading>
            
            <Text color="carbon.100" fontSize="md" textAlign="center">
              {user.authMethod === 'wallet' 
                ? `Connected with: ${user.address?.slice(0, 6)}...${user.address?.slice(-4)}`
                : `Signed in as: ${user.email}`
              }
            </Text>

            <FormControl isInvalid={!!usernameError} isRequired>
              <FormLabel color="carbon.100">Username</FormLabel>
              <Input
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="carbon.700"
                color="carbon.100"
                _placeholder={{ color: 'carbon.400' }}
                borderColor="carbon.600"
                _hover={{ borderColor: 'carbon.500' }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
              <FormErrorMessage>{usernameError}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="carbon.100">Bio</FormLabel>
              <Textarea
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                bg="carbon.700"
                color="carbon.100"
                _placeholder={{ color: 'carbon.400' }}
                borderColor="carbon.600"
                _hover={{ borderColor: 'carbon.500' }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'none' }}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Creating Profile..."
            >
              Create Profile
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};
