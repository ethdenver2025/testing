import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  VStack,
  HStack,
  Progress,
  Badge,
  Flex,
  Divider,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Circle,
  Tooltip,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import {
  FiAward,
  FiTrendingUp,
  FiCheckCircle,
  FiStar,
  FiUsers,
  FiThumbsUp,
  FiClock,
  FiBook,
  FiBriefcase,
  FiGlobe,
  FiHeart,
  FiTarget,
  FiZap,
  FiBarChart2,
  FiCalendar,
} from 'react-icons/fi';

// Mock data for accolades
const mockAccolades = {
  stats: {
    jobsCompleted: 47,
    skillsAttested: 12,
    certifications: 5,
    eventsWorked: 23,
    avgClientSatisfaction: 4.8,
    totalHours: 412,
  },
  achievements: [
    {
      id: 1,
      title: 'Road Warrior',
      description: 'Completed 10 different events in 5 different cities',
      icon: FiGlobe,
      progress: 100,
      color: 'purple',
      date: 'Unlocked: Jan 15, 2025',
    },
    {
      id: 2,
      title: 'Specialist: Audio Engineer',
      description: 'Completed 20 jobs in the Audio Engineering role',
      icon: FiZap,
      progress: 80,
      color: 'blue',
      date: 'Progress: 16/20 jobs completed',
    },
    {
      id: 3,
      title: 'Team Player',
      description: 'Received 10 peer endorsements for collaboration',
      icon: FiUsers,
      progress: 70,
      color: 'green',
      date: 'Progress: 7/10 endorsements',
    },
    {
      id: 4,
      title: 'Certified Pro',
      description: 'Earned 5 industry certifications',
      icon: FiCheckCircle,
      progress: 100,
      color: 'teal',
      date: 'Unlocked: Feb 10, 2025',
    },
    {
      id: 5,
      title: 'Rising Star',
      description: 'Completed 5 jobs with 5-star ratings',
      icon: FiStar,
      progress: 80,
      color: 'yellow',
      date: 'Progress: 4/5 5-star jobs',
    },
    {
      id: 6,
      title: 'Quick Learner',
      description: 'Mastered 3 new skills within 30 days',
      icon: FiTrendingUp,
      progress: 100,
      color: 'cyan',
      date: 'Unlocked: Dec 5, 2024',
    },
    {
      id: 7,
      title: 'Marathon Runner',
      description: 'Worked 5 events lasting more than 12 hours each',
      icon: FiClock,
      progress: 60,
      color: 'orange',
      date: 'Progress: 3/5 marathon events',
    },
    {
      id: 8,
      title: 'Producer Favorite',
      description: 'Requested by name by 3 different producers',
      icon: FiHeart,
      progress: 66,
      color: 'pink',
      date: 'Progress: 2/3 producer requests',
    },
  ],
  badges: [
    {
      id: 1,
      name: 'Jobs Milestone',
      level: 'Silver',
      icon: FiBriefcase,
      description: 'Completed 50+ jobs',
    },
    {
      id: 2,
      name: 'Skill Attestation',
      level: 'Gold',
      icon: FiThumbsUp,
      description: '10+ skills attested by industry pros',
    },
    {
      id: 3,
      name: 'Certification Collector',
      level: 'Bronze',
      icon: FiAward,
      description: 'Earned 5+ certifications',
    },
    {
      id: 4,
      name: 'Client Satisfaction',
      level: 'Platinum',
      icon: FiStar,
      description: 'Maintained 4.8+ rating for 20+ jobs',
    },
  ],
};

