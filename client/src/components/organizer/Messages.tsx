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
      name: "John Smith",
      role: "Camera Operator",
      lastMessage: "I'm interested in working at ETHDenver 2025...",
      time: "1h ago",
      unread: true,
      avatar: "https://bit.ly/sage-adebayo",
      event: "ETHDenver 2025",
      messages: [
        { id: '1-1', sender: 'John', text: "Hello, I'm interested in working at ETHDenver 2025. I saw your posting for a camera operator and wanted to inquire about the position.", time: '10:30 AM', date: 'Yesterday' },
        { id: '1-2', sender: 'me', text: "Hi John, thanks for reaching out! We're looking for experienced camera operators for our main stage and workshop areas. Do you have experience filming tech conferences?", time: '11:15 AM', date: 'Yesterday' },
        { id: '1-3', sender: 'John', text: "Yes, I've worked on several tech conferences including Web3 Summit and Consensus. I have experience with both stationary and mobile camera work, and I'm familiar with live streaming setups.", time: '12:30 PM', date: 'Yesterday' },
      ]
    },
    {
      id: '2',
      name: "Sarah Johnson",
      role: "Sound Engineer",
      lastMessage: "Thank you for the offer. I've reviewed the contract...",
      time: "3h ago",
      unread: false,
      avatar: "https://bit.ly/ryan-florence",
      event: "Web3 Summit",
      messages: [
        { id: '2-1', sender: 'Sarah', text: "Thank you for the offer. I've reviewed the contract and everything looks good. Just a question about the equipment - will I need to bring my own mixer or is one provided?", time: '9:45 AM', date: 'Today' },
      ]
    },
    {
      id: '3',
      name: "Michael Chen",
      role: "Lighting Technician",
      lastMessage: "What kind of lighting rig will be used for the main stage?",
      time: "Yesterday",
      unread: false,
      avatar: "https://bit.ly/code-beast",
      event: "ETHDenver 2025",
      messages: [
        { id: '3-1', sender: 'Michael', text: "What kind of lighting rig will be used for the main stage? Do you need someone experienced with DMX programming?", time: '3:30 PM', date: '2 days ago' },
      ]
    },
    {
      id: '4',
      name: "Alex Rodriguez",
      role: "Video Editor",
      lastMessage: "I can start working on the promo materials next week...",
      time: "2 days ago",
      unread: false,
      avatar: "https://bit.ly/prosper-baba",
      event: "DeFi Conference",
      messages: [
        { id: '4-1', sender: 'Alex', text: "I can start working on the promo materials next week. Would you like me to use the same style as the previous event?", time: '5:15 PM', date: '2 days ago' },
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
            <Text color="gray.500">Communicate with your production crew</Text>
          </Box>
          <HStack spacing={4}>
            <InputGroup maxW="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input placeholder="Search messages..." />
            </InputGroup>
            <Button colorScheme="blue">New Message</Button>
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
                          />
                        </Tooltip>
                        <Tooltip label="Archive conversation">
                          <IconButton 
                            icon={<FiArchive />} 
                            aria-label="Archive conversation" 
                            variant="ghost" 
                            size="sm" 
                          />
                        </Tooltip>
                        <Menu>
                          <MenuButton 
                            as={IconButton} 
                            icon={<FiMoreVertical />} 
                            variant="ghost" 
                            size="sm"
                            aria-label="More options" 
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
                              />
                            </Tooltip>
                            <Tooltip label="Voice message">
                              <IconButton
                                icon={<FiMic />}
                                aria-label="Voice message"
                                variant="ghost"
                                size="sm"
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
