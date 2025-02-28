import React from 'react';
import {
  Box,
  Tooltip,
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Icon,
  Text,
  HStack,
} from '@chakra-ui/react';
import { FaShieldAlt, FaQuestion, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface TrustBadgeProps {
  trustScore: number | null;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  attestationCount?: number;
}

const TrustBadge: React.FC<TrustBadgeProps> = ({
  trustScore,
  size = 'md',
  showLabel = false,
  attestationCount = 0,
}) => {
  // Determine sizes based on the size prop
  const dimensions = {
    sm: { circleSize: '32px', thickness: '3px', fontSize: 'xs', iconSize: 10 },
    md: { circleSize: '45px', thickness: '4px', fontSize: 'sm', iconSize: 12 },
    lg: { circleSize: '60px', thickness: '5px', fontSize: 'md', iconSize: 16 },
  };

  const { circleSize, thickness, fontSize, iconSize } = dimensions[size];

  // Get color based on trust score
  const getColor = (score: number | null) => {
    if (score === null) return 'gray.500';
    if (score >= 90) return 'green.500';
    if (score >= 70) return 'blue.500';
    if (score >= 50) return 'yellow.500';
    return 'red.500';
  };

  // Get description based on trust score
  const getDescription = (score: number | null) => {
    if (score === null) return 'Trust score not available yet';
    if (score >= 90) return 'Highly trusted crew member with excellent attestations';
    if (score >= 70) return 'Well-trusted crew member with good attestations';
    if (score >= 50) return 'Moderately trusted crew member';
    return 'New or unproven crew member - proceed with caution';
  };

  // Get icon based on trust score
  const getIcon = (score: number | null) => {
    if (score === null) return FaQuestion;
    if (score >= 70) return FaCheckCircle;
    if (score >= 50) return FaShieldAlt;
    return FaExclamationTriangle;
  };

  const color = getColor(trustScore);
  const description = getDescription(trustScore);
  const Icon = getIcon(trustScore);

  return (
    <Tooltip
      label={
        <Box p={2}>
          <Text fontWeight="bold">
            {trustScore ? `Trust Score: ${Math.round(trustScore)}%` : 'No Trust Score Yet'}
          </Text>
          <Text fontSize="sm">{description}</Text>
          {attestationCount > 0 && (
            <Text fontSize="xs" mt={1}>
              Based on {attestationCount} attestation{attestationCount !== 1 ? 's' : ''}
            </Text>
          )}
        </Box>
      }
      placement="top"
      hasArrow
    >
      <Box>
        <CircularProgress
          value={trustScore || 0}
          color={color}
          size={circleSize}
          thickness={thickness}
        >
          <CircularProgressLabel>
            {showLabel ? (
              <Text fontSize={fontSize} fontWeight="bold">
                {trustScore ? Math.round(trustScore) : '?'}
              </Text>
            ) : (
              <Box color={color}>
                <Icon as={Icon} fontSize={iconSize} />
              </Box>
            )}
          </CircularProgressLabel>
        </CircularProgress>
      </Box>
    </Tooltip>
  );
};

export default TrustBadge;
