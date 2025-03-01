import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';

const Messages: React.FC = () => {
  return (
    <Box p={5}>
      <Heading mb={4}>Messages</Heading>
      <Text>This page will display your messages.</Text>
    </Box>
  );
};

export default Messages;
