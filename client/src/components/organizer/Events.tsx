import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, Button, VStack, HStack, Badge } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

export const Events = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Box>
            <Heading size="lg" mb={2}>My Events</Heading>
            <Text color="gray.500">Manage your events and crew assignments</Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="green">
            Create Event
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          <EventCard
            title="ETHDenver 2025"
            location="Denver, CO"
            date="Mar 1-3, 2025"
            crewNeeded={8}
            crewHired={3}
          />
          <EventCard
            title="Web3 Summit"
            location="Miami, FL"
            date="Apr 15-17, 2025"
            crewNeeded={12}
            crewHired={0}
          />
          <EventCard
            title="Blockchain Week"
            location="New York, NY"
            date="May 5-7, 2025"
            crewNeeded={15}
            crewHired={7}
          />
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

interface EventCardProps {
  title: string;
  location: string;
  date: string;
  crewNeeded: number;
  crewHired: number;
}

const EventCard = ({ title, location, date, crewNeeded, crewHired }: EventCardProps) => {
  const progress = (crewHired / crewNeeded) * 100;
  const status = crewHired === crewNeeded ? 'complete' : 'in-progress';

  return (
    <Card bg="carbon.800" borderColor="carbon.700" borderWidth={1}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Heading size="md" mb={2}>{title}</Heading>
            <Badge colorScheme={status === 'complete' ? 'green' : 'yellow'}>
              {status === 'complete' ? 'Crew Complete' : 'Hiring Crew'}
            </Badge>
          </Box>
          
          <VStack align="stretch" spacing={2}>
            <HStack justify="space-between">
              <Text color="gray.500">Location</Text>
              <Text>{location}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.500">Date</Text>
              <Text>{date}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color="gray.500">Crew</Text>
              <Text>{crewHired} / {crewNeeded} hired</Text>
            </HStack>
          </VStack>

          <Button colorScheme="green" size="sm">
            Manage Event
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
