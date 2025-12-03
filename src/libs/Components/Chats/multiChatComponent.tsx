import React, { useRef } from "react";
import {
  Box,
  Flex,
  IconButton,
  Text,
  VStack,
  Tooltip,
  Divider,
} from "@chakra-ui/react";
import { FaTimes, FaComments } from "react-icons/fa";
import Flag from "react-world-flags";
import useMultiChatStore from "@/store/multiChatStore";
import ChatAndDetails from "./chat";

const MultiChatOverlay: React.FC = () => {
  const { openChats, activeChatId, closeChat, setActiveChat, closeOverlay } =
    useMultiChatStore();

  const activeChat = openChats.find((c) => c.id === activeChatId);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const chatContentRef = useRef<HTMLDivElement | null>(null);

  const handleFlexClick = (e: React.MouseEvent) => {
    // Check if click is outside both sidebar and chat content
    const clickedOutsideSidebar =
      sidebarRef.current && !sidebarRef.current.contains(e.target as Node);
    const clickedOutsideChatContent =
      chatContentRef.current &&
      !chatContentRef.current.contains(e.target as Node);

    // if (clickedOutsideSidebar && clickedOutsideChatContent) {
    closeOverlay();
    // }
  };

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      w="100vw"
      h="100%"
      bg="rgba(0,0,0,0.35)"
      zIndex={99}
      overflow="hidden"
    >
      <Flex
        position="fixed"
        right={0}
        top={0}
        h="100%"
        w="99vw"
        boxShadow="lg"
        zIndex={9999}
        overflowX={"hidden"}
        onClick={handleFlexClick} // Click handler on the Flex
      >
        {/* LEFT: Sidebar */}
        <Box
          w="250px"
          borderColor="gray.200"
          overflowY="auto"
          display={openChats.length > 0 ? "block" : "none"}
          onClick={(e) => e.stopPropagation()} // Stop propagation
          h={"fit-content"}
        >
          <Flex
            p={3}
            align="center"
            bg="blue.500"
            color="white"
            gap={2}
            position="sticky"
            top={0}
            zIndex={1}
          >
            <FaComments />
            <Text fontWeight="bold" fontSize="sm">
              Chats ({openChats.length})
            </Text>
          </Flex>

          <VStack spacing={0} align="stretch">
            {openChats.map((chat) => (
              <Box key={chat.id}>
                <Flex
                  p={3}
                  cursor="pointer"
                  bg={activeChatId === chat.id ? "blue.50" : "white"}
                  _hover={{ bg: "gray.50" }}
                  align="center"
                  gap={3}
                  onClick={() => setActiveChat(chat.id)}
                  position="relative"
                  borderLeft="4px solid"
                  borderColor={
                    activeChatId === chat.id ? "blue.500" : "transparent"
                  }
                >
                  <Flag
                    width="24px"
                    code={chat.chatData.chat.customer.country || "USA"}
                  />

                  <Box flex="1">
                    <Text fontSize="sm" noOfLines={1} fontWeight="medium">
                      {chat.customerName}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Chat #{chat.id.slice(0, 6)}
                    </Text>
                  </Box>

                  <Tooltip label="Close chat">
                    <IconButton
                      aria-label="close"
                      icon={<FaTimes />}
                      size="xs"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        closeChat(chat.id);
                      }}
                    />
                  </Tooltip>
                </Flex>

                <Divider />
              </Box>
            ))}
          </VStack>
        </Box>

        {/* RIGHT: Chat Content */}
        <Box
          flex="1"
          overflow="hidden"
          onClick={(e) => e.stopPropagation()}
          h={"fit-content"}
        >
          {activeChat ? (
            <ChatAndDetails data={activeChat.chatData} />
          ) : (
            <Flex
              align="center"
              justify="center"
              h="100%"
              bg="gray.50"
              color="gray.600"
              fontSize="lg"
            >
              Select a chat from the sidebar.
            </Flex>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default MultiChatOverlay;
