import React from 'react';
import { Box, Container, Heading, Text, VStack, FormControl, FormLabel, Input, Button, Textarea, SimpleGrid } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Organization Profile</Heading>
          <Text color="gray.500">Manage your organization details</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel>Organization Name</FormLabel>
              <Input defaultValue={user?.username} placeholder="Enter organization name" />
            </FormControl>

            <FormControl>
              <FormLabel>Contact Email</FormLabel>
              <Input type="email" placeholder="Enter contact email" />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input type="tel" placeholder="Enter contact phone" />
            </FormControl>

            <FormControl>
              <FormLabel>Location</FormLabel>
              <Input placeholder="City, State" />
            </FormControl>
          </VStack>

          <VStack align="stretch" spacing={6}>
            <FormControl>
              <FormLabel>Organization Description</FormLabel>
              <Textarea placeholder="Describe your organization" rows={3} />
            </FormControl>

            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input type="url" placeholder="https://..." />
            </FormControl>

            <FormControl>
              <FormLabel>Social Media</FormLabel>
              <Input placeholder="Twitter/X handle" mb={2} />
              <Input placeholder="LinkedIn URL" />
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
