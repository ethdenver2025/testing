import React from 'react';
import {
  SimpleGrid,
  Box,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiCpu, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ComponentType;
  change?: number;
  helpText?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  change,
  helpText,
}) => {
  const bgColor = useColorModeValue('monokai.800', 'monokai.900');
  const borderColor = useColorModeValue('monokai.700', 'monokai.600');
  const iconColor = useColorModeValue('brand.primary', 'brand.secondary');

  return (
    <Box
      p={5}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={2}
        right={2}
        opacity={0.3}
      >
        <Icon as={icon} boxSize={8} color={iconColor} />
      </Box>
      <Stat>
        <StatLabel fontSize="sm" opacity={0.8}>{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
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

export const DashboardStats: React.FC = () => {
  const stats = [
    {
      label: 'Active Tasks',
      value: 12,
      icon: FiCpu,
      change: 8,
      helpText: 'From last hour',
    },
    {
      label: 'Total Earnings',
      value: '2.45 ETH',
      icon: FiDollarSign,
      change: 12,
      helpText: 'This month',
    },
    {
      label: 'Success Rate',
      value: '98.5%',
      icon: FiCheckCircle,
      change: 3,
      helpText: 'Last 7 days',
    },
    {
      label: 'Avg. Response Time',
      value: '1.2s',
      icon: FiClock,
      change: -5,
      helpText: 'Last 24 hours',
    },
  ];

  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </SimpleGrid>
  );
};
