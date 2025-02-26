import React from 'react';
import { Box, Container, Heading, Text, VStack, HStack, Avatar, Divider } from '@chakra-ui/react';

export const Messages = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Messages</Heading>
          <Text color="gray.500">Your conversations with event organizers</Text>
        </Box>

        <VStack spacing={4} align="stretch">
          <MessagePreview
            name="ETHDenver Team"
            message="Thanks for applying! We'd like to schedule an interview..."
            time="2h ago"
            unread
          />
          <Divider borderColor="carbon.700" />
          <MessagePreview
            name="Web3 Summit"
            message="Your application has been received. We'll review it shortly..."
            time="1d ago"
          />
          <Divider borderColor="carbon.700" />
          <MessagePreview
            name="Blockchain Week"
            message="Contract details have been sent. Please review and sign..."
            time="2d ago"
          />
        </VStack>
      </VStack>
    </Container>
  );
};

interface MessagePreviewProps {
  name: string;
  message: string;
  time: string;
  unread?: boolean;
}

const MessagePreview = ({ name, message, time, unread }: MessagePreviewProps) => {
  return (
    <HStack spacing={4} p={4} bg={unread ? 'carbon.800' : 'transparent'} borderRadius="md">
      <Avatar name={name} bg="green.500" />
      <Box flex={1}>
        <HStack justify="space-between" mb={1}>
          <Text fontWeight={unread ? 'bold' : 'normal'}>{name}</Text>
          <Text fontSize="sm" color="gray.500">{time}</Text>
        </HStack>
        <Text color="gray.400" noOfLines={1}>{message}</Text>
      </Box>
    </HStack>
  );
};
