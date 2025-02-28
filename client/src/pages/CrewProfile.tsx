import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Avatar,
  useDisclosure,
  Alert,
  AlertIcon,
  Flex,
  Badge,
  Divider,
  useToast,
  Spinner,
  Icon,
} from '@chakra-ui/react';
import { FaUserAlt, FaAward, FaHistory, FaCertificate, FaPlus } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import TrustProfile from '../components/crew/TrustProfile';
import CreateAttestationModal from '../components/crew/CreateAttestationModal';

// Mock service function - replace with your actual API call
const fetchCrewMember = async (id: string) => {
  // This is a placeholder - replace with your API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        username: 'Jane Doe',
        bio: 'Professional camera operator with 5+ years of experience in documentary filmmaking.',
        skills: ['Camera Operation', 'Lighting', 'Video Editing'],
        pastEvents: [
          { id: '1', title: 'Documentary Film Festival 2024', role: 'Camera Operator' },
          { id: '2', title: 'Music Video Production', role: 'Lighting Technician' },
        ]
      });
    }, 1000);
  });
};

export const CrewProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [crewMember, setCrewMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  
  const { 
    isOpen: isAttestationModalOpen, 
    onOpen: onAttestationModalOpen, 
    onClose: onAttestationModalClose 
  } = useDisclosure();

  useEffect(() => {
    if (!id) {
      setError('No crew member ID provided');
      setLoading(false);
      return;
    }

    const loadCrewMember = async () => {
      try {
        setLoading(true);
        const data = await fetchCrewMember(id);
        setCrewMember(data);
        setError(null);
      } catch (err: any) {
        setError('Failed to load crew member profile');
        console.error('Error fetching crew member:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCrewMember();
  }, [id]);

  const handleAttestationCreated = () => {
    toast({
      title: 'Attestation Created',
      description: 'Your attestation has been recorded on-chain and will contribute to the crew member\'s reputation.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    // You might want to refresh the profile or trust data here
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading profile...</Text>
      </Box>
    );
  }

  if (error || !crewMember) {
    return (
      <Container maxW="container.lg" py={8}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error || 'Could not load profile'}
        </Alert>
        <Button mt={4} onClick={() => navigate(-1)}>Go Back</Button>
      </Container>
    );
  }

  const canCreateAttestation = user && user.id !== id;

  return (
    <Container maxW="container.lg" py={8}>
      {/* Profile Header */}
      <Box mb={8} p={6} bg="gray.800" borderRadius="lg" color="white">
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
          gap={6}
        >
          <Avatar size="2xl" name={crewMember.username} src="" bg="blue.600" />
          
          <VStack align="stretch" flex="1">
            <Heading size="lg">{crewMember.username}</Heading>
            
            <HStack mt={1} wrap="wrap">
              {crewMember.skills.map((skill: string) => (
                <Badge key={skill} colorScheme="blue" px={2} py={1} borderRadius="md">
                  {skill}
                </Badge>
              ))}
            </HStack>
            
            <Text mt={3}>{crewMember.bio}</Text>
            
            {canCreateAttestation && (
              <Button 
                leftIcon={<FaAward />} 
                colorScheme="green" 
                mt={4}
                alignSelf="flex-start"
                onClick={onAttestationModalOpen}
              >
                Create Attestation
              </Button>
            )}
          </VStack>
        </Flex>
      </Box>

      {/* Tabs for different sections */}
      <Tabs variant="enclosed" colorScheme="blue" bg="gray.800" borderRadius="lg">
        <TabList>
          <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
            <Icon as={FaCertificate} mr={2} />
            Reputation & Trust
          </Tab>
          <Tab _selected={{ color: 'white', bg: 'blue.600' }}>
            <Icon as={FaHistory} mr={2} />
            Work History
          </Tab>
        </TabList>

        <TabPanels>
          {/* Trust Profile Tab */}
          <TabPanel p={6}>
            {id && <TrustProfile userId={id} />}
          </TabPanel>

          {/* Work History Tab */}
          <TabPanel p={6}>
            <Box color="white">
              <Heading size="md" mb={4}>Past Events</Heading>
              
              {crewMember.pastEvents && crewMember.pastEvents.length > 0 ? (
                <VStack spacing={4} align="stretch">
                  {crewMember.pastEvents.map((event: any) => (
                    <Box 
                      key={event.id}
                      p={4}
                      borderRadius="md"
                      bg="gray.700"
                    >
                      <Heading size="sm">{event.title}</Heading>
                      <Flex justify="space-between" mt={2}>
                        <Badge colorScheme="purple">{event.role}</Badge>
                        <Text fontSize="sm" color="gray.400">March 2024</Text>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text color="gray.400">No past events found.</Text>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Attestation Modal */}
      {canCreateAttestation && id && (
        <CreateAttestationModal
          isOpen={isAttestationModalOpen}
          onClose={onAttestationModalClose}
          recipientId={id}
          recipientName={crewMember.username}
          onAttestationCreated={handleAttestationCreated}
        />
      )}
    </Container>
  );
};
