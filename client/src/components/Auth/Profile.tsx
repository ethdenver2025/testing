import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Container,
  Heading,
  Textarea,
  Tag,
  HStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon } from '@chakra-ui/icons';
import { useAuth } from '../../contexts/AuthContext';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Update failed',
        description: err instanceof Error ? err.message : 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  if (!user) {
    return <Text>Please login to view your profile</Text>;
  }

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl">Your Profile</Heading>
          <Text color="gray.600" mt={2}>Wallet Address: {user.walletAddress}</Text>
        </Box>

        <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg="white">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Skills</FormLabel>
                  <Flex wrap="wrap" gap={2} mb={2}>
                    {formData.skills.map((skill) => (
                      <Tag key={skill} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                        {skill}
                        <IconButton
                          size="xs"
                          ml={1}
                          icon={<CloseIcon />}
                          aria-label={`Remove ${skill}`}
                          onClick={() => removeSkill(skill)}
                        />
                      </Tag>
                    ))}
                  </Flex>
                  <HStack>
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Add skill"
                      onClick={addSkill}
                    />
                  </HStack>
                </FormControl>

                <HStack spacing={4} width="100%" justify="flex-end">
                  <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" colorScheme="blue">Save Changes</Button>
                </HStack>
              </VStack>
            </form>
          ) : (
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold">Username</Text>
                <Text>{user.username || 'Not set'}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Bio</Text>
                <Text>{user.profile?.bio || 'No bio provided'}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Skills</Text>
                <Flex wrap="wrap" gap={2}>
                  {user.profile?.skills.map((skill) => (
                    <Tag key={skill} size="md" borderRadius="full">
                      {skill}
                    </Tag>
                  ))}
                </Flex>
              </Box>

              <Button
                onClick={() => setIsEditing(true)}
                colorScheme="blue"
                alignSelf="flex-end"
              >
                Edit Profile
              </Button>
            </VStack>
          )}
        </Box>
      </VStack>
    </Container>
  );
};
