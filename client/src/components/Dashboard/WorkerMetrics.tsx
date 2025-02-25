import React from 'react';
import {
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

interface MetricCardProps {
  label: string;
  value: string | number;
  helpText?: string;
  change?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, helpText, change }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box p={5} bg={bgColor} rounded="lg" borderWidth="1px" borderColor={borderColor} shadow="sm">
      <Stat>
        <StatLabel fontSize="sm" color="gray.500">{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
        {(helpText || change !== undefined) && (
          <StatHelpText>
            {change !== undefined && (
              <StatArrow type={change >= 0 ? 'increase' : 'decrease'} />
            )}
            {change !== undefined ? `${Math.abs(change)}% ` : ''}
            {helpText}
          </StatHelpText>
        )}
      </Stat>
    </Box>
  );
};

export const WorkerMetrics: React.FC = () => {
  const metrics = [
    {
      label: 'Active Tasks',
      value: 3,
      helpText: 'Currently running',
      change: 12,
    },
    {
      label: 'Completed Tasks',
      value: 28,
      helpText: 'Last 24 hours',
      change: 8,
    },
    {
      label: 'Success Rate',
      value: '96.5%',
      helpText: 'Last 7 days',
      change: 2.3,
    },
    {
      label: 'Earnings',
      value: '1.45 ETH',
      helpText: 'This month',
      change: 15.4,
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </SimpleGrid>
  );
};

export default WorkerMetrics;
