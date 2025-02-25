import React from 'react';
import {
  Box,
  Skeleton,
  SkeletonText,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

export const TaskLoadingState: React.FC = () => {
  const bgColor = useColorModeValue('monokai.800', 'monokai.900');
  const borderColor = useColorModeValue('monokai.700', 'monokai.600');

  return (
    <Box
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
    >
      <Stack spacing={4}>
        <Box display="flex" gap={4} mb={4}>
          <Skeleton height="36px" width="200px" />
          <Skeleton height="36px" width="150px" />
          <Skeleton height="36px" width="150px" />
        </Box>

        <Box>
          <Stack spacing={4}>
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor={borderColor}
              >
                <Stack spacing={3}>
                  <Box display="flex" justifyContent="space-between">
                    <SkeletonText noOfLines={1} width="200px" />
                    <Skeleton height="24px" width="100px" />
                  </Box>
                  <Box display="flex" gap={4}>
                    <SkeletonText noOfLines={1} width="150px" />
                    <SkeletonText noOfLines={1} width="100px" />
                    <SkeletonText noOfLines={1} width="120px" />
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};
