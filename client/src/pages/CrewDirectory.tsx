import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  HStack,
  VStack,
  Text,
  Button,
  Flex,
  Spinner,
  Divider,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Badge,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaSearch, FaFilter, FaStar, FaShieldAlt } from 'react-icons/fa';
import CrewCard from '../components/crew/CrewCard';

// Mock data for crew members
const mockCrewMembers = [
  {
    id: '1',
    name: 'Jane Doe',
    skills: ['Camera Operation', 'Lighting', 'Video Editing'],
    bio: 'Professional camera operator with 5+ years of experience in documentary filmmaking.',
    trustScore: 92,
    attestationCount: 15,
    topRatedSkill: { name: 'Camera Operation', rating: 4.8 }
  },
  {
    id: '2',
    name: 'John Smith',
    skills: ['Sound Design', 'Boom Operation', 'Mixing'],
    bio: 'Experienced sound engineer specializing in location audio for film and television.',
    trustScore: 78,
    attestationCount: 8,
    topRatedSkill: { name: 'Boom Operation', rating: 4.5 }
  },
  {
    id: '3',
    name: 'Alex Johnson',
    skills: ['Directing', 'Producing', 'Screenwriting'],
    bio: 'Independent filmmaker with a focus on documentary and narrative shorts.',
    trustScore: 85,
    attestationCount: 12,
    topRatedSkill: { name: 'Directing', rating: 4.3 }
  },
  {
    id: '4',
    name: 'Sam Wilson',
    skills: ['Production Assistant', 'Set Design', 'Costume'],
    bio: 'Versatile production assistant with experience in indie films and commercials.',
    trustScore: 65,
    attestationCount: 5,
    topRatedSkill: { name: 'Production Assistant', rating: 4.0 }
  },
  {
    id: '5',
    name: 'Taylor Martinez',
    skills: ['Editing', 'Color Grading', 'VFX'],
    bio: 'Post-production specialist with expertise in color grading and visual effects.',
    trustScore: 88,
    attestationCount: 10,
    topRatedSkill: { name: 'Color Grading', rating: 4.6 }
  },
  {
    id: '6',
    name: 'Jordan Lee',
    skills: ['Grip', 'Gaffer', 'Lighting'],
    bio: 'Experienced grip and gaffer with knowledge of advanced lighting setups.',
    trustScore: 72,
    attestationCount: 7,
    topRatedSkill: { name: 'Lighting', rating: 4.2 }
  },
  {
    id: '7',
    name: 'Casey Rivera',
    skills: ['Makeup', 'Hair Styling', 'SFX Makeup'],
    bio: 'Professional makeup artist specialized in film and television productions.',
    trustScore: 81,
    attestationCount: 9,
    topRatedSkill: { name: 'SFX Makeup', rating: 4.7 }
  },
  {
    id: '8',
    name: 'Morgan Davis',
    skills: ['Script Supervision', 'Continuity', 'Production Coordination'],
    bio: 'Detail-oriented script supervisor with experience in feature films.',
    trustScore: 83,
    attestationCount: 11,
    topRatedSkill: { name: 'Continuity', rating: 4.5 }
  },
  {
    id: '9',
    name: 'Drew Patel',
    skills: ['Drone Operation', 'Aerial Photography', 'Cinematography'],
    bio: 'FAA-certified drone operator specializing in aerial cinematography.',
    trustScore: 90,
    attestationCount: 14,
    topRatedSkill: { name: 'Drone Operation', rating: 4.9 }
  },
  {
    id: '10',
    name: 'Robin Chen',
    skills: ['Production Management', 'Budgeting', 'Scheduling'],
    bio: 'Experienced production manager with a track record of delivering projects on time and under budget.',
    trustScore: 94,
    attestationCount: 18,
    topRatedSkill: { name: 'Production Management', rating: 4.8 }
  },
  {
    id: '11',
    name: 'Jamie Wilson',
    skills: ['Camera Assistant', 'DIT', 'Equipment Management'],
    bio: 'Reliable camera assistant with knowledge of digital imaging technician responsibilities.',
    trustScore: 76,
    attestationCount: 6,
    topRatedSkill: { name: 'Camera Assistant', rating: 4.3 }
  },
  {
    id: '12',
    name: 'Avery Jackson',
    skills: ['Location Scouting', 'Production Design', 'Art Direction'],
    bio: 'Creative location scout with an eye for cinematic environments.',
    trustScore: 82,
    attestationCount: 8,
    topRatedSkill: { name: 'Location Scouting', rating: 4.6 }
  }
];

// Mock categories for dropdown
const categories = [
  'All Categories',
  'Camera Department',
  'Sound Department',
  'Lighting',
  'Production',
  'Post-Production',
  'Art Department',
  'Makeup & Hair',
  'Locations',
];