const AchievementCard = ({
  achievement,
}: {
  achievement: (typeof mockAccolades.achievements)[0];
}) => {
  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  return (
    <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} boxShadow="md">
      <CardBody>
        <HStack spacing={4} align="flex-start">
          <Circle size="40px" bg={`${achievement.color}.500`} color="white">
            <Icon as={achievement.icon} boxSize={5} />
          </Circle>
          <VStack align="start" flex="1" spacing={2}>
            <HStack justify="space-between" width="100%">
              <Heading size="sm">{achievement.title}</Heading>
              {achievement.progress === 100 && (
                <Badge colorScheme={achievement.color} fontSize="xs">
                  Completed
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.400">
              {achievement.description}
            </Text>
            <Box w="100%">
              <Progress
                value={achievement.progress}
                colorScheme={achievement.color}
                size="sm"
                borderRadius="base"
                mb={1}
              />
              <Text fontSize="xs" color="gray.500">
                {achievement.date}
              </Text>
            </Box>
          </VStack>
        </HStack>
      </CardBody>
    </Card>
  );
};

const BadgeCard = ({ badge }: { badge: (typeof mockAccolades.badges)[0] }) => {
  const levelColors = {
    Bronze: 'orange',
    Silver: 'gray',
    Gold: 'yellow',
    Platinum: 'cyan',
  };

  const bgColor = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  return (
    <Card bg={bgColor} borderWidth="1px" borderColor={borderColor} boxShadow="md">
      <CardBody>
        <VStack spacing={3} align="center">
          <Circle size="70px" bg={`${levelColors[badge.level]}.500`} color="white" boxShadow="md">
            <Icon as={badge.icon} boxSize={8} />
          </Circle>
          <Heading size="sm">{badge.name}</Heading>
          <Badge colorScheme={levelColors[badge.level]}>{badge.level}</Badge>
          <Text fontSize="sm" textAlign="center" color="gray.400">
            {badge.description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const Accolades = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
          <Box>
            <Heading size="lg" mb={2}>
              Your Accolades
            </Heading>
            <Text color="gray.500">Track your achievements and professional growth</Text>
          </Box>
          <Button colorScheme="blue" leftIcon={<FiAward />} borderRadius="base">
            View Career Development Plan
          </Button>
        </Flex>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} spacing={4}>
          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Jobs Completed</StatLabel>
            <StatNumber>{mockAccolades.stats.jobsCompleted}</StatNumber>
            <StatHelpText>
              <Icon as={FiBriefcase} mr={1} />
              Career Progress
            </StatHelpText>
          </Stat>

          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Skills Attested</StatLabel>
            <StatNumber>{mockAccolades.stats.skillsAttested}</StatNumber>
            <StatHelpText>
              <Icon as={FiThumbsUp} mr={1} />
              By Industry Pros
            </StatHelpText>
          </Stat>

          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Certifications</StatLabel>
            <StatNumber>{mockAccolades.stats.certifications}</StatNumber>
            <StatHelpText>
              <Icon as={FiAward} mr={1} />
              Career Building
            </StatHelpText>
          </Stat>

          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Events Worked</StatLabel>
            <StatNumber>{mockAccolades.stats.eventsWorked}</StatNumber>
            <StatHelpText>
              <Icon as={FiCalendar} mr={1} />
              Professional Experience
            </StatHelpText>
          </Stat>

          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Client Satisfaction</StatLabel>
            <StatNumber>{mockAccolades.stats.avgClientSatisfaction}</StatNumber>
            <StatHelpText>
              <Icon as={FiStar} mr={1} />
              Average Rating
            </StatHelpText>
          </Stat>

          <Stat
            bg={useColorModeValue('gray.800', 'gray.800')}
            p={4}
            borderRadius="base"
            boxShadow="md"
          >
            <StatLabel>Total Hours</StatLabel>
            <StatNumber>{mockAccolades.stats.totalHours}</StatNumber>
            <StatHelpText>
              <Icon as={FiClock} mr={1} />
              Field Experience
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Divider />

        {/* Achievements Section */}
        <Box>
          <Heading size="md" mb={4}>
            Achievements in Progress
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {mockAccolades.achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </SimpleGrid>
        </Box>

        <Divider />

        {/* Badges Section */}
        <Box>
          <Heading size="md" mb={4}>
            Career Badges
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {mockAccolades.badges.map((badge) => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Container>
  );
};

export default Accolades;
