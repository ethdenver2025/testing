import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, VStack, HStack } from '@chakra-ui/react';

export const Analytics = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Analytics</Heading>
          <Text color="gray.500">Track your event and hiring metrics</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            title="Total Events"
            value="12"
            change="+3"
            period="vs. last month"
          />
          <StatCard
            title="Active Jobs"
            value="25"
            change="+8"
            period="vs. last month"
          />
          <StatCard
            title="Applications"
            value="156"
            change="+42"
            period="vs. last month"
          />
          <StatCard
            title="Crew Hired"
            value="48"
            change="+15"
            period="vs. last month"
          />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <Card bg="carbon.800" borderColor="carbon.700" borderWidth={1}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Popular Roles</Heading>
                <VStack align="stretch" spacing={3}>
                  <RoleStats role="Camera Operator" count={35} total={156} />
                  <RoleStats role="Sound Engineer" count={28} total={156} />
                  <RoleStats role="Lighting Technician" count={22} total={156} />
                  <RoleStats role="Video Editor" count={18} total={156} />
                  <RoleStats role="Production Assistant" count={15} total={156} />
                </VStack>
              </VStack>
            </CardBody>
          </Card>

          <Card bg="carbon.800" borderColor="carbon.700" borderWidth={1}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Upcoming Events</Heading>
                <VStack align="stretch" spacing={3}>
                  <EventStats
                    name="ETHDenver 2025"
                    date="Mar 1-3"
                    crewNeeded={8}
                    crewHired={3}
                  />
                  <EventStats
                    name="Web3 Summit"
                    date="Apr 15-17"
                    crewNeeded={12}
                    crewHired={0}
                  />
                  <EventStats
                    name="Blockchain Week"
                    date="May 5-7"
                    crewNeeded={15}
                    crewHired={7}
                  />
                </VStack>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  period: string;
}

const StatCard = ({ title, value, change, period }: StatCardProps) => {
  const isPositive = change.startsWith('+');

  return (
    <Card bg="carbon.800" borderColor="carbon.700" borderWidth={1}>
      <CardBody>
        <VStack align="stretch" spacing={2}>
          <Text color="gray.500">{title}</Text>
          <Heading size="lg">{value}</Heading>
          <HStack>
            <Text color={isPositive ? 'green.500' : 'red.500'}>{change}</Text>
            <Text color="gray.500" fontSize="sm">{period}</Text>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

interface RoleStatsProps {
  role: string;
  count: number;
  total: number;
}

const RoleStats = ({ role, count, total }: RoleStatsProps) => {
  const percentage = Math.round((count / total) * 100);

  return (
    <HStack justify="space-between">
      <Text>{role}</Text>
      <HStack spacing={4}>
        <Text color="gray.500">{count} applications</Text>
        <Text color="green.500">{percentage}%</Text>
      </HStack>
    </HStack>
  );
};

interface EventStatsProps {
  name: string;
  date: string;
  crewNeeded: number;
  crewHired: number;
}

const EventStats = ({ name, date, crewNeeded, crewHired }: EventStatsProps) => {
  const percentage = Math.round((crewHired / crewNeeded) * 100);

  return (
    <HStack justify="space-between">
      <VStack align="start" spacing={0}>
        <Text>{name}</Text>
        <Text fontSize="sm" color="gray.500">{date}</Text>
      </VStack>
      <HStack spacing={4}>
        <Text color="gray.500">{crewHired}/{crewNeeded} crew</Text>
        <Text color="green.500">{percentage}%</Text>
      </HStack>
    </HStack>
  );
};
