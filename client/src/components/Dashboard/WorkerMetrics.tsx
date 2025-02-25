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
  accentColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  label, 
  value, 
  helpText, 
  change,
  accentColor = 'brand.primary'
}) => {
  const bgColor = useColorModeValue('monokai.800', 'monokai.900');
  const borderColor = useColorModeValue('monokai.700', 'monokai.600');
  const labelColor = useColorModeValue('gray.400', 'gray.500');

  return (
    <Box 
      p={5} 
      bg={bgColor} 
      rounded="lg" 
      borderWidth="1px" 
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '4px',
        height: '100%',
        bg: accentColor,
      }}
    >
      <Stat>
        <StatLabel fontSize="sm" color={labelColor}>{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold" color={accentColor}>{value}</StatNumber>
        {(helpText || change !== undefined) && (
          <StatHelpText>
            {change !== undefined && (
              <StatArrow 
                type={change >= 0 ? 'increase' : 'decrease'} 
                color={change >= 0 ? 'brand.success' : 'brand.error'}
              />
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
      accentColor: 'brand.info'
    },
    {
      label: 'Completed Tasks',
      value: 28,
      helpText: 'Last 24 hours',
      change: 8,
      accentColor: 'brand.success'
    },
    {
      label: 'Success Rate',
      value: '96.5%',
      helpText: 'Last 7 days',
      change: 2.3,
      accentColor: 'brand.primary'
    },
    {
      label: 'Earnings',
      value: '1.45 ETH',
      helpText: 'This month',
      change: 15.4,
      accentColor: 'brand.secondary'
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
