import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  SimpleGrid,
  Avatar,
  Center,
  IconButton,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  InputGroup,
  InputRightElement,
  Select,
} from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { FiCamera, FiPlus } from 'react-icons/fi';

export const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement profile update logic
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Center mb={8}>
            <Box position="relative">
              <Avatar
                size="2xl"
                name={user?.username}
                bg="green.500"
                color="white"
              />
              <IconButton
                aria-label="Change profile picture"
                icon={<FiCamera />}
                size="sm"
                colorScheme="green"
                position="absolute"
                bottom="0"
                right="0"
                rounded="full"
              />
            </Box>
          </Center>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
            <VStack align="stretch" spacing={6}>
              <FormControl isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input defaultValue={user?.username} placeholder="Enter your full name" />
              </FormControl>

              <FormControl isRequired>
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

              <FormControl>
                <FormLabel>Availability</FormLabel>
                <Select placeholder="Select availability">
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </Select>
              </FormControl>
            </VStack>

            <VStack align="stretch" spacing={6}>
              <FormControl>
                <FormLabel>Skills</FormLabel>
                <InputGroup size="md">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      aria-label="Add skill"
                      icon={<FiPlus />}
                      h="1.75rem"
                      size="sm"
                      onClick={handleAddSkill}
                    />
                  </InputRightElement>
                </InputGroup>
                <Box mt={2}>
                  <HStack spacing={2} wrap="wrap">
                    {skills.map((skill) => (
                      <Tag
                        key={skill}
                        size="md"
                        borderRadius="full"
                        variant="solid"
                        colorScheme="green"
                      >
                        <TagLabel>{skill}</TagLabel>
                        <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
                      </Tag>
                    ))}
                  </HStack>
                </Box>
              </FormControl>

              <FormControl>
                <FormLabel>Experience</FormLabel>
                <Textarea
                  placeholder="Describe your experience"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Equipment</FormLabel>
                <Textarea
                  placeholder="List equipment you own/operate"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Portfolio/Website</FormLabel>
                <Input placeholder="https://" />
              </FormControl>
            </VStack>
          </SimpleGrid>
        </Box>

        <Box>
          <Button
            colorScheme="green"
            size="lg"
            onClick={handleSaveProfile}
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
