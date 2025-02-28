import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Box,
  Flex,
  Text,
  Heading,
  Divider,
  SimpleGrid,
  IconButton,
  useToast,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FiPlus, FiX, FiDollarSign, FiEdit2 } from 'react-icons/fi';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: any) => void;
}

interface CrewPosition {
  title: string;
  description: string;
  skills: string[];
  payRate: number;
  quantity: number;
  isRequired: boolean;
}

const CreateEventModal: React.FC<CreateEventModalProps> = ({ isOpen, onClose, onEventCreated }) => {
  const toast = useToast();
  const { user } = useAuth();
  
  // Event form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number | undefined>(undefined);
  
  // Crew positions state
  const [crewPositions, setCrewPositions] = useState<CrewPosition[]>([]);
  const [currentPosition, setCurrentPosition] = useState<CrewPosition>({
    title: '',
    description: '',
    skills: [],
    payRate: 0,
    quantity: 1,
    isRequired: true
  });
  const [currentSkill, setCurrentSkill] = useState('');
  const [positionErrors, setPositionErrors] = useState({
    title: false,
    payRate: false
  });
  
  // Form errors state
  const [errors, setErrors] = useState({
    title: false,
    location: false,
    startDate: false,
    endDate: false,
    dateOrder: false,
  });
  
  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setBudget(undefined);
    setCrewPositions([]);
    setCurrentPosition({
      title: '',
      description: '',
      skills: [],
      payRate: 0,
      quantity: 1,
      isRequired: true
    });
    setCurrentSkill('');
    setErrors({
      title: false,
      location: false,
      startDate: false,
      endDate: false,
      dateOrder: false,
    });
    setPositionErrors({ title: false, payRate: false });
  };
  
  // Add a skill to the current position
  const addSkill = () => {
    if (currentSkill.trim() && !currentPosition.skills.includes(currentSkill.trim())) {
      setCurrentPosition({
        ...currentPosition,
        skills: [...currentPosition.skills, currentSkill.trim()]
      });
      setCurrentSkill('');
    }
  };
  
  // Remove a skill from the current position
  const removeSkill = (skillToRemove: string) => {
    setCurrentPosition({
      ...currentPosition,
      skills: currentPosition.skills.filter(skill => skill !== skillToRemove)
    });
  };
  
  // Add current position to crew positions list
  const addPosition = () => {
    // Validate position fields
    const newPositionErrors = {
      title: currentPosition.title.trim() === '',
      payRate: currentPosition.payRate <= 0
    };
    
    setPositionErrors(newPositionErrors);
    
    if (!newPositionErrors.title && !newPositionErrors.payRate) {
      setCrewPositions([...crewPositions, { ...currentPosition }]);
      setCurrentPosition({
        title: '',
        description: '',
        skills: [],
        payRate: 0,
        quantity: 1,
        isRequired: true
      });
      // Reset position errors after successful add
      setPositionErrors({ title: false, payRate: false });
    }
  };
  
  // Remove a position from the crew positions list
  const removePosition = (index: number) => {
    setCrewPositions(crewPositions.filter((_, i) => i !== index));
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {
      title: title.trim() === '',
      location: location.trim() === '',
      startDate: startDate === '',
      endDate: endDate === '',
      dateOrder: new Date(startDate) > new Date(endDate)
    };
    
    setErrors(newErrors);
    
    return !Object.values(newErrors).some(Boolean);
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Form has errors',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the user from auth context to check if logged in
      if (!user) {
        throw new Error('You must be logged in to create an event');
      }
      
      // Since we're using the auth context, we might not have a traditional token
      // Let's create a temporary token for development
      const tempAuthHeader = {
        Authorization: `Bearer dev-token-${user.username}`
      };
      
      const eventData = {
        title,
        description,
        location,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        budget: budget || 0,
        crewPositions: crewPositions.length > 0 ? crewPositions : undefined
      };
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/api/events`,
        eventData,
        {
          headers: tempAuthHeader
        }
      );
      
      toast({
        title: 'Event created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onEventCreated(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error creating event',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Event Details Section */}
            <Box>
              <Heading size="sm" mb={4}>Event Details</Heading>
              
              <FormControl isRequired isInvalid={errors.title} mb={4}>
                <FormLabel>Event Title</FormLabel>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter event title"
                />
                {errors.title && (
                  <FormErrorMessage>Event title is required</FormErrorMessage>
                )}
              </FormControl>
              
              <FormControl mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter event description"
                  rows={3}
                />
              </FormControl>
              
              <FormControl isRequired isInvalid={errors.location} mb={4}>
                <FormLabel>Location</FormLabel>
                <Input 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter event location"
                />
                {errors.location && (
                  <FormErrorMessage>Location is required</FormErrorMessage>
                )}
              </FormControl>
              
              <SimpleGrid columns={2} spacing={4} mb={4}>
                <FormControl isRequired isInvalid={errors.startDate}>
                  <FormLabel>Start Date</FormLabel>
                  <Input 
                    type="datetime-local" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  {errors.startDate && (
                    <FormErrorMessage>Start date is required</FormErrorMessage>
                  )}
                </FormControl>
                
                <FormControl isRequired isInvalid={errors.endDate || errors.dateOrder}>
                  <FormLabel>End Date</FormLabel>
                  <Input 
                    type="datetime-local" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  {errors.endDate && (
                    <FormErrorMessage>End date is required</FormErrorMessage>
                  )}
                  {errors.dateOrder && (
                    <FormErrorMessage>End date must be after start date</FormErrorMessage>
                  )}
                </FormControl>
              </SimpleGrid>
              
              <FormControl mb={4}>
                <FormLabel>Event Budget</FormLabel>
                <InputGroup>
                  <InputRightElement pointerEvents="none">
                    <FiDollarSign color="gray.300" />
                  </InputRightElement>
                  <NumberInput min={0} precision={2} value={budget} onChange={(valueString) => setBudget(parseFloat(valueString))}>
                    <NumberInputField 
                      placeholder="Enter budget amount"
                    />
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </Box>
            
            <Divider />
            
            {/* Crew Positions Section */}
            <Box>
              <Heading size="sm" mb={4}>Crew Positions</Heading>
              <Text fontSize="sm" color="gray.600" mb={4}>
                Define the roles you need for your event. Add details about each position's requirements, 
                compensation, and skills needed.
              </Text>
              
              {/* Added positions list */}
              {crewPositions.length > 0 && (
                <Box mb={4} p={3} borderWidth="1px" borderRadius="md" bg="gray.700" color="white">
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontWeight="medium">Added Positions:</Text>
                    <Text fontSize="sm" color="gray.300">{crewPositions.length} position(s)</Text>
                  </Flex>
                  <VStack align="stretch" spacing={2}>
                    {crewPositions.map((position, index) => (
                      <Flex key={index} justify="space-between" align="center" p={3} bg="gray.600" borderRadius="md">
                        <VStack align="start" spacing={0}>
                          <Flex align="center">
                            <Text fontWeight="medium">{position.title}</Text>
                            {position.isRequired && (
                              <Tag size="sm" colorScheme="red" ml={2}>Required</Tag>
                            )}
                          </Flex>
                          <Text fontSize="sm" color="gray.300">
                            ${position.payRate}/hr · {position.quantity} needed
                          </Text>
                          {position.skills.length > 0 && (
                            <Flex mt={1} wrap="wrap" gap={1}>
                              {position.skills.map((skill, i) => (
                                <Tag key={i} size="sm" colorScheme="blue" variant="solid">
                                  {skill}
                                </Tag>
                              ))}
                            </Flex>
                          )}
                          {position.description && (
                            <Text fontSize="xs" color="gray.300" mt={1}>
                              {position.description.length > 120 
                                ? `${position.description.substring(0, 120)}...` 
                                : position.description}
                            </Text>
                          )}
                        </VStack>
                        <HStack>
                          <IconButton
                            aria-label="Edit position"
                            icon={<FiEdit2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="gray"
                            onClick={() => {
                              setCurrentPosition(position);
                              removePosition(index);
                            }}
                          />
                          <IconButton
                            aria-label="Remove position"
                            icon={<FiX />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => removePosition(index)}
                          />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
              
              {/* Add new position form */}
              <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.700" color="white">
                <Heading size="xs" mb={3}>Add New Position</Heading>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormControl isInvalid={positionErrors.title}>
                    <FormLabel fontSize="sm">Title *</FormLabel>
                    <Input 
                      size="sm"
                      value={currentPosition.title}
                      onChange={(e) => setCurrentPosition({ ...currentPosition, title: e.target.value })}
                      placeholder="e.g. Camera Operator"
                      bg="gray.600"
                      _hover={{ bg: "gray.500" }}
                      borderColor="gray.500"
                    />
                    {positionErrors.title && (
                      <FormErrorMessage>Title is required</FormErrorMessage>
                    )}
                  </FormControl>
                  
                  <FormControl isInvalid={positionErrors.payRate}>
                    <FormLabel fontSize="sm">Pay Rate ($/hr) *</FormLabel>
                    <NumberInput 
                      size="sm"
                      min={0} 
                      precision={2} 
                      value={currentPosition.payRate}
                      onChange={(valueString) => setCurrentPosition({ 
                        ...currentPosition, 
                        payRate: parseFloat(valueString) 
                      })}
                    >
                      <NumberInputField 
                        placeholder="e.g. 25.00" 
                        bg="gray.600"
                        _hover={{ bg: "gray.500" }}
                        borderColor="gray.500"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="gray.300" />
                        <NumberDecrementStepper color="gray.300" />
                      </NumberInputStepper>
                    </NumberInput>
                    {positionErrors.payRate && (
                      <FormErrorMessage>Pay rate must be greater than 0</FormErrorMessage>
                    )}
                  </FormControl>
                </SimpleGrid>
                
                <FormControl mb={4}>
                  <FormLabel fontSize="sm">Description</FormLabel>
                  <Textarea 
                    size="sm"
                    value={currentPosition.description}
                    onChange={(e) => setCurrentPosition({ ...currentPosition, description: e.target.value })}
                    placeholder="Describe the responsibilities and requirements"
                    rows={2}
                    bg="gray.600"
                    _hover={{ bg: "gray.500" }}
                    borderColor="gray.500"
                  />
                </FormControl>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="sm">Number Needed</FormLabel>
                    <NumberInput 
                      size="sm"
                      min={1} 
                      max={20} 
                      value={currentPosition.quantity}
                      onChange={(valueString) => setCurrentPosition({ 
                        ...currentPosition, 
                        quantity: parseInt(valueString) 
                      })}
                    >
                      <NumberInputField 
                        bg="gray.600"
                        _hover={{ bg: "gray.500" }}
                        borderColor="gray.500"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper color="gray.300" />
                        <NumberDecrementStepper color="gray.300" />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize="sm">Position Status</FormLabel>
                    <HStack>
                      <input 
                        type="checkbox" 
                        id="isRequired" 
                        checked={currentPosition.isRequired}
                        onChange={(e) => setCurrentPosition({
                          ...currentPosition,
                          isRequired: e.target.checked
                        })}
                      />
                      <Text fontSize="sm" htmlFor="isRequired" as="label">
                        This position is required for the event
                      </Text>
                    </HStack>
                  </FormControl>
                </SimpleGrid>
                
                <FormControl mb={4}>
                  <FormLabel fontSize="sm">Required Skills</FormLabel>
                  <HStack mb={2}>
                    <Input 
                      size="sm"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      placeholder="Add a skill"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      bg="gray.600"
                      _hover={{ bg: "gray.500" }}
                      borderColor="gray.500"
                    />
                    <Button 
                      size="sm" 
                      onClick={addSkill}
                      colorScheme="blue"
                    >
                      Add
                    </Button>
                  </HStack>
                  {currentPosition.skills.length > 0 ? (
                    <Flex wrap="wrap" gap={2} mt={2}>
                      {currentPosition.skills.map((skill, index) => (
                        <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                          <TagLabel>{skill}</TagLabel>
                          <TagCloseButton onClick={() => removeSkill(skill)} />
                        </Tag>
                      ))}
                    </Flex>
                  ) : (
                    <Text fontSize="xs" color="gray.400">No skills added yet. Add skills that are needed for this position.</Text>
                  )}
                </FormControl>
                
                <Flex justify="space-between">
                  <Button 
                    onClick={() => {
                      setCurrentPosition({
                        title: '',
                        description: '',
                        skills: [],
                        payRate: 0,
                        quantity: 1,
                        isRequired: true
                      });
                      setPositionErrors({ title: false, payRate: false });
                    }} 
                    size="sm" 
                    variant="outline"
                    colorScheme="gray"
                    borderColor="gray.500"
                    _hover={{ bg: "gray.600" }}
                  >
                    Clear
                  </Button>
                  <Button 
                    onClick={addPosition} 
                    leftIcon={<FiPlus />} 
                    size="sm" 
                    colorScheme="green"
                  >
                    Add Position
                  </Button>
                </Flex>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button 
            colorScheme="green" 
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText="Creating"
          >
            Create Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventModal;
