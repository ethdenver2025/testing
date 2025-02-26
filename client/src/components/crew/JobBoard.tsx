import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Badge, 
  Button, 
  VStack, 
  HStack, 
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  Tooltip,
  Progress,
  useColorModeValue,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Divider
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiBriefcase, 
  FiMapPin, 
  FiCalendar, 
  FiDollarSign, 
  FiStar, 
  FiFilter,
  FiInfo,
  FiBookmark,
  FiClock
} from 'react-icons/fi';

// Mock data for demo purposes
const mockJobs = [
  {
    id: '1',
    title: 'Camera Operator',
    event: 'ETHDenver 2025',
    location: 'Denver, CO',
    date: 'Mar 1-3, 2025',
    rate: '$500/day',
    skills: ['Video Production', 'Live Streaming', 'Equipment Management'],
    matchScore: 94,
    deadline: '2 days left',
    saved: false
  },
  {
    id: '2',
    title: 'Sound Engineer',
    event: 'Web3 Summit',
    location: 'Miami, FL',
    date: 'Apr 15-17, 2025',
    rate: '$450/day',
    skills: ['Audio Mixing', 'Audio Equipment', 'Stage Sound'],
    matchScore: 88,
    deadline: '5 days left',
    saved: true
  },
  {
    id: '3',
    title: 'Lighting Technician',
    event: 'Blockchain Week',
    location: 'New York, NY',
    date: 'May 10-12, 2025',
    rate: '$400/day',
    skills: ['Stage Lighting', 'Lighting Design', 'DMX Programming'],
    matchScore: 76,
    deadline: '1 week left',
    saved: false
  },
  {
    id: '4',
    title: 'Stage Manager',
    event: 'Decentralized Tomorrow',
    location: 'Austin, TX',
    date: 'Jun 5-7, 2025',
    rate: '$550/day',
    skills: ['Event Coordination', 'Team Leadership', 'Time Management'],
    matchScore: 82,
    deadline: '2 weeks left',
    saved: false
  },
  {
    id: '5',
    title: 'Video Editor',
    event: 'NFT Conference 2025',
    location: 'Los Angeles, CA',
    date: 'Jul 20-22, 2025',
    rate: '$475/day',
    skills: ['Video Editing', 'Color Grading', 'Motion Graphics'],
    matchScore: 91,
    deadline: '3 weeks left',
    saved: true
  },
];

