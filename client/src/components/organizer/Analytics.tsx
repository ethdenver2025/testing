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
  Flex,
  Badge,
  Progress,
  Icon,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiCalendar,
  FiDownload,
  FiTrendingUp,
  FiUsers,
  FiBarChart2,
  FiDollarSign,
  FiCheckCircle,
} from 'react-icons/fi';

// Mock data for charts
const monthlyData = [
  { name: 'Jan', value: 12 },
  { name: 'Feb', value: 19 },
  { name: 'Mar', value: 15 },
  { name: 'Apr', value: 27 },
  { name: 'May', value: 29 },
  { name: 'Jun', value: 35 },
  { name: 'Jul', value: 40 },
  { name: 'Aug', value: 32 },
  { name: 'Sep', value: 28 },
  { name: 'Oct', value: 35 },
  { name: 'Nov', value: 42 },
  { name: 'Dec', value: 38 },
];

const roleData = [
  { name: 'Sound Engineers', value: 40 },
  { name: 'Videographers', value: 25 },
  { name: 'Event Managers', value: 15 },
  { name: 'Production Assistants', value: 20 },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={6}>
      <Box mb={8}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Analytics Dashboard</Heading>
          <HStack>
            <IconButton
              aria-label="Download report"
              icon={<FiDownload />}
              variant="outline"
            />
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <StatCard
            title="Total Events"
            value="24"
            change="+8%"
            period="vs last month"
            icon={FiCalendar}
            color="blue.500"
          />
          <StatCard
            title="Total Crew"
            value="412"
            change="+12%"
            period="vs last month"
            icon={FiUsers}
            color="green.500"
          />
          <StatCard
            title="Hiring Rate"
            value="78%"
            change="+5%"
            period="vs last month"
            icon={FiTrendingUp}
            color="purple.500"
          />
          <StatCard
            title="Budget Used"
            value="$124K"
            change="+18%"
            period="vs last month"
            icon={FiDollarSign}
            color="orange.500"
          />
        </SimpleGrid>
        
        <Card mt={6}>
          <CardBody>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">Upcoming Events</Heading>
              <VStack align="stretch" spacing={3}>
                <EventStats
                  name="ETHDenver 2025"
                  date="Feb 28 - Mar 2, 2025"
                  crewNeeded={30}
                  crewHired={25}
                  status="Active"
                />
                <EventStats
                  name="Web3 Summit"
                  date="Apr 15 - Apr 17, 2025"
                  crewNeeded={20}
                  crewHired={8}
                  status="Hiring"
                />
                <EventStats
                  name="DeFi Conference"
                  date="May 10 - May 12, 2025"
                  crewNeeded={15}
                  crewHired={0}
                  status="Planning"
                />
                <EventStats
                  name="NFT Exhibition"
                  date="Jun 5 - Jun 7, 2025"
                  crewNeeded={25}
                  crewHired={0}
                  status="Planning"
                />
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </Box>
    </Container>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
  icon: React.ElementType;
  color: string;
}

const StatCard = ({ title, value, change, period, icon, color }: StatCardProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Card>
      <CardBody>
        <HStack justify="space-between" mb={4}>
          <Text color="gray.500" fontWeight="medium">
            {title}
          </Text>
          <Icon as={icon} boxSize={6} color={color} />
        </HStack>
        <Heading size="xl" mb={2}>
          {value}
        </Heading>
        <HStack>
          <Text color="green.500" fontWeight="medium">
            {change}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {period}
          </Text>
        </HStack>
      </CardBody>
    </Card>
  );
};

interface EventStatsProps {
  name: string;
  date: string;
  crewNeeded: number;
  crewHired: number;
  status: 'Active' | 'Completed' | 'Hiring' | 'Planning';
}

const EventStats = ({ name, date, crewNeeded, crewHired, status }: EventStatsProps) => {
  const percentage = Math.round((crewHired / crewNeeded) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Completed':
        return 'gray';
      case 'Hiring':
        return 'blue';
      case 'Planning':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" borderColor="border.subtle" bg="background.secondary">
      <Flex justify="space-between" align="center" mb={3}>
        <VStack align="start" spacing={0}>
          <Heading size="sm">{name}</Heading>
          <Text fontSize="sm" color="gray.500">
            {date}
          </Text>
        </VStack>
        <Badge colorScheme={getStatusColor(status)}>{status}</Badge>
      </Flex>
      <Flex justify="space-between" mb={2}>
        <Text fontSize="sm">Hiring Progress</Text>
        <HStack>
          <Text fontSize="sm" fontWeight="medium">
            {crewHired}
          </Text>
          <Text fontSize="sm" color="gray.500">
            /{crewNeeded} crew
          </Text>
        </HStack>
      </Flex>
      <Progress value={percentage} colorScheme="blue" size="sm" borderRadius="full" />
    </Box>
  );
};

export { Analytics };
