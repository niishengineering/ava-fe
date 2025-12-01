import React, { useState, useEffect, useRef } from "react";
import CustomerProfile from "../Customer/customerProfile";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Input,
  Text,
  VStack,
  Avatar,
} from "@chakra-ui/react";
import {
  FaRegUser,
  FaShareAlt,
  FaClock,
  FaRegFileAlt,
  FaInfoCircle,
  FaCopy,
  FaBan,
  FaPrint,
  FaPlus,
  FaRobot,
  FaTrash,
} from "react-icons/fa";
import { FiMoreVertical, FiSend } from "react-icons/fi";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Flag from "react-world-flags";
import { useGetChatMessages, useUpdateChat } from "@/libs/Hooks/chatHooks";
import { useGetUserInfo } from "@/libs/Hooks/usersHooks";
import usePropertyChatStore from "@/store/propertyChatStore";
import { useSendMessage } from "@/libs/Hooks/messageHooks";
import { toast } from "react-toastify";
import { useSocketStore } from "@/store/socketStore";

interface Message {
  id: string;
  messageContent: string;
  senderId: string;
  sentAt: string;
}

interface ChatDetailsProps {
  data: Chat | null;
}

export interface Chat {
  chat: {
    id: string;
    chat: string; // Not clear from context — adjust type if needed (string/object)
    customerId: string;
    currentSupportAgentId: string;
    supportAgentsId: string[];
    propertyChatId: string;
    mode: string;
    messagesId: string[];
    status: "Open" | "Closed" | string; // You can replace with union of known statuses
    createdAt: string; // Consider using Date if parsing it
    updatedAt: string;
    customer: {
      id: string;
      sessionId: string;
      siteId: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      jobTitle: string | null;
      country: string | undefined;
      userAgent: string | null;
    };
    supportAgent: {
      id: string;
      firstname: string;
      lastname: string;
      email: string;
    };
  };
  lastMessage: {
    id: string;
    senderId: string;
    recipientId: string | null;
    siteId: string;
    messageContent: string;
    messageType: "text" | "image" | string;
    imageContent: string | null;
    isRead: boolean;
    sentAt: Date; // ISO date string
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

const ChatAndDetails: React.FC<ChatDetailsProps> = ({ data }) => {
  const [status, setStatus] = useState<"open" | "closed">("open");
  const { data: messagesData, isLoading } = useGetChatMessages(data?.chat?.id);
  const updateChatMutation = useUpdateChat();

  const [modes, setModes] = useState<string[]>(["manual", "ai", "user"]);
  const [mode, setMode] = useState<string>(data?.chat?.mode || "");
  const { data: userData } = useGetUserInfo();
  const [customerIsActive, setCustomerIsActive] = useState<boolean>(false);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>();
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const { socket } = useSocketStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>();
  const [chat, setChat] = useState<any>();
  const sendMessageMutation = useSendMessage();
  const [sendSocketMessage, setSendSocketMessage] = useState<any>(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function sendNotificationMessage(notificaionType: string) {
    try {
      const sentAt = new Date();
      const id: any = customer?.id;

      const response = await sendMessageMutation.mutateAsync({
        chatId: chat?.id,
        id,
        sentAt,
        messageType: "notification",
        notificationContent: {
          username: user.firstName,
          type: notificaionType,
          timestamp: sentAt,
        },
        siteId: selectedProperty,
      });

      if (!socket) return;
      //send notification via socket

      socket.emit("send-joined-chat-notification", {
        receiverId: customer?.id,
        message: response.userMessage,
      });
    } catch (error) {}
  }

  async function sendMessageHandler() {
    if (!messageInput) return;

    let messageContent;
    let imageContent;
    const sentAt = new Date();
    const id: any = customer?.id;

    // If messageInput is available, set messageContent
    if (messageInput) {
      messageContent = messageInput;
    }

    // Send message to server and socket
    const result = await sendMessageMutation.mutateAsync({
      chatId: chat?.id,
      id,
      imageContent,
      messageContent,
      sentAt,
      siteId: selectedProperty,
    });
    const socketData = {
      receiverId: customer?.id,
      message: result?.userMessage,
    };
    setMessages([...messages, result?.userMessage]);

    //send message via socket
    setSendSocketMessage(socketData);

    // Clearing input field for next message
    setMessageInput("");
  }

  async function handleChangeMode(newMode: string) {
    try {
      const result = await updateChatMutation.mutateAsync({
        id: chat?.id,
        mode: newMode,
      });

      setMode(newMode);
      if (!socket) return;
      //send mode change via socket

      socket.emit("send-chat-mode", {
        receiverId: chat?.customerId,
        mode: newMode,
        chatId: chat?.id,
      });
    } catch (error) {}
  }

  useEffect(() => {
    scrollToBottom();
  }, [messagesData]);

  // Initialize messages, chat, and customer
  useEffect(() => {
    setMessages(messagesData?.messages);
  }, [messagesData]);

  // Notification permission request
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // console.log("Notification permission granted ✅");
      } else {
        // console.log("Notification permission denied ❌");
      }
    });
  }, []);

  // Customer  active status handling and user intitialztion
  useEffect(() => {
    if (!userData?.user) return;
    setUser(userData.user);

    if (!socket) return;
    // Listen for active users updates

    const handleActiveUsersUpdated = (activeUsers: any[]) => {
      const isActive = activeUsers.some(
        (u) => u.userId === data?.chat.customer.id
      );
      setCustomerIsActive(isActive);
    };

    socket.on("active-users-updated", handleActiveUsersUpdated);

    // Set customer and chat details
    setCustomer(data?.chat.customer);
    setChat(data?.chat);
    return () => {
      if (socket) {
        socket.off("active-users-updated", handleActiveUsersUpdated);
      }
    };
  }, [userData, data?.chat?.customer?.id, socket]);

  // Receiving messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (socketMsg: any) => {
      // update messages safely
      if (!messages) return;
      console.log("Received message via socket:", socketMsg);
      setMessages((prev: any) => [...prev, socketMsg.message]);
    };
    socket.on("receive-message", handleReceiveMessage);

    // cleanup to avoid duplicate listeners
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);

  // Sending message via socket
  useEffect(() => {
    if (sendSocketMessage !== null && socket) {
      socket.emit("send-message", sendSocketMessage);
    }
  }, [sendSocketMessage]);

  // Chat messages section
  const renderMessages = () => (
    <VStack
      flex="1"
      p={4}
      spacing={4}
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "2px",
        },
      }}
    >
      {messages?.map((msg: any) => {
        const isUser = msg.senderId === data?.chat?.customer?.id;
        return (
          <Flex
            key={msg.id}
            alignSelf={isUser ? "flex-start" : "flex-end"}
            maxW="70%"
            gap="1rem"
            direction={{ base: "column", md: "row" }}
          >
            <Flex display={isUser ? "flex" : "none"} alignItems="end">
              <Flag
                width="45px"
                code={data?.chat?.customer?.country || "USA"}
              />
            </Flex>
            <Box bg="#F5F5F5" px={4} py={2} borderRadius="md">
              <Text fontSize="sm">{msg.messageContent}</Text>
              <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                {new Date(msg.sentAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Box>
            <Flex display={isUser ? "none" : "flex"} alignItems="end">
              <Avatar
                size="sm"
                name={`${data?.chat?.supportAgent?.firstname} ${data?.chat?.supportAgent?.lastname}`}
              />
            </Flex>
          </Flex>
        );
      })}
      <div ref={messagesEndRef} />
    </VStack>
  );

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      h={{ base: "auto", md: "80vh" }}
      w="100%"
    >
      {/* Left Panel: Chat Interface */}
      <Flex
        flex="2"
        direction="column"
        overflow="hidden"
        border="1px solid rgba(26, 99, 255, 0.33)"
        bg="gray.50"
        boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
        h={{ base: "auto", md: "80vh" }}
      >
        {/* Chat Header */}
        <Flex
          align="center"
          justify="space-between"
          p={4}
          borderBottom="1px solid #E2E8F0"
        >
          <Flex align="center" gap={2}>
            <Flag width="30px" code={data?.chat?.customer?.country} />
            <Text noOfLines={1} fontWeight="bold" fontSize="md">
              {customer?.name ? `${customer.name}` : `v${customer?.id}`}
              <Box
                as="span"
                ml={2}
                w="10px"
                h="10px"
                bg={customerIsActive ? "green.500" : "gray.500"}
                borderRadius="50%"
              />
            </Text>
          </Flex>

          {/* Status Menu */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Flex align="center">
                <Box
                  w="10px"
                  h="10px"
                  bg={status === "open" ? "orange.400" : "gray.300"}
                  borderRadius="50%"
                  mr={2}
                />
                <Text>{status}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setStatus("open")}>
                <Flex align="center">
                  <Box
                    w="10px"
                    h="10px"
                    bg="orange.400"
                    borderRadius="50%"
                    mr={2}
                  />
                  <Text>Open</Text>
                </Flex>
              </MenuItem>
              <MenuItem onClick={() => setStatus("closed")}>
                <Flex align="center">
                  <Box
                    w="10px"
                    h="10px"
                    bg="gray.300"
                    borderRadius="50%"
                    mr={2}
                  />
                  <Text>Closed</Text>
                </Flex>
              </MenuItem>
            </MenuList>
          </Menu>

          {/* Chat Mode  */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Flex align="center">
                <Box
                  w="10px"
                  h="10px"
                  bg={status === "open" ? "orange.400" : "gray.300"}
                  borderRadius="50%"
                  mr={2}
                />
                <Text>{mode}</Text>
              </Flex>
            </MenuButton>
            <MenuList>
              {modes.map((modeOption, index) => {
                return (
                  <MenuItem
                    onClick={() => handleChangeMode(modeOption)}
                    key={index}
                  >
                    <Flex align="center">
                      <Box
                        w="10px"
                        h="10px"
                        bg="orange.400"
                        borderRadius="50%"
                        mr={2}
                      />
                      <Text>{modeOption}</Text>
                    </Flex>
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>

          {/* Three Dot Menu */}
          <Flex>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FiMoreVertical />}
                variant="outline"
                size="sm"
              />
              <MenuList>
                <MenuItem
                  onClick={() => {
                    sendNotificationMessage("join");
                    handleChangeMode("user");
                  }}
                  icon={<FaRegFileAlt />}
                >
                  Take OverChat
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    sendNotificationMessage("leave");
                    handleChangeMode("manual");
                  }}
                  icon={<FaInfoCircle />}
                >
                  Leave Chat
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {/* Messages Container */}
        {isLoading ? <Text p={4}>Loading messages...</Text> : renderMessages()}

        {/* Message Input */}
        {customerIsActive && (
          <Flex p={4} borderTop="1px solid #E2E8F0" gap={2}>
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessageHandler()}
            />
            <IconButton
              aria-label="Send message"
              icon={<FiSend />}
              colorScheme="blue"
              onClick={sendMessageHandler}
            />
          </Flex>
        )}
      </Flex>

      {/* Right Panel: Details */}
      <CustomerProfile customerData={data?.chat?.customer} />
    </Flex>
  );
};

export default ChatAndDetails;
