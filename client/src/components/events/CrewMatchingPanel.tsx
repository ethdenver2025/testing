import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Badge,
  Avatar,
  Divider,
  Spinner,
  Tag,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Icon,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormControl,
  FormLabel,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { 
  FaPlus, 
  FaTimes, 
  FaSearch, 
  FaUserPlus, 
  FaShieldAlt, 
  FaStar,
  FaChevronRight
} from 'react-icons/fa';
import TrustBadge from '../crew/TrustBadge';
import { attestationService } from '../../services/attestationService';

interface CrewMember {
  id: string;
  username: string;
  trustScore: number | null;
  skills: string[];
  topSkill?: {
    name: string;
    rating: number;
  };
  attestationCount: number;
}

interface CrewMatchingPanelProps {
  onCrewSelected?: (crewMember: CrewMember, role: string) => void;
  existingRoles?: Array<{
    role: string;
    crewMemberId?: string;
  }>;
}

const CrewMatchingPanel: React.FC<CrewMatchingPanelProps> = ({ 
  onCrewSelected,
  existingRoles = []
}) => {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState('');
  const [minTrustScore, setMinTrustScore] = useState(70);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedCrew, setMatchedCrew] = useState<CrewMember[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const toast = useToast();
  
  const { 
    isOpen: isCrewModalOpen, 
    onOpen: onCrewModalOpen, 
    onClose: onCrewModalClose 
  } = useDisclosure();

  // Function to find crew members with matching skills
  const findMatchingCrew = async () => {
    if (skills.length === 0) {
      toast({
        title: 'No skills specified',
        description: 'Please add at least one skill to search for crew members',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSearching(true);
    try {
      const result = await attestationService.findCrewForPosition(skills, minTrustScore);
      setMatchedCrew(result);
    } catch (error) {
      console.error('Error finding crew:', error);
      // Using mock data for demo purposes
      setMatchedCrew([
        {
          id: '1',
          username: 'Jane Doe',
          trustScore: 92,
          skills: ['Camera Operation', 'Lighting', 'Video Editing'],
          topSkill: { name: 'Camera Operation', rating: 4.8 },
          attestationCount: 15
        },
        {
          id: '2',
          username: 'John Smith',
          trustScore: 88,
          skills: ['Sound Design', 'Boom Operation', 'Mixing'],
          topSkill: { name: 'Boom Operation', rating: 4.5 },
          attestationCount: 12
        },
        {
          id: '3',
          username: 'Alex Johnson',
          trustScore: 85,
          skills: ['Camera Operation', 'Lighting', 'Set Photography'],
          topSkill: { name: 'Lighting', rating: 4.3 },
          attestationCount: 10
        },
      ]);
      
      toast({
        title: 'Using sample data',
        description: 'Connected to sample database for demonstration',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  const openCrewSelectionForRole = (role: string) => {
    setSelectedRole(role);
    onCrewModalOpen();
  };

  const selectCrewForRole = (crewMember: CrewMember) => {
    if (onCrewSelected) {
      onCrewSelected(crewMember, selectedRole);
    }
    onCrewModalClose();
  };

  // Check if a role has been assigned
  const isRoleAssigned = (roleName: string) => {
    return existingRoles.find(r => r.role === roleName)?.crewMemberId !== undefined;
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>Find Qualified Crew Members</Heading>
          <Text fontSize="sm" color="gray.400">
            Specify the skills you need and we'll find trusted crew members with verified experience
          </Text>
        </Box>

        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Required Skills</FormLabel>
            <HStack spacing={2} mb={2} flexWrap="wrap">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  colorScheme="blue"
                  px={2}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                >
                  {skill}
                  <Icon
                    as={FaTimes}
                    ml={1}
                    cursor="pointer"
                    onClick={() => removeSkill(skill)}
                  />
                </Badge>
              ))}
            </HStack>
            <InputGroup>
              <Input
                placeholder="Add skill (e.g. Camera Operation)"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleKeyDown}
                bg="gray.700"
                border="none"
              />
              <InputRightElement width="4.5rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  colorScheme="blue"
                  onClick={addSkill}
                >
                  <Icon as={FaPlus} />
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl>
            <FormLabel>
              Minimum Trust Score: {minTrustScore}%
              <Tooltip 
                label="Higher trust scores indicate crew members with more verified skills and positive attestations"
                placement="top"
              >
                <Icon as={FaShieldAlt} ml={2} color="blue.400" />
              </Tooltip>
            </FormLabel>
            <Slider
              value={minTrustScore}
              min={0}
              max={100}
              step={5}
              onChange={(val) => setMinTrustScore(val)}
              colorScheme="blue"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb boxSize={6}>
                <Box color="blue.500" as={FaStar} />
              </SliderThumb>
            </Slider>
          </FormControl>

          <Button
            leftIcon={<FaSearch />}
            colorScheme="blue"
            isLoading={isSearching}
            onClick={findMatchingCrew}
            mt={2}
          >
            Find Matching Crew
          </Button>

          {/* Matched Crew Results */}
          {matchedCrew.length > 0 && (
            <Box mt={6}>
              <Divider mb={4} />
              <Heading size="sm" mb={3}>
                {matchedCrew.length} Matching Crew Members
              </Heading>

              <VStack spacing={3} align="stretch">
                {matchedCrew.map((crew) => (
                  <Box
                    key={crew.id}
                    p={3}
                    borderRadius="md"
                    bg="gray.700"
                    _hover={{ bg: 'gray.600' }}
                    transition="background 0.2s"
                  >
                    <Flex justify="space-between" align="center">
                      <HStack spacing={3}>
                        <Avatar size="sm" name={crew.username} />
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="medium">{crew.username}</Text>
                          <HStack spacing={1}>
                            {crew.topSkill && (
                              <Tag size="sm" colorScheme="green" variant="subtle">
                                {crew.topSkill.name}: {crew.topSkill.rating}/5
                              </Tag>
                            )}
                            <Text fontSize="xs" color="gray.400">
                              {crew.attestationCount} attestations
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack>
                        <TrustBadge
                          trustScore={crew.trustScore}
                          size="sm"
                          showLabel={true}
                        />
                        <Button
                          size="sm"
                          leftIcon={<FaUserPlus />}
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => {
                            // Show role selection modal
                            toast({
                              title: 'Select a role',
                              description: 'Choose which role to assign this crew member',
                              status: 'info',
                              duration: 2000,
                              isClosable: true,
                            });
                          }}
                        >
                          Add to Crew
                        </Button>
                      </HStack>
                    </Flex>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}

          {/* Roles Assignment */}
          <Box mt={6}>
            <Divider mb={4} />
            <Heading size="sm" mb={3}>
              Assign Crew to Roles
            </Heading>

            <VStack spacing={3} align="stretch">
              {existingRoles.map((roleItem) => (
                <Flex 
                  key={roleItem.role}
                  p={3}
                  borderRadius="md"
                  bg="gray.700"
                  justify="space-between"
                  align="center"
                >
                  <Text fontWeight="medium">{roleItem.role}</Text>
                  
                  {isRoleAssigned(roleItem.role) ? (
                    <HStack>
                      <Badge colorScheme="green">Assigned</Badge>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        colorScheme="blue"
                        onClick={() => openCrewSelectionForRole(roleItem.role)}
                      >
                        Change
                      </Button>
                    </HStack>
                  ) : (
                    <Button
                      size="sm"
                      rightIcon={<FaChevronRight />}
                      colorScheme="blue"
                      onClick={() => openCrewSelectionForRole(roleItem.role)}
                    >
                      Assign Crew
                    </Button>
                  )}
                </Flex>
              ))}

              <Button variant="outline" leftIcon={<FaPlus />} mt={2}>
                Add Another Role
              </Button>
            </VStack>
          </Box>
        </VStack>
      </VStack>

      {/* Crew Selection Modal */}
      <Modal isOpen={isCrewModalOpen} onClose={onCrewModalClose} size="lg">
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Select Crew Member for {selectedRole}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={4}>
              <InputRightElement pointerEvents="none">
                <FaSearch color="gray.300" />
              </InputRightElement>
              <Input 
                placeholder="Search crew members" 
                bg="gray.700"
                border="none"
              />
            </InputGroup>

            <VStack spacing={3} align="stretch" maxH="60vh" overflowY="auto">
              {matchedCrew.map((crew) => (
                <Box
                  key={crew.id}
                  p={3}
                  borderRadius="md"
                  bg="gray.700"
                  _hover={{ bg: 'gray.600' }}
                  cursor="pointer"
                  onClick={() => selectCrewForRole(crew)}
                >
                  <Flex justify="space-between" align="center">
                    <HStack spacing={3}>
                      <Avatar size="sm" name={crew.username} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{crew.username}</Text>
                        <HStack>
                          {crew.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} colorScheme="blue" variant="subtle" fontSize="xs">
                              {skill}
                            </Badge>
                          ))}
                          {crew.skills.length > 2 && (
                            <Text fontSize="xs" color="gray.400">
                              +{crew.skills.length - 2} more
                            </Text>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>

                    <TrustBadge
                      trustScore={crew.trustScore}
                      size="sm"
                      showLabel={true}
                    />
                  </Flex>
                </Box>
              ))}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onCrewModalClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CrewMatchingPanel;
