import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Avatar,
  Text,
  Badge,
  HStack,
  VStack,
  LinkBox,
  LinkOverlay,
  useColorModeValue,
  Tag,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import TrustBadge from './TrustBadge';

interface CrewCardProps {
  id: string;
  name: string;
  avatar?: string;
  skills: string[];
  bio?: string;
  trustScore: number | null;
  attestationCount?: number;
  topRatedSkill?: {
    name: string;
    rating: number;
  };
}

const CrewCard: React.FC<CrewCardProps> = ({
  id,
  name,
  avatar,
  skills,
  bio,
  trustScore,
  attestationCount = 0,
  topRatedSkill,
}) => {
  const bgColor = useColorModeValue('gray.700', 'gray.800');
  const borderColor = useColorModeValue('gray.600', 'gray.700');
  const hoverBg = useColorModeValue('gray.600', 'gray.700');

  return (
    <LinkBox
      as="article"
      p={4}
      borderRadius="lg"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      transition="all 0.2s"
      _hover={{
        bg: hoverBg,
        transform: 'translateY(-2px)',
        boxShadow: 'lg',
      }}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Flex justify="space-between" mb={3}>
        <HStack spacing={3}>
          <Avatar
            size="md"
            name={name}
            src={avatar}
            bg="blue.500"
          />
          <Box>
            <LinkOverlay as={RouterLink} to={`/crew/${id}`}>
              <Text fontWeight="bold" fontSize="lg" color="white">
                {name}
              </Text>
            </LinkOverlay>
          </Box>
        </HStack>

        <TrustBadge
          trustScore={trustScore}
          size="md"
          showLabel={true}
          attestationCount={attestationCount}
        />
      </Flex>

      {bio && (
        <Text
          color="gray.300"
          fontSize="sm"
          noOfLines={2}
          mb={4}
          flex="1"
        >
          {bio}
        </Text>
      )}

      {/* Skills tags */}
      <Box mt={2}>
        <Wrap spacing={2}>
          {skills.map((skill) => (
            <WrapItem key={skill}>
              <Badge
                colorScheme="blue"
                px={2}
                py={1}
                borderRadius="full"
                fontSize="xs"
              >
                {skill}
              </Badge>
            </WrapItem>
          ))}
        </Wrap>
      </Box>

      {/* Top rated skill if available */}
      {topRatedSkill && (
        <Box mt={3}>
          <Tag
            size="sm"
            variant="subtle"
            colorScheme="green"
            borderRadius="full"
          >
            <Text fontSize="xs">
              Top skill: {topRatedSkill.name} ({topRatedSkill.rating}/5)
            </Text>
          </Tag>
        </Box>
      )}

      {/* Attestation info */}
      {attestationCount > 0 && (
        <Text fontSize="xs" color="gray.400" mt={3}>
          {attestationCount} attestation{attestationCount !== 1 ? 's' : ''}
        </Text>
      )}
    </LinkBox>
  );
};

export default CrewCard;
