import React from 'react';
import { Box, Container, Heading, Text, SimpleGrid, Card, CardBody, Badge, Button, VStack, HStack } from '@chakra-ui/react';

export const JobBoard = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Available Jobs</Heading>
          <Text color="gray.500">Find and apply for production crew positions</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {/* Sample job cards - replace with real data */}
          <JobCard
            title="Camera Operator"
            event="ETHDenver 2025"
            location="Denver, CO"
            date="Mar 1-3, 2025"
            rate="$500/day"
          />
          <JobCard
            title="Sound Engineer"
            event="Web3 Summit"
            location="Miami, FL"
            date="Apr 15-17, 2025"
            rate="$450/day"
          />
          <JobCard
            title="Lighting Technician"
            event="Blockchain Week"
            location="New York, NY"
            date="May 5-7, 2025"
            rate="$400/day"
          />
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

interface JobCardProps {
  title: string;
  event: string;
  location: string;
  date: string;
  rate: string;
}

const JobCard = ({ title, event, location, date, rate }: JobCardProps) => {
  return (
    <Card bg="carbon.800" borderColor="carbon.700" borderWidth={1}>
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <Box>
            <Heading size="md" mb={2}>{title}</Heading>
            <Text color="gray.400">{event}</Text>
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
              <Text color="gray.500">Rate</Text>
              <Badge colorScheme="green">{rate}</Badge>
            </HStack>
          </VStack>

          <Button colorScheme="green" size="sm">
            Apply Now
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