export const JobBoard = () => {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const openJobDetails = (job: typeof mockJobs[0]) => {
    setSelectedJob(job);
    onOpen();
  };

  const toggleSaveJob = (id: string) => {
    setJobs(jobs.map(job => 
      job.id === id ? { ...job, saved: !job.saved } : job
    ));
    
    // Also update selected job if it's the one being toggled
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({
        ...selectedJob,
        saved: !selectedJob.saved
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap">
          <Box>
            <Heading size="lg" mb={2}>AI-Recommended Jobs</Heading>
            <Text color="gray.500">Personalized matches based on your skills and reputation</Text>
          </Box>
          
          <HStack spacing={4} mt={{ base: 4, md: 0 }}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color="gray.300" />
              </InputLeftElement>
              <Input placeholder="Search for jobs" />
            </InputGroup>
            
            <IconButton
              aria-label="Filter jobs"
              icon={<FiFilter />}
              variant="outline"
            />
          </HStack>
        </Flex>

        <Tabs variant="soft-rounded" colorScheme="green">
          <TabList>
            <Tab>All Jobs</Tab>
            <Tab>Recommended</Tab>
            <Tab>Saved</Tab>
            <Tab>Applied</Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {jobs.map(job => (
                  <JobCard 
                    key={job.id}
                    job={job}
                    onViewDetails={() => openJobDetails(job)}
                    onToggleSave={() => toggleSaveJob(job.id)}
                  />
                ))}
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {jobs
                  .filter(job => job.matchScore >= 80)
                  .sort((a, b) => b.matchScore - a.matchScore)
                  .map(job => (
                    <JobCard 
                      key={job.id}
                      job={job}
                      onViewDetails={() => openJobDetails(job)}
                      onToggleSave={() => toggleSaveJob(job.id)}
                    />
                  ))
                }
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {jobs
                  .filter(job => job.saved)
                  .map(job => (
                    <JobCard 
                      key={job.id}
                      job={job}
                      onViewDetails={() => openJobDetails(job)}
                      onToggleSave={() => toggleSaveJob(job.id)}
                    />
                  ))
                }
              </SimpleGrid>
            </TabPanel>
            
            <TabPanel px={0}>
              <Box textAlign="center" py={10}>
                <Text>You haven't applied to any jobs yet.</Text>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Job Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedJob?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedJob && (
              <VStack align="stretch" spacing={4}>
                <HStack>
                  <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                    {selectedJob.event}
                  </Badge>
                  <Badge colorScheme="purple" px={2} py={1} borderRadius="md">
                    {selectedJob.rate}
                  </Badge>
                </HStack>

                <HStack spacing={4}>
                  <HStack>
                    <FiMapPin />
                    <Text>{selectedJob.location}</Text>
                  </HStack>
                  <HStack>
                    <FiCalendar />
                    <Text>{selectedJob.date}</Text>
                  </HStack>
                </HStack>

                <Box>
                  <Heading size="sm" mb={2}>Job Description</Heading>
                  <Text>
                    We're looking for an experienced {selectedJob.title} to join our production team for {selectedJob.event}. 
                    This is a temporary position for the duration of the event. The ideal candidate has experience in blockchain/web3 events 
                    and can work in a fast-paced environment.
                  </Text>
                </Box>

                <Box>
                  <Heading size="sm" mb={2}>Required Skills</Heading>
                  <HStack flexWrap="wrap">
                    {selectedJob.skills.map((skill, index) => (
                      <Tag key={index} colorScheme="blue" mb={2}>
                        {skill}
                      </Tag>
                    ))}
                  </HStack>
                </Box>

                <HStack>
                  <FiClock />
                  <Text fontWeight="bold">Application Deadline:</Text>
                  <Text>{selectedJob.deadline}</Text>
                </HStack>

                <Box pt={2}>
                  <Heading size="sm" mb={2}>AI Match Score</Heading>
                  <Tooltip label={`${selectedJob.matchScore}% match with your skills and experience`}>
                    <Box>
                      <Progress 
                        value={selectedJob.matchScore} 
                        colorScheme={selectedJob.matchScore > 85 ? "green" : selectedJob.matchScore > 70 ? "blue" : "orange"}
                        borderRadius="md"
                        height="10px"
                        mb={1}
                      />
                      <Text fontSize="sm" textAlign="right">{selectedJob.matchScore}% Match</Text>
                    </Box>
                  </Tooltip>
                </Box>

                <Divider />

                <Box>
                  <Heading size="sm" mb={2}>Payment Details</Heading>
                  <Text>Payment will be made in USDC via blockchain escrow after successful completion of the job.</Text>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <HStack spacing={4}>
              <Button 
                variant="outline" 
                leftIcon={<FiBookmark />}
                onClick={() => selectedJob && toggleSaveJob(selectedJob.id)}
              >
                {selectedJob?.saved ? "Unsave" : "Save"}
              </Button>
              <Button colorScheme="green">Apply Now</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

interface JobCardProps {
  job: typeof mockJobs[0];
  onViewDetails: () => void;
  onToggleSave: () => void;
}

const JobCard = ({ job, onViewDetails, onToggleSave }: JobCardProps) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const cardBorder = useColorModeValue('gray.200', 'gray.600');
  
  return (
    <Card 
      border="1px" 
      borderColor={cardBorder} 
      bg={cardBg}
      boxShadow="sm"
      _hover={{ 
        boxShadow: 'md',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out'
      }}
      transition="all 0.2s ease-in-out"
    >
      <CardBody>
        <VStack align="stretch" spacing={4}>
          <HStack justifyContent="space-between">
            <Heading size="md">{job.title}</Heading>
            <IconButton
              aria-label={job.saved ? "Unsave job" : "Save job"}
              icon={<FiBookmark />}
              variant={job.saved ? "solid" : "outline"}
              colorScheme={job.saved ? "green" : "gray"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave();
              }}
            />
          </HStack>
          
          <HStack>
            <Badge colorScheme="blue">{job.event}</Badge>
            <Badge colorScheme="purple">{job.rate}</Badge>
          </HStack>

          <VStack align="stretch" spacing={2}>
            <HStack>
              <FiMapPin size={14} />
              <Text fontSize="sm">{job.location}</Text>
            </HStack>
            <HStack>
              <FiCalendar size={14} />
              <Text fontSize="sm">{job.date}</Text>
            </HStack>
            <HStack>
              <FiClock size={14} />
              <Text fontSize="sm">{job.deadline}</Text>
            </HStack>
          </VStack>

          <Box>
            <HStack mb={1}>
              <FiStar color="gold" />
              <Text fontWeight="medium" fontSize="sm">AI Match Score</Text>
              <Tooltip label="Based on your skills and reputation">
                <Box as="span">
                  <FiInfo size={14} />
                </Box>
              </Tooltip>
            </HStack>
            <Progress 
              value={job.matchScore} 
              colorScheme={job.matchScore > 85 ? "green" : job.matchScore > 70 ? "blue" : "orange"}
              borderRadius="md"
              size="sm"
              mb={1}
            />
            <Text fontSize="xs" textAlign="right">{job.matchScore}%</Text>
          </Box>

          <Button onClick={onViewDetails} colorScheme="green" size="sm">
            View Details
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};
