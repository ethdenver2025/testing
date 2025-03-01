import React from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  Link,
  SimpleGrid,
  Divider,
  Badge,
  Spacer,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import FormicaryLogo from '../components/FormicaryLogo';
import { FaUsers, FaCalendarAlt, FaWallet, FaUserCircle, FaCertificate, FaShieldAlt, FaLock, FaRocket } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

interface FeatureProps {
  title: string;
  text: string;
  icon: React.ReactElement;
}

const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack
      bg="#1E1E1E"
      rounded={'xl'}
      p={6}
      spacing={4}
      height="100%"
      borderWidth="1px"
      borderColor="#333333"
      _hover={{
        borderColor: '#2979FF',
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      transition="all 0.3s"
    >
      <Flex
        w={16}
        h={16}
        align={'center'}
        justify={'center'}
        color={'white'}
        rounded={'full'}
        bg={'#2979FF'}
        mb={1}
      >
        {icon}
      </Flex>
      <Heading fontSize={'xl'} color="#E0E0E0">{title}</Heading>
      <Text color={'#A0A0A0'} fontSize={'sm'}>
        {text}
      </Text>
    </Stack>
  );
};

export const LandingPage = () => {
  const { user } = useAuth();
  const bgGradient = 'linear(to-r, #2979FF, #607D8B)';

  return (
    <Box bg="#121212" color="#E0E0E0">
      {/* Header */}
      <Box 
        position="sticky" 
        top={0}
        py={4} 
        borderBottom="1px solid"
        borderColor="#333333"
        bg="#121212"
        zIndex={100}
      >
        <Container maxW={'7xl'}>
          <Flex align="center">
            <HStack spacing={2}>
              <FormicaryLogo width="32px" height="32px" color="#2979FF" />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="#E0E0E0"
              >
                Formicary<Text as="span" color="#2979FF">.app</Text>
              </Text>
            </HStack>
            <Spacer />
            <Button as={RouterLink} to="/login" colorScheme="blue" size="lg" mr={4}>
              Login
            </Button>
            <Button as={RouterLink} to="/test-payment" colorScheme="green" size="lg" mr={4}>
              Test Payment
            </Button>
            <Button as={RouterLink} to="/simple-test" colorScheme="purple" size="lg">
              Simple Test
            </Button>
          </Flex>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box
        position="relative"
        height={{ base: 'auto', md: '100vh' }}
        minHeight="600px"
        overflow="hidden"
        bg="#121212"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient={bgGradient}
          opacity={0.15}
          zIndex={-1}
        />

        <Container maxW={'7xl'} py={{ base: 20, md: 36 }}>
          <Stack
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }} color="#E0E0E0">
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '3xl', lg: '5xl' }}
              >
                <Text as={'span'}>
                  Revolutionizing On-Demand
                </Text>
                <br />
                <Text as={'span'} color={'#2979FF'}>
                  Workforce Management
                </Text>
              </Heading>
              <Text color={'#A0A0A0'} fontSize="xl">
                Formicary connects skilled workers with projects through a transparent, 
                decentralized platform. Built on a robust web-of-trust reputation system 
                with secure USDC payments.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to={user ? '/login' : '/signup'}
                  rounded={'base'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  minW="140px"
                  colorScheme={'blue'}
                  bg={'#2979FF'}
                  _hover={{ bg: '#82B1FF' }}
                >
                  {user ? 'Go to Login' : 'Get Started'}
                </Button>
                <Button
                  as={RouterLink}
                  to="/about"
                  rounded={'base'}
                  size={'lg'}
                  fontWeight={'normal'}
                  px={6}
                  minW="140px"
                  leftIcon={<FaRocket />}
                  variant="outline"
                  color="#E0E0E0"
                  borderColor="#333333"
                  _hover={{
                    bg: 'rgba(41, 121, 255, 0.1)',
                    borderColor: '#2979FF',
                  }}
                >
                  Learn More
                </Button>
              </Stack>
              <HStack spacing={4}>
                <Badge colorScheme="blue" px={3} py={1} borderRadius="full" bg="#2979FF">
                  Web3-Powered
                </Badge>
                <Badge colorScheme="cyan" px={3} py={1} borderRadius="full" bg="#00B8D4">
                  Secure Payments
                </Badge>
                <Badge colorScheme="gray" px={3} py={1} borderRadius="full" bg="#607D8B">
                  Reputation System
                </Badge>
              </HStack>
            </Stack>
            <Flex
              flex={1}
              justify={'center'}
              align={'center'}
              position={'relative'}
              w={'full'}
              display={{ base: 'flex', md: 'flex' }}
            >
              <Box
                position={'relative'}
                height={'400px'}
                width={'full'}
                overflow={'hidden'}
                borderRadius="xl"
                boxShadow="2xl"
              >
                <Image
                  alt={'Production crew building LED wall'}
                  fit={'cover'}
                  align={'center'}
                  w={'100%'}
                  h={'100%'}
                  src={
                    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80'
                  }
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW={'7xl'} py={16}>
        <Box textAlign="center" mb={16}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
            lineHeight={'110%'}
            mb={6}
          >
            <Text as={'span'} color={'#2979FF'}>
              Features
            </Text>{' '}
            that make us different
          </Heading>
          <Text
            color={'#A0A0A0'}
            fontSize="xl"
            maxW="3xl"
            mx="auto"
          >
            Formicary is a decentralized labor coordination platform revolutionizing on-demand workforce management
            across corporate events, film production, construction, and disaster response industries.
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={10}>
          <Feature
            icon={<Icon as={FaUsers} w={10} h={10} />}
            title={'Trusted Crew Network'}
            text={'Connect with verified, skilled professionals that match your project requirements through our web-of-trust system.'}
          />
          <Feature
            icon={<Icon as={FaCalendarAlt} w={10} h={10} />}
            title={'Smart Job Matching'}
            text={'AI-driven matching optimizes workforce allocation based on skills, location, availability, and past performance.'}
          />
          <Feature
            icon={<Icon as={FaWallet} w={10} h={10} />}
            text={'Transparent bidding process with secure USDC escrow payments. Get paid for your work on time, every time.'}
            title={'Secure Payments'}
          />
          <Feature
            icon={<Icon as={FaCertificate} w={10} h={10} />}
            title={'Skill Attestations'}
            text={'Advance through peer-validated skill assessments and build your professional reputation through verified attestations.'}
          />
        </SimpleGrid>
      </Container>

      {/* How It Works */}
      <Box bg="#1E1E1E" py={16}>
        <Container maxW={'7xl'}>
          <Box textAlign="center" mb={16}>
            <Heading
              fontWeight={600}
              fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
              lineHeight={'110%'}
              mb={6}
            >
              How{' '}
              <Text as={'span'} color={'#2979FF'}>
                Formicary
              </Text>{' '}
              Works
            </Heading>
            <Text
              color={'#A0A0A0'}
              fontSize="xl"
              maxW="3xl"
              mx="auto"
            >
              Our platform connects organizers with skilled crew members through a simple, transparent process
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
            <VStack
              align={'center'}
              spacing={6}
              p={6}
              bg={'#252525'}
              rounded={'xl'}
              boxShadow={'md'}
            >
              <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'#2979FF'}
                mb={1}
              >
                <Text fontWeight="bold" fontSize="xl">1</Text>
              </Flex>
              <Text fontWeight={600} fontSize={'xl'}>
                Create Your Profile
              </Text>
              <Text color={'#A0A0A0'} textAlign="center">
                Sign up and create your profile, specifying your skills, experience, and availability.
              </Text>
            </VStack>

            <VStack
              align={'center'}
              spacing={6}
              p={6}
              bg={'#252525'}
              rounded={'xl'}
              boxShadow={'md'}
            >
              <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'#2979FF'}
                mb={1}
              >
                <Text fontWeight="bold" fontSize="xl">2</Text>
              </Flex>
              <Text fontWeight={600} fontSize={'xl'}>
                Connect & Get Matched
              </Text>
              <Text color={'#A0A0A0'} textAlign="center">
                Browse events or get automatically matched with projects based on your skills and reputation.
              </Text>
            </VStack>

            <VStack
              align={'center'}
              spacing={6}
              p={6}
              bg={'#252525'}
              rounded={'xl'}
              boxShadow={'md'}
            >
              <Flex
                w={16}
                h={16}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}
                bg={'#2979FF'}
                mb={1}
              >
                <Text fontWeight="bold" fontSize="xl">3</Text>
              </Flex>
              <Text fontWeight={600} fontSize={'xl'}>
                Work & Get Paid
              </Text>
              <Text color={'#A0A0A0'} textAlign="center">
                Complete jobs, earn attestations, and receive secure payments through our escrow system.
              </Text>
            </VStack>
          </SimpleGrid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxW={'5xl'} py={16}>
        <Box textAlign="center" mb={16}>
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl', md: '5xl' }}
            lineHeight={'110%'}
            mb={6}
          >
            What{' '}
            <Text as={'span'} color={'#2979FF'}>
              Users
            </Text>{' '}
            Say
          </Heading>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          <Box
            p={8}
            bg={'#1E1E1E'}
            rounded={'xl'}
            boxShadow={'md'}
            position="relative"
          >
            <Icon
              as={FaUserCircle}
              position="absolute"
              top={-8}
              left={8}
              w={16}
              h={16}
              color="#2979FF"
              bg={"#1E1E1E"}
              rounded="full"
              p={1}
            />
            <Text fontSize="lg" mb={4} pt={6}>
              "As a production manager, finding reliable crew members used to be my biggest challenge. Formicary has completely changed that. Now I can quickly find trusted professionals with verified skills."
            </Text>
            <Text fontWeight="bold">Sarah J.</Text>
            <Text color="#A0A0A0" fontSize="sm">Production Manager</Text>
          </Box>

          <Box
            p={8}
            bg={'#1E1E1E'}
            rounded={'xl'}
            boxShadow={'md'}
            position="relative"
          >
            <Icon
              as={FaUserCircle}
              position="absolute"
              top={-8}
              left={8}
              w={16}
              h={16}
              color="#2979FF"
              bg={"#1E1E1E"}
              rounded="full"
              p={1}
            />
            <Text fontSize="lg" mb={4} pt={6}>
              "I've been able to build a steady career as a freelance cameraman thanks to Formicary. The skill attestations have helped me prove my expertise, and I'm getting better jobs with higher pay."
            </Text>
            <Text fontWeight="bold">Michael T.</Text>
            <Text color="#A0A0A0" fontSize="sm">Freelance Cameraman</Text>
          </Box>
        </SimpleGrid>
      </Container>

      {/* CTA Section */}
      <Box bg="#252525" py={16}>
        <Container maxW={'5xl'} textAlign="center">
          <Heading
            fontWeight={600}
            fontSize={{ base: '2xl', sm: '4xl' }}
            lineHeight={'110%'}
            mb={6}
          >
            Ready to transform how you{' '}
            <Text as={'span'} color={'#2979FF'}>
              work
            </Text>
            ?
          </Heading>
          <Text color={'#A0A0A0'} fontSize="xl" mb={8}>
            Join our growing community of organizers and crew members today.
          </Text>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={4}
            justify="center"
          >
            <Button
              as={RouterLink}
              to={user ? '/login' : '/signup'}
              rounded={'base'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              minW="180px"
              colorScheme={'blue'}
              bg={'#2979FF'}
              _hover={{ bg: '#82B1FF' }}
            >
              {user ? 'Go to Login' : 'Get Started for Free'}
            </Button>
            <Button
              as={RouterLink}
              to="/contact"
              rounded={'base'}
              size={'lg'}
              fontWeight={'normal'}
              px={6}
              minW="140px"
              variant="outline"
              colorScheme="blue"
              color="#E0E0E0"
              borderColor="#333333"
              _hover={{
                bg: 'rgba(41, 121, 255, 0.1)',
                borderColor: '#2979FF',
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="#121212">
        <Container maxW={'7xl'} py={10} textAlign="center">
          <VStack spacing={3}>
            <FormicaryLogo width="40px" height="40px" color="#2979FF" />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="#E0E0E0"
            >
              Formicary<Text as="span" color="#2979FF">.app</Text>
            </Text>
            <Text fontSize={'sm'} color={'#A0A0A0'}>
              &copy; {new Date().getFullYear()} Formicary. All rights reserved.
            </Text>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
