import React, { useState } from 'react';
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
  Button,
  Tag,
  Progress,
  Badge,
  Flex,
  Divider,
  Icon,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Avatar,
} from '@chakra-ui/react';
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiClock,
  FiDownload,
  FiExternalLink,
  FiPlayCircle,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';

// Mock data for courses and certifications
const mockCourses = [
  {
    id: '1',
    title: 'Audio Engineering Fundamentals',
    provider: 'Production Academy',
    image: '/images/audio-engineering.jpg',
    description:
      'Master the basics of audio engineering including signal flow, EQ, compression, and more.',
    level: 'Beginner',
    duration: '12 hours',
    progress: 85,
    completionDate: null,
    skills: ['Audio Engineering', 'Signal Processing', 'ProTools'],
    popular: true,
    recommended: true,
  },
  {
    id: '2',
    title: 'Advanced Lighting Design',
    provider: 'Event Pro Education',
    image: '/images/lighting-design.jpg',
    description:
      'Take your lighting skills to the next level with advanced programming and design techniques.',
    level: 'Advanced',
    duration: '8 hours',
    progress: 100,
    completionDate: '2025-01-15',
    skills: ['Lighting Design', 'GrandMA', 'Color Theory'],
    popular: true,
    recommended: false,
  },
  {
    id: '3',
    title: 'Event Safety and Risk Management',
    provider: 'Event Safety Alliance',
    image: '/images/event-safety.jpg',
    description:
      'Learn best practices for ensuring safety at live events and managing potential risks.',
    level: 'Intermediate',
    duration: '6 hours',
    progress: 30,
    completionDate: null,
    skills: ['Risk Assessment', 'Safety Planning', 'Crisis Management'],
    popular: false,
    recommended: true,
  },
  {
    id: '4',
    title: 'Video Production Essentials',
    provider: 'Media Skills Pro',
    image: '/images/video-production.jpg',
    description:
      'Essential techniques for professional video production in live event environments.',
    level: 'Beginner',
    duration: '10 hours',
    progress: 0,
    completionDate: null,
    skills: ['Camera Operation', 'Switching', 'Live Streaming'],
    popular: true,
    recommended: true,
  },
  {
    id: '5',
    title: 'Leading Production Teams',
    provider: 'Event Leadership Institute',
    image: '/images/team-leadership.jpg',
    description:
      'Develop leadership skills specific to managing technical teams in high-pressure environments.',
    level: 'Advanced',
    duration: '8 hours',
    progress: 100,
    completionDate: '2025-02-10',
    skills: ['Leadership', 'Team Management', 'Conflict Resolution'],
    popular: false,
    recommended: true,
  },
  {
    id: '6',
    title: 'Networking for AV Professionals',
    provider: 'AV Networking Academy',
    image: '/images/av-networking.jpg',
    description:
      'Understanding IP networking principles for modern AV systems and troubleshooting.',
    level: 'Intermediate',
    duration: '9 hours',
    progress: 50,
    completionDate: null,
    skills: ['IP Networking', 'Dante', 'Network Troubleshooting'],
    popular: true,
    recommended: false,
  },
];

const mockCertifications = [
  {
    id: '1',
    name: 'Certified Audio Engineer',
    issuingOrganization: 'Professional Audio Association',
    image: '/images/audio-cert.jpg',
    dateEarned: '2024-11-20',
    expirationDate: '2027-11-20',
    skills: ['Audio Engineering', 'Live Sound', 'ProTools'],
    level: 'Professional',
    industry: 'Audio Production',
  },
  {
    id: '2',
    name: 'Event Safety Professional',
    issuingOrganization: 'Event Safety Alliance',
    image: '/images/safety-cert.jpg',
    dateEarned: '2024-09-15',
    expirationDate: '2026-09-15',
    skills: ['Risk Management', 'Emergency Response', 'Crowd Management'],
    level: 'Professional',
    industry: 'Event Management',
  },
  {
    id: '3',
    name: 'Digital Video Specialist',
    issuingOrganization: 'Media Production Institute',
    image: '/images/video-cert.jpg',
    dateEarned: '2025-01-08',
    expirationDate: '2027-01-08',
    skills: ['Video Production', 'Live Streaming', 'Content Creation'],
    level: 'Specialist',
    industry: 'Video Production',
  },
  {
    id: '4',
    name: 'AV Network Technician',
    issuingOrganization: 'AV Industry Association',
    image: '/images/network-cert.jpg',
    dateEarned: '2024-12-05',
    expirationDate: '2026-12-05',
    skills: ['Network Configuration', 'Troubleshooting', 'System Integration'],
    level: 'Technician',
    industry: 'AV Technology',
  },
];

