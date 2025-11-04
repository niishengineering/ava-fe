import {
  Flex,
  IconButton,
  Box,
  Image,
  Text,
  Avatar,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaMinus,
  FaArrowRight,
  FaChevronRight,
} from "react-icons/fa";

import { CustomerChatInterface } from "@/libs/interface";
import { useEffect } from "react";
import { getChatSentTime } from "@/libs/utilities";

interface ChatListProps {
  logo?: string;
  propertyName: string | undefined;
  color: string;
  toggleWidget: () => void;
  onBackToHelp?: () => void;
  onStartNewChat?: () => void;
  onSelectChat: (chatId: string) => void;
  customerChats?: CustomerChatInterface[]; // Optional prop for customer chats
}

const ChatList = (props: ChatListProps) => {
  const {
    logo,
    propertyName,
    color,
    toggleWidget,
    onBackToHelp,
    onStartNewChat,
    onSelectChat,
    customerChats = [],
  } = props;

  const getStatusIndicator = (chat: CustomerChatInterface) => {
    if (chat?.chat?.status === "Open") {
      return (
        <HStack spacing={1} alignItems="center">
          <Text fontSize="xs" color="gray.600">
            {chat.chat?.supportAgent?.firstName || "Uknown"}
            {/* {chat?.chat?.status} */}
          </Text>
          {chat?.chat?.currentSupportAgentId && (
            <Box w="6px" h="6px" bg="green.400" borderRadius="full" />
          )}
        </HStack>
      );
    }
    return (
      <Text fontSize="xs" color="gray.500">
        {chat?.chat?.status}
      </Text>
    );
  };

  return (
    <Box h={"100vh"} w={"100%"} position="relative" overflowY="auto" bg="white">
      {/* Header */}
      <Box
        as="header"
        background={color}
        color="white"
        p="16px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mt={1}
        ml={1}
        mr={1}
        minH="64px"
        borderTopRightRadius={12}
        borderTopLeftRadius={12}
      >
        <Flex alignItems="center" gap="12px">
          <IconButton
            icon={<FaChevronLeft />}
            aria-label="Back"
            variant="ghost"
            color="white"
            size="sm"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={onBackToHelp}
          />

          {logo ? (
            <Image
              src={logo}
              alt="Logo"
              boxSize="32px"
              borderRadius="full"
              objectFit="cover"
            />
          ) : (
            <Avatar
              size="sm"
              bg="orange.400"
              icon={<Text fontSize="sm">🤖</Text>}
            />
          )}

          <Text fontSize="lg" fontWeight="600">
            {propertyName?.toLocaleUpperCase() || "Chat Widget"}
          </Text>
        </Flex>
        <IconButton
          icon={<FaMinus />}
          aria-label="Close chat"
          variant="ghost"
          color="white"
          size="sm"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          onClick={toggleWidget}
        />
      </Box>

      {/* Main Content */}
      <Box px="20px" py="24px" mx={1} flex={1} bg="white">
        {/* Start a new chat section */}
        <VStack spacing="16px" align="stretch">
          <Text fontSize="18px" fontWeight="600" color="gray.800">
            Start a new chat
          </Text>

          {/* New Conversation Card */}
          <Box
            border="1px solid"
            borderColor="blue.300"
            borderRadius="12px"
            p="16px"
            cursor="pointer"
            _hover={{ bg: "blue.50", borderColor: "blue.400" }}
            onClick={onStartNewChat}
          >
            <Flex alignItems="center" justifyContent="space-between">
              <Box>
                <Text
                  color="gray.800"
                  fontSize="16px"
                  fontWeight="600"
                  mb="2px"
                >
                  New Conversation
                </Text>
                <Text color="gray.500" fontSize="14px">
                  We typically reply in a few minutes
                </Text>
              </Box>
              <IconButton
                icon={<FaArrowRight />}
                aria-label="Start new conversation"
                variant="ghost"
                color="blue.500"
                size="sm"
                _hover={{ bg: "transparent" }}
              />
            </Flex>
          </Box>

          {/* Recent Section */}
          <Box mt="32px">
            <Text fontSize="18px" fontWeight="600" color="gray.800" mb="16px">
              Recent
            </Text>

            {customerChats.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                py="40px"
                border="1px dashed"
                borderColor="gray.300"
                borderRadius="12px"
                bg="gray.50"
              >
                <Text fontSize="sm" color="gray.500">
                  No recent chats yet
                </Text>
                <Text fontSize="xs" color="gray.400">
                  Start a new conversation to get started
                </Text>
              </Flex>
            ) : (
              <VStack spacing="1rem" align="stretch">
                {customerChats.map((chat, index) => (
                  <Box key={chat.chat.id}>
                    <Box
                      p="16px"
                      cursor="pointer"
                      _hover={{ bg: "gray.100" }}
                      onClick={() => onSelectChat(chat.chat.id)}
                      border="1px solid gray.200"
                      borderRadius="8px"
                      bg="gray.50"
                    >
                      <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        mb="8px"
                      >
                        <Box flex="1">{getStatusIndicator(chat)}</Box>
                        <Text fontSize="xs" color="gray.500">
                          {getChatSentTime(chat?.lastMessage?.sentAt)}
                        </Text>
                      </Flex>

                      <Flex alignItems="center" justifyContent="space-between">
                        <HStack spacing="8px" flex="1">
                          <Text
                            fontSize="14px"
                            color="gray.700"
                            fontWeight="500"
                            noOfLines={1}
                            flex="1"
                          >
                            {chat?.lastMessage?.messageContent}
                          </Text>
                        </HStack>
                        <IconButton
                          icon={<FaChevronRight />}
                          aria-label="Open chat"
                          variant="ghost"
                          color="gray.400"
                          size="xs"
                          _hover={{ bg: "transparent", color: "gray.600" }}
                        />
                      </Flex>
                    </Box>
                    {index < customerChats?.length - 1 && (
                      <Divider borderColor="gray.100" />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export default ChatList;