export const CrewDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [crew, setCrew] = useState(mockCrewMembers);
  const [filteredCrew, setFilteredCrew] = useState(mockCrewMembers);

  const bgColor = useColorModeValue('gray.800', 'gray.900');
  const borderColor = useColorModeValue('gray.700', 'gray.800');

  useEffect(() => {
    filterCrew();
  }, [searchTerm, category, minTrustScore]);

  const filterCrew = () => {
    setLoading(true);

    // Apply filters
    let filtered = [...crew];

    // Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(term) ||
          person.skills.some(skill => skill.toLowerCase().includes(term)) ||
          (person.bio && person.bio.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (category !== 'All Categories') {
      // This is a simple mock implementation - in a real app, you'd have proper category mapping
      filtered = filtered.filter(person => {
        if (category === 'Camera Department') {
          return person.skills.some(skill => 
            ['camera', 'cinematography', 'drone'].some(term => 
              skill.toLowerCase().includes(term)
            )
          );
        } else if (category === 'Sound Department') {
          return person.skills.some(skill => 
            ['sound', 'audio', 'boom', 'mixing'].some(term => 
              skill.toLowerCase().includes(term)
            )
          );
        } else if (category === 'Lighting') {
          return person.skills.some(skill => 
            ['light', 'gaffer', 'grip'].some(term => 
              skill.toLowerCase().includes(term)
            )
          );
        }
        // Add other category filters as needed
        return true;
      });
    }

    // Trust score filter
    if (minTrustScore > 0) {
      filtered = filtered.filter(person => 
        person.trustScore != null && person.trustScore >= minTrustScore
      );
    }

    setFilteredCrew(filtered);
    setLoading(false);
  };

  const handleRangeChange = (values: number[]) => {
    setMinTrustScore(values[0]);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="xl" mb={2} color="white">
            Crew Directory
          </Heading>
          <Text color="gray.400">
            Find trusted crew members for your next production
          </Text>
        </Box>

        {/* Search and Filters */}
        <Box p={6} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
          <VStack spacing={4}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by name, skill, or bio"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                bg="gray.700"
                border="none"
              />
            </InputGroup>

            <Flex 
              width="100%" 
              flexDirection={{ base: 'column', md: 'row' }}
              gap={4}
            >
              <Box flex="1">
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  bg="gray.700"
                  border="none"
                  icon={<FaFilter />}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </Box>

              <Box flex="2">
                <Flex align="center" gap={4}>
                  <Icon as={FaShieldAlt} color="blue.400" />
                  <Text whiteSpace="nowrap" minW="120px">
                    Min Trust Score: 
                    <Badge ml={2} colorScheme="blue" fontSize="0.9em">
                      {minTrustScore}%
                    </Badge>
                  </Text>
                  <RangeSlider
                    aria-label={['min-trust-score']}
                    defaultValue={[0]}
                    min={0}
                    max={100}
                    step={5}
                    onChange={handleRangeChange}
                    flex="1"
                    colorScheme="blue"
                  >
                    <RangeSliderTrack>
                      <RangeSliderFilledTrack />
                    </RangeSliderTrack>
                    <RangeSliderThumb index={0} boxSize={6}>
                      <Box color="blue.600" as={FaStar} />
                    </RangeSliderThumb>
                  </RangeSlider>
                </Flex>
              </Box>
            </Flex>
          </VStack>
        </Box>

        {/* Results */}
        {loading ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : filteredCrew.length === 0 ? (
          <Box textAlign="center" py={10} bg={bgColor} borderRadius="lg">
            <Text fontSize="lg" color="white">No crew members found matching your criteria</Text>
            <Button
              mt={4}
              colorScheme="blue"
              onClick={() => {
                setSearchTerm('');
                setCategory('All Categories');
                setMinTrustScore(0);
              }}
            >
              Clear Filters
            </Button>
          </Box>
        ) : (
          <>
            <Flex justify="space-between" align="center">
              <Text color="white">
                Found {filteredCrew.length} crew member{filteredCrew.length !== 1 ? 's' : ''}
              </Text>
              <Select
                width="200px"
                size="sm"
                bg="gray.700"
                border="none"
                defaultValue="trust"
              >
                <option value="trust">Sort by: Trust Score</option>
                <option value="alphabetical">Sort by: Alphabetical</option>
                <option value="attestations">Sort by: Attestations</option>
              </Select>
            </Flex>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
              {filteredCrew.map((member) => (
                <CrewCard
                  key={member.id}
                  id={member.id}
                  name={member.name}
                  skills={member.skills}
                  bio={member.bio}
                  trustScore={member.trustScore}
                  attestationCount={member.attestationCount}
                  topRatedSkill={member.topRatedSkill}
                />
              ))}
            </SimpleGrid>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default CrewDirectory;
