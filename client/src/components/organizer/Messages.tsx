import React from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Avatar, Divider } from '@chakra-ui/react';

export const Messages = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Messages</Heading>
          <Text color="gray.500">Your conversations with production crew members</Text>
        </Box>

        <VStack spacing={4} align="stretch">
          <MessagePreview
            name="John Smith"
            role="Camera Operator"
            message="I'm interested in working at ETHDenver 2025..."
            time="1h ago"
            unread
          />
          <Divider borderColor="carbon.700" />
          <MessagePreview
            name="Sarah Johnson"
            role="Sound Engineer"
            message="Thank you for the offer. I've reviewed the contract..."
            time="3h ago"
            unread
          />
          <Divider borderColor="carbon.700" />
          <MessagePreview
            name="Mike Wilson"
            role="Lighting Technician"
            message="Here's my portfolio and availability for the event..."
            time="1d ago"
          />
        </VStack>
      </VStack>
    </Container>
  );
};

interface MessagePreviewProps {
  name: string;
  role: string;
  message: string;
  time: string;
  unread?: boolean;
}

const MessagePreview = ({ name, role, message, time, unread }: MessagePreviewProps) => {
  return (
    <HStack spacing={4} p={4} bg={unread ? 'carbon.800' : 'transparent'} borderRadius="md">
      <Avatar name={name} bg="green.500" />
      <Box flex={1}>
        <HStack justify="space-between" mb={1}>
          <Box>
            <Text fontWeight={unread ? 'bold' : 'normal'}>{name}</Text>
            <Text fontSize="sm" color="green.500">{role}</Text>
          </Box>
          <Text fontSize="sm" color="gray.500">{time}</Text>
        </HStack>
        <Text color="gray.400" noOfLines={1}>{message}</Text>
      </Box>
    </HStack>
  );
};
