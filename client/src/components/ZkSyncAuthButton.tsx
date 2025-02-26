import React from 'react';
import { Button, Text, VStack, useToast } from '@chakra-ui/react';
import { useZkSyncAuth } from '../hooks/useZkSyncAuth';

export const ZkSyncAuthButton: React.FC = () => {
  const { connect, disconnect, isConnected, isLoading, address } = useZkSyncAuth();
  const toast = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: 'Connected!',
        description: 'Successfully connected with zkSync SSO',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast({
      title: 'Disconnected',
      description: 'Wallet disconnected successfully',
      status: 'info',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={4}>
      {isConnected ? (
        <>
          <Text>Connected: {address?.slice(0, 6)}...{address?.slice(-4)}</Text>
          <Button
            colorScheme="red"
            onClick={handleDisconnect}
          >
            Disconnect
          </Button>
        </>
      ) : (
        <Button
          colorScheme="blue"
          onClick={handleConnect}
          isLoading={isLoading}
          loadingText="Connecting..."
        >
          Connect with zkSync
        </Button>
      )}
    </VStack>
  );
};
