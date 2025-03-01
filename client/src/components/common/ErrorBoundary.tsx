import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Heading, Text, Button, Code, VStack } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    // Force a hard reload of the page
    window.location.reload();
  };

  public render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return fallback || (
        <Box 
          p={8} 
          m="auto" 
          mt={10} 
          maxW="800px" 
          borderWidth={1} 
          borderRadius="lg" 
          boxShadow="lg" 
          bg="white"
        >
          <VStack spacing={4} align="stretch">
            <Heading color="red.500">Something went wrong</Heading>
            <Text>We encountered an error while rendering this component.</Text>
            
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold">Error:</Text>
              <Code p={2} display="block" whiteSpace="pre-wrap" borderRadius="md">
                {error && error.toString()}
              </Code>
              
              {errorInfo && (
                <>
                  <Text fontWeight="bold" mt={4}>Component Stack:</Text>
                  <Code p={2} display="block" whiteSpace="pre-wrap" borderRadius="md">
                    {errorInfo.componentStack}
                  </Code>
                </>
              )}
            </Box>
            
            <Button 
              colorScheme="blue" 
              onClick={this.handleRetry}
              alignSelf="flex-start"
              mt={4}
            >
              Retry
            </Button>
          </VStack>
        </Box>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
