import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Button,
  Text,
  Heading,
  useToast,
  Spinner,
  Flex,
  HStack,
  VStack,
  Badge,
  useDisclosure
} from '@chakra-ui/react';
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiMapPin, FiClipboard, FiChevronDown } from 'react-icons/fi';
import { eventManagementService } from '../../services/eventManagementService';

// Using the same event type from the Events component
interface Event {
  id: string;
  title: string;
  location: string;
  date: string;
  crewNeeded: number;
  crewHired: number;
  status: string;
  roles: string[];
  budget: number;
  applicants: number;
  daysLeft: number;
  description?: string;
}

interface ManageEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event | null;
}

const ManageEventModal = ({ isOpen, onClose, event }: ManageEventModalProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    if (isOpen && event) {
      setLoading(true);
      // Simulate loading delay
      const timer = setTimeout(() => {
        setLoading(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, event]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxW="1200px" maxH="90vh" overflow="auto">
        <ModalHeader>
          {loading ? 'Loading Event...' : `Managing: ${event?.title || 'Event'}`}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {loading ? (
            <Flex justify="center" align="center" h="300px">
              <Spinner size="xl" />
            </Flex>
          ) : event ? (
            <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
              <TabList>
                <Tab>Overview</Tab>
                <Tab>Crew</Tab>
                <Tab>Call Times</Tab>
                <Tab>Payments</Tab>
              </TabList>
              
              <TabPanels>
                {/* Overview Tab */}
                <TabPanel>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md">Event Details</Heading>
                    <Text><strong>Location:</strong> {event.location}</Text>
                    <Text><strong>Date:</strong> {event.date}</Text>
                    <Text><strong>Budget:</strong> ${event.budget.toLocaleString()}</Text>
                    <Text><strong>Crew:</strong> {event.crewHired} / {event.crewNeeded} hired</Text>
                    
                    <Box mt={2}>
                      <Heading size="sm" mb={2}>Roles Needed:</Heading>
                      <HStack>
                        {event.roles.map((role, index) => (
                          <Badge key={index} colorScheme="blue" mr={2}>
                            {role}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                    
                    <HStack mt={2}>
                      <Badge colorScheme={event.status === 'Cancelled' ? 'red' : 'green'}>
                        {event.status}
                      </Badge>
                    </HStack>
                    
                    <Button colorScheme="blue" onClick={onClose} mt={4}>
                      Done
                    </Button>
                  </VStack>
                </TabPanel>
                
                {/* Crew Tab */}
                <TabPanel>
                  <Heading size="md">Crew Management</Heading>
                  <Text mt={4}>Manage your event crew here.</Text>
                  <Text mt={2}>Hire, assign roles, and monitor your production team.</Text>
                  <Button colorScheme="green" mt={4}>Add Crew Member</Button>
                </TabPanel>
                
                {/* Call Times Tab */}
                <TabPanel>
                  <Heading size="md">Call Times</Heading>
                  <Text mt={4}>Manage event schedule and crew call times.</Text>
                  <Button colorScheme="green" mt={4}>Add Call Time</Button>
                </TabPanel>
                
                {/* Payments Tab */}
                <TabPanel>
                  <Heading size="md">Payments</Heading>
                  <Text mt={4}>Track and manage crew payments and event budget.</Text>
                  <Button colorScheme="green" mt={4}>Process Payment</Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Text>No event data found.</Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ManageEventModal;