const mockSkills = [
  { id: '1', name: 'Audio Engineering', level: 'Advanced', endorsements: 15, verifications: 3 },
  { id: '2', name: 'Lighting Design', level: 'Intermediate', endorsements: 8, verifications: 1 },
  { id: '3', name: 'Stage Management', level: 'Advanced', endorsements: 12, verifications: 2 },
  { id: '4', name: 'Video Production', level: 'Beginner', endorsements: 5, verifications: 0 },
  { id: '5', name: 'Crew Management', level: 'Intermediate', endorsements: 9, verifications: 1 },
  { id: '6', name: 'ProTools', level: 'Advanced', endorsements: 14, verifications: 2 },
  { id: '7', name: 'GrandMA', level: 'Intermediate', endorsements: 7, verifications: 1 },
  { id: '8', name: 'Network Administration', level: 'Beginner', endorsements: 4, verifications: 0 },
];

const CourseCard = ({ course }: { course: (typeof mockCourses)[0] }) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="md">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <VStack align="start" spacing={1}>
              <Heading size="md">{course.title}</Heading>
              <Text fontSize="sm" color="gray.400">
                {course.provider}
              </Text>
            </VStack>
            <Avatar name={course.provider} size="sm" />
          </Flex>

          <HStack>
            <Badge
              colorScheme={
                course.level === 'Beginner'
                  ? 'green'
                  : course.level === 'Intermediate'
                    ? 'blue'
                    : 'purple'
              }
            >
              {course.level}
            </Badge>
            <Badge colorScheme="gray">
              <Icon as={FiClock} mr={1} />
              {course.duration}
            </Badge>
          </HStack>

          <Text fontSize="sm" noOfLines={2}>
            {course.description}
          </Text>

          <Box>
            <HStack mb={1} justify="space-between">
              <Text fontSize="xs" color="gray.500">
                Progress
              </Text>
              <Text fontSize="xs" color="gray.500">
                {course.progress}%
              </Text>
            </HStack>
            <Progress
              value={course.progress}
              colorScheme={course.progress === 100 ? 'green' : 'blue'}
              size="sm"
              borderRadius="base"
              mb={2}
            />
          </Box>

          <HStack spacing={1} flexWrap="wrap">
            {course.skills.map((skill, index) => (
              <Tag key={index} size="sm" colorScheme="blue" m={0.5}>
                {skill}
              </Tag>
            ))}
          </HStack>

          <Button
            leftIcon={course.progress === 0 ? <FiPlayCircle /> : <FiPlayCircle />}
            colorScheme={course.progress === 100 ? 'green' : 'blue'}
            size="sm"
            borderRadius="base"
          >
            {course.progress === 0
              ? 'Start Course'
              : course.progress === 100
                ? 'Review Course'
                : 'Continue Learning'}
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

const CertificationCard = ({
  certification,
}: {
  certification: (typeof mockCertifications)[0];
}) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="md">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <VStack align="start" spacing={1}>
              <Heading size="md">{certification.name}</Heading>
              <Text fontSize="sm" color="gray.400">
                {certification.issuingOrganization}
              </Text>
            </VStack>
            <Avatar name={certification.issuingOrganization} size="sm" />
          </Flex>

          <HStack>
            <Badge colorScheme="green">
              <Icon as={FiCheck} mr={1} />
              Verified
            </Badge>
            <Badge colorScheme="blue">{certification.level}</Badge>
          </HStack>

          <VStack align="start" spacing={1}>
            <HStack>
              <Icon as={FiCalendar} size={14} />
              <Text fontSize="sm">
                Issued: {new Date(certification.dateEarned).toLocaleDateString()}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiCalendar} size={14} />
              <Text fontSize="sm">
                Expires: {new Date(certification.expirationDate).toLocaleDateString()}
              </Text>
            </HStack>
          </VStack>

          <HStack spacing={1} flexWrap="wrap">
            {certification.skills.map((skill, index) => (
              <Tag key={index} size="sm" colorScheme="purple" m={0.5}>
                {skill}
              </Tag>
            ))}
          </HStack>

          <HStack spacing={2}>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              size="sm"
              flex="1"
              borderRadius="base"
            >
              Download
            </Button>
            <Button
              leftIcon={<FiExternalLink />}
              colorScheme="gray"
              size="sm"
              flex="1"
              borderRadius="base"
            >
              Verify
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

