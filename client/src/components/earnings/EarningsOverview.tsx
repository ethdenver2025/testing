import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface EarningData {
  date: string;
  amount: number;
  currency: string;
  jobCount: number;
}

export interface EarningsOverviewProps {
  data: EarningData[];
}

export const EarningsOverview: React.FC<EarningsOverviewProps> = ({ data }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const chartColor = useColorModeValue('#3182CE', '#63B3ED');

  const totalEarnings = data.reduce((sum, entry) => sum + entry.amount, 0);
  const totalJobs = data.reduce((sum, entry) => sum + entry.jobCount, 0);

  return (
    <Box
      p={6}
      bg={bgColor}
      borderRadius="lg"
      borderWidth={1}
      borderColor={borderColor}
    >
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <VStack align="start" spacing={1}>
            <Heading size="md">Earnings Overview</Heading>
            <Text color="gray.600">Your recent earnings activity</Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold">
              ${totalEarnings.toLocaleString()}
            </Text>
            <Text color="gray.600">{totalJobs} jobs completed</Text>
          </VStack>
        </HStack>

        <Box h="300px">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) =>
                  `$${value.toLocaleString()}`
                }
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={chartColor}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </VStack>
    </Box>
  );
};
