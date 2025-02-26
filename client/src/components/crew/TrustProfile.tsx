import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Divider,
  Avatar,
  Spinner,
  useColorModeValue,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { FaStar, FaUserCheck, FaCertificate } from 'react-icons/fa';
import { attestationService } from '../../services/attestationService';

interface TrustProfileProps {
  userId: string;
}

interface Attestation {
  id: string;
  attestationType: {
    id: string;
    name: string;
  };
  attester: {
    id: string;
    username: string;
    trustScore: number | null;
  };
  data: string;
  createdAt: string;
}

interface TrustProfile {
  id: string;
  username: string;
  address: string | null;
  trustScore: number | null;
  attestationsReceived: Attestation[];
}

export const TrustProfile: React.FC<TrustProfileProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<TrustProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue('gray.700', 'gray.800');
  const textColor = useColorModeValue('white', 'gray.200');
  const mutedColor = useColorModeValue('gray.400', 'gray.500');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await attestationService.getUserTrustProfile(userId);
        setProfile(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching trust profile:', err);
        setError(err.response?.data?.error || 'Failed to load trust profile');
        
        // Add detailed logging for debugging
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response data:', err.response.data);
        } else if (err.request) {
          console.error('No response received from server');
        } else {
          console.error('Error setting up request:', err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const getTrustScoreColor = (score: number | null) => {
    if (score === null) return 'gray';
    if (score >= 90) return 'green';
    if (score >= 70) return 'blue';
    if (score >= 50) return 'yellow';
    return 'red';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const parseAttestationData = (data: string) => {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" py={6}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
        <Text mt={4} color="gray.300">Loading trust profile...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        p={6} 
        bg="gray.700" 
        borderRadius="md" 
        textAlign="center"
        color="white"
        border="1px solid"
        borderColor="red.500"
      >
        <Icon as={FaStar} color="red.500" boxSize={12} mb={4} />
        <Heading size="md" mb={2} color="red.300">Trust Profile Error</Heading>
        <Text>{error}</Text>
        <Text mt={4} fontSize="sm" color="gray.400">
          This could be due to a network issue or the profile data may not be available yet.
          Try refreshing the page or check back later.
        </Text>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box 
        p={6} 
        bg="gray.700" 
        borderRadius="md" 
        textAlign="center"
        color="white"
      >
        <Icon as={FaStar} color="gray.500" boxSize={12} mb={4} />
        <Heading size="md" mb={2}>No Trust Profile Available</Heading>
        <Text>
          This user doesn't have any attestations yet. Be the first to attest to their skills or work ethic!
        </Text>
      </Box>
    );
  }

  // Separate attestations by type
  const skillAttestations = profile.attestationsReceived.filter(
    (att) => att.attestationType.name === 'Skill'
  );

  const workEthicAttestations = profile.attestationsReceived.filter(
    (att) => att.attestationType.name === 'WorkEthic'
  );

  // Calculate average skills
  const skillRatings: Record<string, number[]> = {};
  skillAttestations.forEach((att) => {
    const data = parseAttestationData(att.data);
    if (data.skill && data.rating) {
      if (!skillRatings[data.skill]) {
        skillRatings[data.skill] = [];
      }
      skillRatings[data.skill].push(data.rating);
    }
  });

  const averageSkills = Object.entries(skillRatings).map(([skill, ratings]) => {
    const average =
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    return {
      skill,
      average,
      count: ratings.length,
    };
  }).sort((a, b) => b.average - a.average);

  // Calculate work ethic averages
  let reliabilityTotal = 0;
  let teamworkTotal = 0;
  let professionalismTotal = 0;
  let ethicCount = 0;

  workEthicAttestations.forEach((att) => {
    const data = parseAttestationData(att.data);
    if (data.reliability && data.teamwork && data.professionalism) {
      reliabilityTotal += data.reliability;
      teamworkTotal += data.teamwork;
      professionalismTotal += data.professionalism;
      ethicCount++;
    }
  });

  const reliabilityAvg = ethicCount > 0 ? reliabilityTotal / ethicCount : 0;
  const teamworkAvg = ethicCount > 0 ? teamworkTotal / ethicCount : 0;
  const professionalismAvg =
    ethicCount > 0 ? professionalismTotal / ethicCount : 0;

  return (
    <VStack spacing={6} align="stretch" width="100%">
      {/* Trust Score Header */}
      <Box p={6} bg={cardBg} borderRadius="lg" color={textColor}>
        <Flex 
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'center', md: 'flex-start' }}
          gap={4}
        >
          <HStack spacing={4} align="center">
            <Avatar
              size="xl"
              name={profile.username}
              src=""
              bg="blue.600"
            />
            <VStack align="flex-start" spacing={1}>
              <Heading size="lg">{profile.username}</Heading>
              {profile.address && (
                <Text color={mutedColor} fontSize="sm">
                  Wallet: {`${profile.address.substring(0, 6)}...${profile.address.substring(profile.address.length - 4)}`}
                </Text>
              )}
              <HStack mt={2}>
                <Badge colorScheme="green" fontSize="md" px={2} py={1} borderRadius="md">
                  <Flex align="center">
                    <Icon as={FaCertificate} mr={1} />
                    <Text>{profile.attestationsReceived.length} Attestations</Text>
                  </Flex>
                </Badge>
              </HStack>
            </VStack>
          </HStack>

          <Box textAlign={{ base: 'center', md: 'right' }}>
            <CircularProgress
              value={profile.trustScore || 0}
              size="120px"
              thickness="8px"
              color={getTrustScoreColor(profile.trustScore)}
            >
              <CircularProgressLabel>
                <VStack spacing={0}>
                  <Text fontWeight="bold" fontSize="xl">
                    {profile.trustScore ? Math.round(profile.trustScore) : '?'}
                  </Text>
                  <Text fontSize="xs">Trust Score</Text>
                </VStack>
              </CircularProgressLabel>
            </CircularProgress>
          </Box>
        </Flex>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {/* Skills Section */}
        <Box p={6} bg={cardBg} borderRadius="lg" color={textColor}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FaStar} mr={2} color="yellow.400" />
              Skills
            </Flex>
          </Heading>

          {averageSkills.length > 0 ? (
            <VStack align="stretch" spacing={4}>
              {averageSkills.map(({ skill, average, count }) => (
                <Box key={skill}>
                  <Flex justify="space-between" align="center" mb={1}>
                    <Text fontWeight="medium">{skill}</Text>
                    <HStack>
                      <Text fontSize="sm" color={mutedColor}>
                        {average.toFixed(1)}/5
                      </Text>
                      <Tag size="sm" colorScheme="blue" borderRadius="full">
                        {count} {count === 1 ? 'attestation' : 'attestations'}
                      </Tag>
                    </HStack>
                  </Flex>
                  <Progress
                    value={(average / 5) * 100}
                    colorScheme={average >= 4 ? 'green' : average >= 3 ? 'blue' : 'yellow'}
                    borderRadius="full"
                    height="8px"
                  />
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color={mutedColor}>No skill attestations yet</Text>
          )}
        </Box>

        {/* Work Ethic Section */}
        <Box p={6} bg={cardBg} borderRadius="lg" color={textColor}>
          <Heading size="md" mb={4}>
            <Flex align="center">
              <Icon as={FaUserCheck} mr={2} color="green.400" />
              Work Ethic
            </Flex>
          </Heading>

          {ethicCount > 0 ? (
            <StatGroup>
              <Stat>
                <StatLabel>Reliability</StatLabel>
                <StatNumber>{reliabilityAvg.toFixed(1)}</StatNumber>
                <Progress
                  value={(reliabilityAvg / 5) * 100}
                  colorScheme={reliabilityAvg >= 4 ? 'green' : 'blue'}
                  size="sm"
                  mt={2}
                />
              </Stat>

              <Stat>
                <StatLabel>Teamwork</StatLabel>
                <StatNumber>{teamworkAvg.toFixed(1)}</StatNumber>
                <Progress
                  value={(teamworkAvg / 5) * 100}
                  colorScheme={teamworkAvg >= 4 ? 'green' : 'blue'}
                  size="sm"
                  mt={2}
                />
              </Stat>

              <Stat>
                <StatLabel>Professionalism</StatLabel>
                <StatNumber>{professionalismAvg.toFixed(1)}</StatNumber>
                <Progress
                  value={(professionalismAvg / 5) * 100}
                  colorScheme={professionalismAvg >= 4 ? 'green' : 'blue'}
                  size="sm"
                  mt={2}
                />
              </Stat>
            </StatGroup>
          ) : (
            <Text color={mutedColor}>No work ethic attestations yet</Text>
          )}
        </Box>
      </SimpleGrid>

      {/* Attestation History */}
      <Box p={6} bg={cardBg} borderRadius="lg" color={textColor}>
        <Heading size="md" mb={4}>Attestation History</Heading>

        {profile.attestationsReceived.length > 0 ? (
          <Accordion allowMultiple>
            {profile.attestationsReceived.map((attestation) => {
              const data = parseAttestationData(attestation.data);
              const isSkill = attestation.attestationType.name === 'Skill';

              return (
                <AccordionItem key={attestation.id} border="none" mb={2}>
                  <AccordionButton 
                    bg="gray.600" 
                    _hover={{ bg: 'gray.500' }}
                    borderRadius="md"
                    p={3}
                  >
                    <Box flex="1" textAlign="left">
                      <Flex 
                        direction={{ base: 'column', md: 'row' }}
                        justify="space-between"
                        align={{ base: 'flex-start', md: 'center' }}
                        gap={2}
                      >
                        <HStack>
                          <Icon 
                            as={isSkill ? FaStar : FaUserCheck} 
                            color={isSkill ? 'yellow.400' : 'green.400'} 
                          />
                          <Text fontWeight="medium">
                            {isSkill 
                              ? `${data.skill} (${data.rating}/5)` 
                              : `Work Ethic Attestation`
                            }
                          </Text>
                        </HStack>
                        <HStack>
                          <Text fontSize="sm" color={mutedColor}>
                            By {attestation.attester.username}
                          </Text>
                          <Text fontSize="xs" color={mutedColor}>
                            {formatDate(attestation.createdAt)}
                          </Text>
                        </HStack>
                      </Flex>
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4} bg="gray.900" mt={1} borderRadius="md">
                    {isSkill ? (
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text fontWeight="bold" width="100px">Skill:</Text>
                          <Text>{data.skill}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="bold" width="100px">Rating:</Text>
                          <HStack>
                            {[...Array(5)].map((_, i) => (
                              <Icon 
                                key={i} 
                                as={FaStar} 
                                color={i < data.rating ? 'yellow.400' : 'gray.500'} 
                              />
                            ))}
                          </HStack>
                        </HStack>
                        {data.comments && (
                          <Box>
                            <Text fontWeight="bold">Comments:</Text>
                            <Text mt={1}>{data.comments}</Text>
                          </Box>
                        )}
                      </VStack>
                    ) : (
                      <VStack align="stretch" spacing={2}>
                        <SimpleGrid columns={3} spacing={4}>
                          <Box>
                            <Text fontWeight="bold">Reliability</Text>
                            <HStack mt={1}>
                              {[...Array(5)].map((_, i) => (
                                <Icon 
                                  key={i} 
                                  as={FaStar} 
                                  color={i < data.reliability ? 'yellow.400' : 'gray.500'} 
                                />
                              ))}
                            </HStack>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Teamwork</Text>
                            <HStack mt={1}>
                              {[...Array(5)].map((_, i) => (
                                <Icon 
                                  key={i} 
                                  as={FaStar} 
                                  color={i < data.teamwork ? 'yellow.400' : 'gray.500'} 
                                />
                              ))}
                            </HStack>
                          </Box>
                          <Box>
                            <Text fontWeight="bold">Professionalism</Text>
                            <HStack mt={1}>
                              {[...Array(5)].map((_, i) => (
                                <Icon 
                                  key={i} 
                                  as={FaStar} 
                                  color={i < data.professionalism ? 'yellow.400' : 'gray.500'} 
                                />
                              ))}
                            </HStack>
                          </Box>
                        </SimpleGrid>
                        {data.comments && (
                          <Box mt={2}>
                            <Text fontWeight="bold">Comments:</Text>
                            <Text mt={1}>{data.comments}</Text>
                          </Box>
                        )}
                      </VStack>
                    )}
                    <Divider my={3} />
                    <Flex justify="space-between" align="center">
                      <Text fontSize="sm">
                        Attester: <Text as="span" fontWeight="bold">{attestation.attester.username}</Text>
                      </Text>
                      {attestation.attester.trustScore && (
                        <Tag colorScheme={getTrustScoreColor(attestation.attester.trustScore)}>
                          Trust Score: {Math.round(attestation.attester.trustScore)}
                        </Tag>
                      )}
                    </Flex>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <Text color={mutedColor}>No attestations yet</Text>
        )}
      </Box>
    </VStack>
  );
};

export default TrustProfile;