const SkillCard = ({ skill }: { skill: (typeof mockSkills)[0] }) => {
  const cardBg = useColorModeValue('gray.800', 'gray.800');
  const borderColor = useColorModeValue('gray.700', 'gray.700');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'blue';
      case 'Advanced':
        return 'purple';
      default:
        return 'gray';
    }
  };

  return (
    <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} boxShadow="md">
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Flex justifyContent="space-between" alignItems="center">
            <Heading size="md">{skill.name}</Heading>
            <Badge colorScheme={getLevelColor(skill.level)}>{skill.level}</Badge>
          </Flex>

          <HStack justify="space-between">
            <HStack>
              <Icon as={FiUsers} color="blue.400" />
              <Text fontSize="sm">{skill.endorsements} endorsements</Text>
            </HStack>

            <HStack>
              <Icon as={FiCheck} color={skill.verifications > 0 ? 'green.400' : 'gray.400'} />
              <Text fontSize="sm">
                {skill.verifications} verification{skill.verifications !== 1 ? 's' : ''}
              </Text>
            </HStack>
          </HStack>

          <Button colorScheme="blue" size="sm" borderRadius="base">
            Request Verification
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export const Education = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
          <Box>
            <Heading size="lg" mb={2}>
              Education & Upskilling
            </Heading>
            <Text color="gray.500">
              Expand your knowledge and grow your career in the production industry
            </Text>
          </Box>
        </Flex>

        <Tabs variant="enclosed" colorScheme="gray" onChange={setActiveTab} index={activeTab}>
          <TabList>
            <Tab borderRadius="base">Courses</Tab>
            <Tab borderRadius="base">Certifications</Tab>
            <Tab borderRadius="base">Skills</Tab>
            <Tab borderRadius="base">Recommended</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <Box mb={6}>
                <Heading size="md" mb={4}>
                  My Courses
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {mockCourses
                    .filter((course) => course.progress > 0)
                    .map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                </SimpleGrid>
              </Box>

              <Divider mb={6} />

              <Box>
                <Heading size="md" mb={4}>
                  Available Courses
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {mockCourses
                    .filter((course) => course.progress === 0)
                    .map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                </SimpleGrid>
              </Box>
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {mockCertifications.map((certification) => (
                  <CertificationCard key={certification.id} certification={certification} />
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {mockSkills.map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </SimpleGrid>
            </TabPanel>

            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {mockCourses
                  .filter((course) => course.recommended)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </SimpleGrid>
            </TabPanel>
          </TabPanels>
        </Tabs>

        <Box bg="gray.800" p={6} borderRadius="lg" boxShadow="md">
          <VStack align="start" spacing={4}>
            <HStack>
              <Icon as={FiTrendingUp} color="blue.400" boxSize={6} />
              <Heading size="md">Professional Development Tracker</Heading>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} width="100%" spacing={6}>
              <VStack align="start">
                <Text color="gray.400">Courses Completed</Text>
                <HStack>
                  <Heading size="lg">2</Heading>
                  <Text color="gray.500">of 6 enrolled</Text>
                </HStack>
                <Progress
                  value={33}
                  colorScheme="blue"
                  size="sm"
                  width="100%"
                  borderRadius="base"
                />
              </VStack>

              <VStack align="start">
                <Text color="gray.400">Certifications</Text>
                <HStack>
                  <Heading size="lg">4</Heading>
                  <Text color="gray.500">active</Text>
                </HStack>
                <Progress
                  value={100}
                  colorScheme="green"
                  size="sm"
                  width="100%"
                  borderRadius="base"
                />
              </VStack>

              <VStack align="start">
                <Text color="gray.400">Skill Growth</Text>
                <HStack>
                  <Heading size="lg">8</Heading>
                  <Text color="gray.500">skills tracked</Text>
                </HStack>
                <Progress
                  value={75}
                  colorScheme="purple"
                  size="sm"
                  width="100%"
                  borderRadius="base"
                />
              </VStack>
            </SimpleGrid>

            <Button colorScheme="blue" leftIcon={<FiAward />} borderRadius="base">
              View Career Development Plan
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Education;
