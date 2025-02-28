import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Avatar, 
  Divider, 
  Input, 
  Button, 
  Flex, 
  Badge, 
  IconButton,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Tooltip,
  useColorModeValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Card,
  CardBody,
  Icon,
  Select,
} from '@chakra-ui/react';
import { FiSend, FiPaperclip, FiMic, FiMoreVertical, FiSearch, FiFilter, FiChevronDown, FiStar, FiArchive, FiTrash2, FiUsers, FiCalendar, FiBell } from 'react-icons/fi';

export const Messages = () => {
  // State for active conversation
  const [activeConversation, setActiveConversation] = useState<string | null>('1');
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const borderColor = useColorModeValue('gray.600', 'gray.600');
  
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: "ETHDenver Team",
      role: "Organizer",
      lastMessage: "Thanks for applying! We'd like to schedule an interview...",
      time: "2h ago",
      unread: true,
      avatar: "https://bit.ly/sage-adebayo",
      event: "ETHDenver 2025",
      messages: [
        { id: '1-1', sender: 'ETHDenver', text: "Hello, thank you for applying to our Camera Operator position for ETHDenver 2025.", time: '9:00 AM', date: 'Yesterday' },
        { id: '1-2', sender: 'me', text: "Thank you for considering my application. I'm very excited about the opportunity to work with your team.", time: '9:30 AM', date: 'Yesterday' },
        { id: '1-3', sender: 'ETHDenver', text: "Your portfolio looks impressive! We'd like to schedule an interview with you next week. Are you available on Tuesday at 2 PM?", time: '10:45 AM', date: 'Yesterday' },
      ]
    },
    {
      id: '2',
      name: "Web3 Summit",
      role: "Organizer",
      lastMessage: "Your application has been received. We'll review it shortly...",
      time: "1d ago",
      unread: false,
      avatar: "https://bit.ly/ryan-florence",
      event: "Web3 Summit",
      messages: [
        { id: '2-1', sender: 'Web3 Summit', text: "Thank you for applying to our Sound Engineer position for the Web3 Summit.", time: '2:15 PM', date: '2 days ago' },
        { id: '2-2', sender: 'me', text: "I appreciate the opportunity. Please let me know if you need any additional information from me.", time: '3:00 PM', date: '2 days ago' },
        { id: '2-3', sender: 'Web3 Summit', text: "Your application has been received. We'll review it and get back to you shortly.", time: '4:30 PM', date: '2 days ago' },
      ]
    },
    {
      id: '3',
      name: "DeFi Conference",
      role: "Organizer",
      lastMessage: "We've reviewed your application and would like to...",
      time: "3d ago",
      unread: false,
      avatar: "https://bit.ly/code-beast",
      event: "DeFi Conference",
      messages: [
        { id: '3-1', sender: 'DeFi Conference', text: "Hello, we're looking for experienced camera operators for our upcoming conference.", time: '10:00 AM', date: '3 days ago' },
        { id: '3-2', sender: 'me', text: "I'm interested! I have over 5 years of experience in event videography.", time: '11:30 AM', date: '3 days ago' },
        { id: '3-3', sender: 'DeFi Conference', text: "Great! We've reviewed your profile and would like to discuss the details. Can we schedule a call?", time: '1:45 PM', date: '3 days ago' },
      ]
    }
  ]);

  // Get current conversation
  const currentConversation = conversations.find(conv => conv.id === activeConversation);

  // Send a message
  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;
    
    const updatedConversations = conversations.map(conv => {
      if (conv.id === activeConversation) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: `${conv.id}-${conv.messages.length + 1}`,
              sender: 'me',
              text: messageText,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              date: 'Today'
            }
          ],
          lastMessage: messageText,
          time: 'Just now'
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setMessageText('');
  };

  const filterOptions = ["All Messages", "Unread", "Important", "Archived"];
  const [filterType, setFilterType] = useState("All Messages");

  const eventOptions = ["All Events", "ETHDenver 2025", "Web3 Summit", "DeFi Conference"];
  const [eventFilter, setEventFilter] = useState("All Events");

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Box>
            <Heading size="lg" mb={2}>Messages</Heading>
            <Text color="gray.500">Communication with event organizers</Text>
          </Box>
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input placeholder="Search messages..." />
            </InputGroup>
            <Button colorScheme="blue" borderRadius="base">New Message</Button>
          </HStack>
        </Flex>

        <Card>
          <CardBody p={0}>
            <Flex h="70vh">
              {/* Left sidebar - conversation list */}
              <Box w="300px" borderRightWidth="1px" borderColor={borderColor} h="full" overflowY="auto">
                <VStack spacing={0} align="stretch">
                  <HStack p={4} borderBottomWidth="1px" borderColor={borderColor} justify="space-between">
                    <Select 
                      size="sm" 
                      maxW="150px" 
                      value={filterType} 
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      {filterOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                    <Select 
                      size="sm" 
                      maxW="150px" 
                      value={eventFilter} 
                      onChange={(e) => setEventFilter(e.target.value)}
                    >
                      {eventOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </Select>
                  </HStack>
                  
                  {conversations.map(conv => (
                    <Box 
                      key={conv.id}
                      p={4}
                      cursor="pointer"
                      bg={activeConversation === conv.id ? "blue.800" : "transparent"}
                      _hover={{ bg: activeConversation === conv.id ? "blue.800" : "gray.800" }}
                      borderBottomWidth="1px"
                      borderColor={borderColor}
                      onClick={() => setActiveConversation(conv.id)}
                    >
                      <HStack spacing={3} align="start">
                        <Avatar size="md" name={conv.name} src={conv.avatar} />
                        <Box flex="1" overflow="hidden">
                          <HStack justify="space-between" mb={1}>
                            <Heading size="sm" noOfLines={1}>{conv.name}</Heading>
                            <Text fontSize="xs" color="gray.500">{conv.time}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.500" mb={1}>{conv.role}</Text>
                          <HStack mb={1}>
                            <Badge size="sm" colorScheme="blue">{conv.event}</Badge>
                            {conv.unread && <Badge colorScheme="red">New</Badge>}
                          </HStack>
                          <Text fontSize="sm" color="gray.600" noOfLines={1}>
                            {conv.lastMessage}
                          </Text>
                        </Box>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
              
              {/* Right side - message area */}
              <Box flex="1" display="flex" flexDirection="column">
                {currentConversation ? (
                  <>
                    {/* Header */}
                    <Flex 
                      p={4} 
                      alignItems="center" 
                      justifyContent="space-between" 
                      borderBottomWidth="1px" 
                      borderColor={borderColor}
                    >
                      <HStack>
                        <Avatar size="sm" name={currentConversation.name} src={currentConversation.avatar} />
                        <Box>
                          <Heading size="sm">{currentConversation.name}</Heading>
                          <HStack>
                            <Text fontSize="xs" color="gray.500">{currentConversation.role}</Text>
                            <Badge size="sm" colorScheme="blue">{currentConversation.event}</Badge>
                          </HStack>
                        </Box>
                      </HStack>
                      
                      <HStack spacing={2}>
                        <Tooltip label="Mark as important">
                          <IconButton 
                            icon={<FiStar />} 
                            aria-label="Mark as important" 
                            variant="ghost" 
                            size="sm" 
                            borderRadius="base"
                          />
                        </Tooltip>
                        <Tooltip label="Archive conversation">
                          <IconButton 
                            icon={<FiArchive />} 
                            aria-label="Archive conversation" 
                            variant="ghost" 
                            size="sm" 
                            borderRadius="base"
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton 
                            as={IconButton} 
                            icon={<FiMoreVertical />} 
                            variant="ghost" 
                            size="sm"
                            aria-label="More options" 
                            borderRadius="base"
                          />
                          <MenuList>
                            <MenuItem icon={<FiUsers />}>View Profile</MenuItem>
                            <MenuItem icon={<FiCalendar />}>Schedule Meeting</MenuItem>
                            <MenuItem icon={<FiBell />}>Mute Notifications</MenuItem>
                            <MenuItem icon={<FiTrash2 />} color="red.500">Delete Conversation</MenuItem>
                          </MenuList>
                        </Menu>
                      </HStack>
                    </Flex>
                    
                    {/* Messages */}
                    <Box flex="1" overflowY="auto" p={4} bg={useColorModeValue("gray.900", "gray.900")}>
                      {currentConversation.messages.map((message, index) => {
                        const isMe = message.sender === 'me';
                        const isFirstInGroup = index === 0 || currentConversation.messages[index - 1].sender !== message.sender;
                        const showDate = index === 0 || message.date !== currentConversation.messages[index - 1].date;
                        
                        return (
                          <Box key={message.id}>
                            {showDate && (
                              <Text 
                                textAlign="center" 
                                fontSize="xs" 
                                color="gray.500" 
                                my={4}
                              >
                                {message.date}
                              </Text>
                            )}
                            
                            <Flex justify={isMe ? "flex-end" : "flex-start"} mb={4}>
                              {!isMe && isFirstInGroup && (
                                <Avatar 
                                  size="sm" 
                                  name={currentConversation.name}
                                  src={currentConversation.avatar}
                                  mr={2}
                                />
                              )}
                              {!isMe && !isFirstInGroup && <Box w="32px" mr={2} />}
                              
                              <Box>
                                {isFirstInGroup && !isMe && (
                                  <Text fontSize="xs" color="gray.500" mb={1}>{currentConversation.name}</Text>
                                )}
                                <Box
                                  bg={isMe ? "blue.500" : "gray.700"}
                                  color={isMe ? "white" : "gray.100"}
                                  borderRadius="lg"
                                  px={4}
                                  py={2}
                                  maxW="80%"
                                  borderWidth={!isMe ? "1px" : "0"}
                                  borderColor="gray.600"
                                  boxShadow="dark-lg"
                                >
                                  <Text>{message.text}</Text>
                                </Box>
                                <Text fontSize="xs" color="gray.500" mt={1} textAlign={isMe ? "right" : "left"}>
                                  {message.time}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>
                        );
                      })}
                    </Box>
                    
                    {/* Message input */}
                    <Flex p={4} borderTopWidth="1px" borderColor={borderColor}>
                      <InputGroup>
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <InputRightElement width="auto" pr={1}>
                          <HStack spacing={1}>
                            <Tooltip label="Attach file">
                              <IconButton
                                icon={<FiPaperclip />}
                                aria-label="Attach file"
                                variant="ghost"
                                size="sm"
                                borderRadius="base"
                              />
                            </Tooltip>
                            <Tooltip label="Voice message">
                              <IconButton
                                icon={<FiMic />}
                                aria-label="Voice message"
                                variant="ghost"
                                size="sm"
                                borderRadius="base"
                              />
                            </Tooltip>
                          </HStack>
                        </InputRightElement>
                      </InputGroup>
                      <Button
                        colorScheme="blue"
                        ml={2}
                        onClick={handleSendMessage}
                        leftIcon={<FiSend />}
                        borderRadius="base"
                      >
                        Send
                      </Button>
                    </Flex>
                  </>
                ) : (
                  <Flex h="full" align="center" justify="center">
                    <VStack spacing={4}>
                      <Text color="gray.500">Select a conversation to start messaging</Text>
                    </VStack>
                  </Flex>
                )}
              </Box>
            </Flex>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};
