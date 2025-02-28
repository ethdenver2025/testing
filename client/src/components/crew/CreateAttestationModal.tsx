import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Text,
  Flex,
  VStack,
  HStack,
  Tooltip,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';
import { attestationService } from '../../services/attestationService';

interface CreateAttestationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  recipientName: string;
  eventId?: string;
  onAttestationCreated?: () => void;
}

export const CreateAttestationModal: React.FC<CreateAttestationModalProps> = ({
  isOpen,
  onClose,
  recipientId,
  recipientName,
  eventId,
  onAttestationCreated,
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  // Skill attestation state
  const [skill, setSkill] = useState('');
  const [skillRating, setSkillRating] = useState(3);
  const [skillComments, setSkillComments] = useState('');

  // Work ethic attestation state
  const [reliability, setReliability] = useState(3);
  const [teamwork, setTeamwork] = useState(3);
  const [professionalism, setProfessionalism] = useState(3);
  const [ethicComments, setEthicComments] = useState('');

  const handleSkillAttestation = async () => {
    if (!skill) {
      toast({
        title: 'Skill required',
        description: 'Please enter a skill to attest',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await attestationService.createSkillAttestation(
        recipientId,
        skill,
        skillRating,
        skillComments,
        eventId
      );

      toast({
        title: 'Attestation created',
        description: `Skill attestation for ${recipientName} created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      resetForm();
      onClose();
      if (onAttestationCreated) {
        onAttestationCreated();
      }
    } catch (error: any) {
      toast({
        title: 'Error creating attestation',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkEthicAttestation = async () => {
    try {
      setIsSubmitting(true);
      await attestationService.createWorkEthicAttestation(
        recipientId,
        reliability,
        teamwork,
        professionalism,
        ethicComments,
        eventId
      );

      toast({
        title: 'Attestation created',
        description: `Work ethic attestation for ${recipientName} created successfully`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      resetForm();
      onClose();
      if (onAttestationCreated) {
        onAttestationCreated();
      }
    } catch (error: any) {
      toast({
        title: 'Error creating attestation',
        description: error.response?.data?.error || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSkill('');
    setSkillRating(3);
    setSkillComments('');
    setReliability(3);
    setTeamwork(3);
    setProfessionalism(3);
    setEthicComments('');
  };

  const handleSubmit = () => {
    if (tabIndex === 0) {
      handleSkillAttestation();
    } else {
      handleWorkEthicAttestation();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="gray.800" color="white">
        <ModalHeader>Create Attestation for {recipientName}</ModalHeader>
        <ModalCloseButton />

        <Tabs isFitted variant="solid-rounded" colorScheme="blue" index={tabIndex} onChange={setTabIndex}>
          <TabList mb="1em">
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Skill</Tab>
            <Tab _selected={{ bg: 'blue.500', color: 'white' }}>Work Ethic</Tab>
          </TabList>

          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box p={3} borderRadius="md" bg="gray.700">
                <Text fontSize="sm">
                  You are creating an on-chain attestation that will be permanently
                  recorded. This will help build {recipientName}'s reputation in the community.
                </Text>
              </Box>

              <TabPanels>
                {/* Skill Attestation Panel */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Skill</FormLabel>
                      <Input
                        placeholder="e.g. Camera Operation, Sound Engineering"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
                        bg="gray.700"
                        border="none"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <Flex justify="space-between" align="center">
                        <FormLabel mb={0}>Skill Rating</FormLabel>
                        <Tooltip label="1 = Beginner, 5 = Expert">
                          <IconButton
                            aria-label="Rating info"
                            icon={<FaQuestionCircle />}
                            size="xs"
                            variant="ghost"
                            borderRadius="base"
                          />
                        </Tooltip>
                      </Flex>
                      <NumberInput
                        min={1}
                        max={5}
                        value={skillRating}
                        onChange={(value) => setSkillRating(parseInt(value))}
                      >
                        <NumberInputField bg="gray.700" border="none" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>

                      <Text mt={2} fontSize="sm" color="gray.400">
                        {skillRating === 1 && 'Beginner - Basic understanding'}
                        {skillRating === 2 && 'Novice - Some practical experience'}
                        {skillRating === 3 && 'Intermediate - Competent with supervision'}
                        {skillRating === 4 && 'Advanced - Works independently with skill'}
                        {skillRating === 5 && 'Expert - Mastery of the skill'}
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <Textarea
                        placeholder="Add specific details about their skill level or examples of their work"
                        value={skillComments}
                        onChange={(e) => setSkillComments(e.target.value)}
                        bg="gray.700"
                        border="none"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>

                {/* Work Ethic Attestation Panel */}
                <TabPanel p={0}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <Flex justify="space-between" align="center">
                        <FormLabel mb={0}>Reliability</FormLabel>
                        <Tooltip label="1 = Poor, 5 = Excellent">
                          <IconButton
                            aria-label="Rating info"
                            icon={<FaQuestionCircle />}
                            size="xs"
                            variant="ghost"
                            borderRadius="base"
                          />
                        </Tooltip>
                      </Flex>
                      <NumberInput
                        min={1}
                        max={5}
                        value={reliability}
                        onChange={(value) => setReliability(parseInt(value))}
                      >
                        <NumberInputField bg="gray.700" border="none" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text mt={1} fontSize="sm" color="gray.400">
                        Punctuality, dependability, meeting deadlines
                      </Text>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Teamwork</FormLabel>
                      <NumberInput
                        min={1}
                        max={5}
                        value={teamwork}
                        onChange={(value) => setTeamwork(parseInt(value))}
                      >
                        <NumberInputField bg="gray.700" border="none" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text mt={1} fontSize="sm" color="gray.400">
                        Collaboration, communication, attitude
                      </Text>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Professionalism</FormLabel>
                      <NumberInput
                        min={1}
                        max={5}
                        value={professionalism}
                        onChange={(value) => setProfessionalism(parseInt(value))}
                      >
                        <NumberInputField bg="gray.700" border="none" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Text mt={1} fontSize="sm" color="gray.400">
                        Work quality, ethics, problem-solving
                      </Text>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Comments (Optional)</FormLabel>
                      <Textarea
                        placeholder="Add specific observations about their work ethic"
                        value={ethicComments}
                        onChange={(e) => setEthicComments(e.target.value)}
                        bg="gray.700"
                        border="none"
                      />
                    </FormControl>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose} borderRadius="base">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              borderRadius="base"
            >
              Create Attestation
            </Button>
          </ModalFooter>
        </Tabs>
      </ModalContent>
    </Modal>
  );
};

export default CreateAttestationModal;
