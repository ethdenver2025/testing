import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  useToast,
} from '@chakra-ui/react';
import { Card, Title } from '@tremor/react';
import { useBase } from '../../hooks/useBase';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  yearsOfExperience: number;
}

interface Certification {
  name: string;
  issuer: string;
  dateAchieved: string;
  expiryDate?: string;
  verificationUrl?: string;
}

export const WorkerProfile: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [skillLevel, setSkillLevel] = useState<Skill['level']>('Beginner');
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(0);
  
  const { agent } = useBase();
  const toast = useToast();

  const handleAddSkill = async () => {
    if (!newSkill) return;

    const skill: Skill = {
      name: newSkill,
      level: skillLevel,
      yearsOfExperience,
    };

    try {
      // Validate skill using Base AI Agent
      const validation = await agent.validateSkills([skill], []);
      
      if (validation.data.isValid) {
        setSkills([...skills, skill]);
        setNewSkill('');
        setSkillLevel('Beginner');
        setYearsOfExperience(0);
        
        toast({
          title: 'Skill added',
          description: 'Your skill has been validated and added to your profile',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Validation failed',
          description: validation.data.reason || 'Please check your skill details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to validate skill. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill.name !== skillToRemove));
  };

  return (
    <Card>
      <Title>Profile</Title>
      <VStack spacing={6} align="stretch" mt={4}>
        {/* Skills Section */}
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Skills
          </Text>
          <HStack spacing={4} mb={4}>
            <Input
              placeholder="Add a skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as Skill['level'])}
              style={{ padding: '8px', borderRadius: '4px' }}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            <Input
              type="number"
              placeholder="Years"
              value={yearsOfExperience}
              onChange={(e) => setYearsOfExperience(Number(e.target.value))}
              width="100px"
            />
            <Button onClick={handleAddSkill} colorScheme="blue">
              Add
            </Button>
          </HStack>
          <HStack spacing={2} flexWrap="wrap">
            {skills.map((skill) => (
              <Tag
                key={skill.name}
                size="md"
                borderRadius="full"
                variant="solid"
                colorScheme={
                  skill.level === 'Expert'
                    ? 'green'
                    : skill.level === 'Intermediate'
                    ? 'blue'
                    : 'gray'
                }
              >
                <TagLabel>
                  {skill.name} ({skill.level}, {skill.yearsOfExperience}y)
                </TagLabel>
                <TagCloseButton onClick={() => handleRemoveSkill(skill.name)} />
              </Tag>
            ))}
          </HStack>
        </Box>

        {/* Certifications Section - To be implemented */}
        <Box>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Certifications
          </Text>
          {/* TODO: Add certification management UI */}
        </Box>
      </VStack>
    </Card>
  );
};
