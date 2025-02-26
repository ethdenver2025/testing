import React from 'react';
import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Textarea, SimpleGrid } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Profile</Heading>
          <Text color="gray.500">Manage your production crew profile</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input defaultValue={user?.username} placeholder="Enter your full name" />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your email" />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input type="tel" placeholder="Enter your phone number" />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input placeholder="City, State" />
            </FormControl>
          </VStack>

          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel>Skills</FormLabel>
              <Textarea placeholder="List your production skills" rows={3} />
            </FormControl>

            <FormControl>
              <FormLabel>Experience</FormLabel>
              <Textarea placeholder="Describe your experience" rows={3} />
            </FormControl>

            <FormControl>
              <FormLabel>Equipment</FormLabel>
              <Textarea placeholder="List equipment you own/operate" rows={3} />
            </FormControl>
          </VStack>
        </SimpleGrid>

        <Box>
          <Button colorScheme="green" size="lg">
            Save Changes
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
