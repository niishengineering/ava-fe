import React, { useEffect, useState } from "react";
import {
  Flex,
  IconButton,
  Box,
  Image,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaChevronLeft,
  FaMinus,
  FaSearch,
  FaArrowRight,
  FaHome,
  FaComments,
} from "react-icons/fa";
import ChatList from "./ChatList"; // Import the ChatList component
import { CustomerChatInterface, CustomerInterface } from "@/libs/interface";

type ViewType = "help" | "chatList";

interface HomeViewProps {
  logo?: string;
  propertyName: string | undefined;
  color: string;
  toggleWidget: () => void;
  onStartNewChat?: () => void;
  onSearchHelp?: (query: string) => void;
  onSelectChat: (chatId: string) => void;
  customerChats?: CustomerChatInterface[]; // Optional prop for customer chats
  customer: CustomerInterface;
  onRefreshChats: () => void;
}

const HomeView = (props: HomeViewProps) => {
  const {
    logo,
    propertyName,
    color,
    toggleWidget,
    onStartNewChat,
    onSearchHelp,
    onSelectChat,
    customerChats = [],
    onRefreshChats,
  } = props;

  const [currentView, setCurrentView] = useState<ViewType>("help");

  const handleChatIconClick = () => {
    setCurrentView("chatList");
  };

  const handleBackToHelp = () => {
    setCurrentView("help");
  };

  const handleHomeClick = () => {
    setCurrentView("help");
  };

  const receiveChatIdFromChildren = (chatId: string) => {
    onSelectChat(chatId);
  };

  if (currentView === "chatList") {
    return (
      <ChatList
        logo={logo}
        propertyName={propertyName}
        color={color}
        toggleWidget={toggleWidget}
        onBackToHelp={handleBackToHelp}
        onStartNewChat={onStartNewChat}
        onSelectChat={receiveChatIdFromChildren}
        customerChats={customerChats}
      />
    );
  }

  return (
    <Box h={"100vh"} w={"100%"} position="relative" overflowY="auto">
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
            display={"none"}
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
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
      <Box
        // background={color}
        // color="white"
        px="24px"
        pb="80px" // Add padding bottom for footer
        mx={1}
        flex={1}
        display="flex"
        flexDirection="column"
        gap="24px"
      >
        {/* Greeting */}
        <Box>
          <Text fontSize="24px" fontWeight="600" mb="8px">
            Hi there 👋
          </Text>
          <Text fontSize="16px" opacity="0.9">
            Need help? Search our help center for answers or start a
            conversation.
          </Text>
        </Box>

        {/* Help Center Search */}
        <Box background="white" borderRadius="12px" p="20px">
          <Text color="gray.800" fontSize="18px" fontWeight="600" mb="16px">
            Help Center
          </Text>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search for answers"
              color="gray.600"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="8px"
              _focus={{
                borderColor: color,
                boxShadow: `0 0 0 1px ${color}`,
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && onSearchHelp) {
                  onSearchHelp((e.target as HTMLInputElement).value);
                }
              }}
            />
          </InputGroup>
        </Box>

        {/* New Conversation */}
        <Box
          background="white"
          borderRadius="12px"
          p="20px"
          cursor="pointer"
          _hover={{ bg: "gray.50" }}
          onClick={onStartNewChat} // Assuming sendChatIdToParent is defined
        >
          <Flex alignItems="center" justifyContent="space-between">
            <Box>
              <Text color="gray.800" fontSize="18px" fontWeight="600" mb="4px">
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
              color={color}
              size="sm"
              _hover={{ bg: "transparent" }}
            />
          </Flex>
        </Box>
      </Box>

      {/* Bottom Navigation */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        background="white"
        borderTop="1px solid"
        borderColor="gray.200"
        p="12px"
        display="flex"
        justifyContent="center"
        gap="32px"
        mx={1}
        borderBottomLeftRadius={12}
        borderBottomRightRadius={12}
      >
        <IconButton
          icon={<FaHome />}
          aria-label="Home"
          variant="ghost"
          size="lg"
          color={currentView === "help" ? color : "gray.400"}
          bg={currentView === "help" ? `${color}15` : "transparent"}
          _hover={{ bg: currentView === "help" ? `${color}25` : "gray.100" }}
          onClick={handleHomeClick}
        />
        <IconButton
          icon={<FaComments />}
          aria-label="Chat"
          variant="ghost"
          size="lg"
          onClick={() => {
            handleChatIconClick();
            onRefreshChats();
          }}
        />
      </Box>
    </Box>
  );
};

export default HomeView;
