import React from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Flex,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { Card, Title } from '@tremor/react';

interface CompletedJob {
  id: string;
  title: string;
  client: string;
  completedDate: string;
  payment: {
    amount: number;
    currency: string;
  };
  rating: number;
  feedback?: string;
  status: 'completed' | 'disputed' | 'cancelled';
}

interface JobHistoryProps {
  jobs: CompletedJob[];
}

export const JobHistory: React.FC<JobHistoryProps> = ({ jobs }) => {
  const getStatusColor = (status: CompletedJob['status']) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'disputed':
        return 'orange';
      case 'cancelled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  return (
    <Card>
      <Title>Job History</Title>
      <VStack spacing={4} align="stretch" mt={4}>
        {jobs.map((job) => (
          <Box
            key={job.id}
            p={4}
            borderWidth={1}
            borderRadius="lg"
            _hover={{ bg: 'gray.50' }}
          >
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontWeight="bold">{job.title}</Text>
              <Badge colorScheme={getStatusColor(job.status)}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </Flex>
            
            <Flex justify="space-between" mb={2}>
              <Text color="gray.600">Client: {job.client}</Text>
              <Text>{formatDate(job.completedDate)}</Text>
            </Flex>

            <Flex justify="space-between" mb={2}>
              <Text>Payment</Text>
              <Text fontWeight="bold">
                {formatCurrency(job.payment.amount, job.payment.currency)}
              </Text>
            </Flex>

            <Box mb={2}>
              <Text mb={1}>Rating</Text>
              <Flex align="center">
                <Progress
                  value={job.rating * 20}
                  colorScheme="yellow"
                  size="sm"
                  flex={1}
                  mr={2}
                />
                <Text>{job.rating}/5</Text>
              </Flex>
            </Box>

            {job.feedback && (
              <>
                <Divider my={2} />
                <Text fontSize="sm" color="gray.600">
                  "{job.feedback}"
                </Text>
              </>
            )}
          </Box>
        ))}

        {jobs.length === 0 && (
          <Box textAlign="center" py={8} color="gray.500">
            No completed jobs yet
          </Box>
        )}
      </VStack>
    </Card>
  );
};
