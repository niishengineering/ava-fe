import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import { TfiControlBackward } from "react-icons/tfi";
import { useEffect, useState, useRef } from "react";
import { RiGroupLine } from "react-icons/ri";
import { GrGroup } from "react-icons/gr";
import { CiChat1 } from "react-icons/ci";
import { TbTicket } from "react-icons/tb";
import { FiTrash } from "react-icons/fi";
import { RiSpam2Line } from "react-icons/ri";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { FiFilter } from "react-icons/fi";
import Flag from "react-world-flags";
import { getChatSentTime } from "@/libs/utilities";
import ChatComponent from "@/libs/Components/Chats/chat";
import { useGetUserInfo } from "@/libs/Hooks/usersHooks";
import TicketModal from "@/libs/Components/tickets/ticketModal";
import {
  Box,
  Flex,
  Text,
  Switch,
  Input,
  Button,
  IconButton,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Avatar,
  Image,
  Heading,
  filter,
} from "@chakra-ui/react";
import { MdAllInbox } from "react-icons/md";
import usePropertyChatStore from "@/store/propertyChatStore";
import { useGetAllCustomersChat } from "@/libs/Hooks/chatHooks";
import { useGetAllTickets } from "@/libs/Hooks/ticketsHooks";
import { TicketInterface, ChatInterface } from "@/libs/interface";
import { useSocketStore } from "@/store/socketStore";

type Priority = "Low" | "Medium" | "High" | "Critical";

const Indox = () => {
  const [sidebarReducedData, setSidebarReducedData] = useState<{
    isReduced: boolean;
    ReducedMode: boolean;
  } | null>(null);
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const [limit, setLimit] = useState(10);
  const [chatCount, setChatCount] = useState<number>(0);
  const { data: userData, isLoading: userDataIsLoading } = useGetUserInfo();
  const [ticketPage, setTicketPage] = useState(1);
  const [chatPage, setChatPage] = useState(1);
  const [filterChats, setFilterChats] = useState<boolean>(false);
  const [chatSearchTerm, setChatSearchTerm] = useState("");
  const [chatSearchTermData, setChatSearchTermData] = useState("");
  const [filterTickets, setFilterTickets] = useState<boolean>(false);
  const [ticketSearchTerm, setTicketSearchTerm] = useState("");
  const [ticketSearchTermData, setTicketSearchTermData] = useState("");
  const { data: ticketsData } = useGetAllTickets(
    selectedProperty,
    ticketPage,
    filterTickets,
    ticketSearchTerm
  );
  const { socket } = useSocketStore();
  const { data } = useGetAllCustomersChat(
    selectedProperty,
    chatPage,
    filterChats,
    chatSearchTerm
  );

  const [ticketCount, setTicketCount] = useState<number>(0);
  const [tickets, setTickets] = useState<TicketInterface[]>([]);
  const [chats, setChats] = useState<ChatInterface[]>([]);
  const [showChats, setShowChats] = useState<boolean>(true);
  const [showTickets, setShowTickets] = useState<boolean>(false);
  const [chatDetailsProps, setChatDetailsProps] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState<boolean>(false);
  const [ticketDetailsProps, setTicketDetailsProps] = useState<any>(null);
  const [activeChatTicket, setActiveChatTicket] = useState<string>("All");
  const [user, setUser] = useState<any>();

  const severityColors = {
    Low: "green.500",
    Medium: "yellow.500",
    High: "orange.500",
    Critical: "red.600",
  };

  const fetchNextTickets = () => {
    if (ticketPage * limit >= ticketCount) return;
    setTicketPage(ticketPage + 1);
  };

  const fetchPreviousTickets = () => {
    if (ticketPage === 1) return;
    setTicketPage(ticketPage - 1);
  };
  const fetchNextChat = () => {
    if (chatPage * limit >= chatCount) return;
    setChatPage(chatPage + 1);
  };

  const fetchPreviousChat = () => {
    if (chatPage === 1) return;
    setChatPage(chatPage - 1);
  };

  // handles fetch for Mine and All for both  chat and ticket
  const filterChatsAndTicket = (filterFor: string) => {
    if (showChats) {
      setChatPage(1);
      filterFor === "Mine" ? setFilterChats(true) : setFilterChats(false);
    }
    if (showTickets) {
      setTicketPage(1);
      filterFor === "Mine" ? setFilterTickets(true) : setFilterTickets(false);
    }
  };

  if (chatSearchTerm !== "" && chatSearchTermData === "") {
    setChatSearchTerm("");
  }

  if (ticketSearchTerm !== "" && ticketSearchTermData === "") {
    setTicketSearchTerm("");
  }

  // setting user data
  useEffect(() => {
    setUser(userData?.user);
  }, [userData]);

  //  setting chats
  useEffect(() => {
    setChats(data?.chats);
    setChatCount(data?.count);
  }, [selectedProperty, data]);

  // getting tickets
  useEffect(() => {
    setTicketCount(ticketsData?.count);
    setTickets(ticketsData?.tickets);
  }, [ticketsData]);

  // side bar logic
  useEffect(() => {
    setSidebarReducedData({
      isReduced: false,
      ReducedMode: false,
    });
  }, []);

  //

  // Receiving New Chat via socket
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (data: any) => {
      setChats((prev) => [data, ...prev]);
    };
    socket.on("receive-new-chat", handleReceiveMessage);

    // cleanup to avoid duplicate listeners
    return () => {
      socket.off("receive-new-chat", handleReceiveMessage);
    };
  }, [socket, chats]);

  // filtering Chats
  function activeChatAndTicketHandler(data: string) {
    setActiveChatTicket(data);
  }

  function toggleExpandSideBar() {
    setSidebarReducedData((prevData: any) => ({
      isReduced: false,
      ReducedMode: !prevData.ReducedMode,
    }));
  }

  function showChatshandler(data: any) {
    setShowChats(true);
    setChatDetailsProps(data);
  }

  return (
    <SidebarWithHeader title="Indox">
      <Flex
        direction={{ base: "column", md: "row" }}
        h={{ base: "auto", md: "full" }}
        gap={{ base: 2, md: "1rem" }}
      >
        {/* Sidebar */}
        <Box
          bg={"rgba(26, 99, 255, 0.03)"}
          transition="0.1s ease"
          w={{
            base: "100%",
            md: sidebarReducedData?.isReduced ? "10%" : "20%",
          }}
          onMouseEnter={() => {
            if (sidebarReducedData?.ReducedMode) {
              setSidebarReducedData((prevData: any) => ({
                isReduced: false,
                ReducedMode: true,
              }));
            }
          }}
          onMouseLeave={() => {
            if (sidebarReducedData?.ReducedMode) {
              setSidebarReducedData((prevData: any) => ({
                isReduced: true,
                ReducedMode: true,
              }));
            }
          }}
          pos={"relative"}
        >
          {/* Header */}
          <Flex
            p={3}
            alignItems={"center"}
            justifyContent={"space-between"}
            borderBottom={"1px solid rgba(0, 0, 0, 0.40)"}
          >
            <Text>Inbox</Text>
            <IconButton
              icon={
                <TfiControlBackward
                  style={{ fontSize: "20px", color: "currentColor" }}
                />
              }
              aria-label="Toggle sidebar"
              variant="ghost"
              _hover={{
                bg: "gray.200",
                color: "blue.500",
                transform: "scale(1.1)",
              }}
              onClick={() => toggleExpandSideBar()}
              color={"black"}
            />
          </Flex>
          <Flex
            alignItems={"center"}
            justifyContent={"space-between"}
            borderBottom={"1px solid rgba(0, 0, 0, 0.40)"}
          >
            <Flex
              onClick={() => {
                activeChatAndTicketHandler("Mine");
                filterChatsAndTicket("Mine");
              }}
              borderBottom={
                activeChatTicket === "Mine" ? "3px solid #1A63FF" : ""
              }
              p={3}
              alignItems={"center"}
              _hover={{ bg: "gray.200" }}
            >
              <IconButton
                icon={
                  <RiGroupLine
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="Mine"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                color={"black"}
              />
              <Text display={sidebarReducedData?.isReduced ? "none" : "block"}>
                Mine
              </Text>
            </Flex>

            <Flex
              onClick={() => {
                activeChatAndTicketHandler("All");
                filterChatsAndTicket("All");
              }}
              borderBottom={
                activeChatTicket === "All" ? "3px solid #1A63FF" : ""
              }
              p={3}
              alignItems={"center"}
              _hover={{ bg: "gray.200" }}
            >
              <IconButton
                icon={
                  <GrGroup
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="All"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                color={"black"}
              />
              <Text display={sidebarReducedData?.isReduced ? "none" : "block"}>
                All
              </Text>
            </Flex>
          </Flex>
          {/* Sidebar Body */}
          <Box p={3}>
            <Accordion p={0} allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box
                    as="span"
                    display={"flex"}
                    alignItems={"center"}
                    flex="1"
                    textAlign="left"
                  >
                    {/* Replaced IconButton with Box to avoid nested buttons */}
                    <Box
                      as="span"
                      display="inline-flex"
                      alignItems="center"
                      justifyContent="center"
                      w="40px"
                      h="40px"
                      borderRadius="md"
                      _hover={{
                        bg: "gray.200",
                        color: "blue.500",
                      }}
                      color={"black"}
                    >
                      <MdAllInbox
                        style={{ fontSize: "20px", color: "currentColor" }}
                      />
                    </Box>
                    <Text textColor={"#1A63FF"} ml={2}>
                      All
                    </Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {/* Chat Button */}
                  <Flex
                    alignItems={"center"}
                    p={2}
                    bg={""}
                    cursor={"pointer"}
                    _hover={{
                      bg: "rgba(26, 99, 255, 0.33)",
                    }}
                    justifyContent={"space-between"}
                    onClick={() => {
                      setShowChats(true);
                      setShowTickets(false);
                      setActiveChatTicket("All");
                      setFilterChats(false);
                      setChatDetailsProps(null);
                      setTicketDetailsProps(null);
                    }}
                  >
                    <Flex alignItems={"center"}>
                      {/* Replaced IconButton with Box */}
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        w="40px"
                        h="40px"
                        borderRadius="md"
                        _hover={{
                          bg: "gray.200",
                          color: "blue.500",
                        }}
                        color={"black"}
                      >
                        <CiChat1
                          style={{ fontSize: "20px", color: "currentColor" }}
                        />
                      </Box>
                      <Text
                        display={
                          sidebarReducedData?.isReduced ? "none" : "block"
                        }
                        ml={2}
                      >
                        Chats
                      </Text>
                    </Flex>
                    <Text color={"#E73636"}>{chatCount}</Text>
                  </Flex>
                  {/* Ticket Button */}
                  <Flex
                    cursor={"pointer"}
                    onClick={() => {
                      setShowChats(false);
                      setShowTickets(true);
                      setActiveChatTicket("All");
                      setFilterTickets(false);
                      setChatDetailsProps(null);
                      setTicketDetailsProps(null);
                    }}
                    _hover={{
                      bg: "rgba(26, 99, 255, 0.33)",
                    }}
                    alignItems={"center"}
                    p={2}
                    justifyContent={"space-between"}
                  >
                    <Flex alignItems={"center"}>
                      {/* Replaced IconButton with Box */}
                      <Box
                        as="span"
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        w="40px"
                        h="40px"
                        borderRadius="md"
                        _hover={{
                          bg: "gray.200",
                          color: "blue.500",
                        }}
                        color={"black"}
                      >
                        <TbTicket
                          style={{ fontSize: "20px", color: "currentColor" }}
                        />
                      </Box>
                      <Text
                        display={
                          sidebarReducedData?.isReduced ? "none" : "block"
                        }
                        ml={2}
                      >
                        Ticket
                      </Text>
                    </Flex>
                    <Text color={"#E73636"}>{ticketCount}</Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Flex pl={4} alignItems={"center"}>
              <IconButton
                icon={
                  <FiTrash
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="Trash"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                onClick={() => toggleExpandSideBar()}
                color={"black"}
                mx={sidebarReducedData?.isReduced ? "auto" : "0px"}
              />
              <Text display={sidebarReducedData?.isReduced ? "none" : "block"}>
                Trash
              </Text>
            </Flex>
            <Flex pl={4} alignItems={"center"}>
              <IconButton
                icon={
                  <RiSpam2Line
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="Spam"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                onClick={() => toggleExpandSideBar()}
                color={"black"}
                mx={sidebarReducedData?.isReduced ? "auto" : "0px"}
              />
              <Text display={sidebarReducedData?.isReduced ? "none" : "block"}>
                Spam
              </Text>
            </Flex>
          </Box>
          <TicketModal
            isOpen={showTicketModal}
            onClose={() => setShowTicketModal(false)}
          />
          <Flex p={4} w={"100%"} bottom={0} mx={"auto"} pos={"absolute"}>
            <Button
              w={"100%"}
              _hover={{ bg: "#192F5D" }}
              bg="#192F5D"
              color={"white"}
              onClick={() => setShowTicketModal(true)}
            >
              {" "}
              Compose Ticket{" "}
            </Button>
          </Flex>
        </Box>
        {/* End Sidebar */}

        {/* Customers Chat List and Chat List */}
        <Box
          display={showChats ? "block" : "none"}
          transition="0.1s ease"
          bg={"rgba(26, 99, 255, 0.03)"}
          w={{
            base: "100%",
            md: sidebarReducedData?.isReduced ? "90%" : "80%",
          }}
        >
          {/* Customer Chat List */}
          <Box display={chatDetailsProps ? "none" : "block"}>
            <Flex
              p={{ base: "1rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              justify="space-between"
            >
              {/* Search Input */}
              <Flex align="center" gap={2}>
                <Input
                  value={chatSearchTermData}
                  onChange={(e) => setChatSearchTermData(e.target.value)}
                  placeholder="Search"
                  size="sm"
                  variant="filled"
                />
                <SearchIcon
                  onClick={() => setChatSearchTerm(chatSearchTermData)}
                  color="gray.500"
                />
              </Flex>
              {/* Navigation */}
              <Flex align="center" gap={2}>
                <Box>
                  {chatPage} of {chatCount ? Math.ceil(chatCount / limit) : ""}
                </Box>
                <IconButton
                  icon={<ChevronLeftIcon fontSize={"x-large"} />}
                  aria-label="Previous"
                  size="sm"
                  onClick={fetchPreviousChat}
                />
                <IconButton
                  icon={<ChevronRightIcon fontSize={"x-large"} />}
                  aria-label="Next"
                  size="sm"
                  onClick={fetchNextChat}
                />
              </Flex>
            </Flex>
            <Flex
              p={{ base: "1rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              justify="space-between"
            >
              <Button
                leftIcon={
                  <FiFilter
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="Filter"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                color="black"
              >
                Filter
              </Button>
              <Flex align="center" gap={1}>
                <Text fontSize="sm">Auto Refresh</Text>
                <Switch size="sm" />
              </Flex>
            </Flex>
            {/* Ticket List Header */}
            <Flex
              p={{ base: "0.5rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              display={{ base: "none", md: "flex" }}
            >
              <Box w={"10%"}>
                <Flex alignItems={"center"} gap={3}>
                  <Checkbox />
                  <Text>Type</Text>
                </Flex>
              </Box>
              <Box w={"20%"}>Contact</Box>
              <Box w={"20%"}>Details</Box>
              <Box w={"20%"} textAlign={"center"}>
                Agent
              </Box>
              <Box w={"10%"} textAlign={"center"}>
                Status
              </Box>
              <Box w={"20%"}>Update</Box>
            </Flex>
            {/* Chat List Body */}
            {chats?.map((chat: ChatInterface) => {
              return (
                <Flex
                  key={chat?.chat?.id}
                  onClick={() => {
                    showChatshandler(chat);
                  }}
                  p={{ base: "1rem", md: "0.2rem 1rem" }}
                  borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
                  align="center"
                  flexDirection={{ base: "column", md: "row" }}
                  _hover={{
                    backgroundColor: "rgba(26, 99, 255, 0.33) !important",
                  }}
                  cursor={"pointer"}
                >
                  <Box p={1} w={{ base: "100%", md: "10%" }}>
                    <Flex>
                      <Flag
                        code={chat?.chat?.customer?.country}
                        width={"35px"}
                      />
                    </Flex>
                  </Box>
                  <Box p={1} w={{ base: "100%", md: "20%" }}>
                    <Text noOfLines={1}>
                      {chat?.chat?.customer?.name || chat?.chat?.customer?.id}
                    </Text>
                  </Box>
                  <Box p={1} w={{ base: "100%", md: "20%" }}>
                    <Text noOfLines={1}>
                      {chat?.lastMessage?.messageContent}
                    </Text>
                  </Box>
                  <Flex
                    p={1}
                    w={{ base: "100%", md: "20%" }}
                    justifyContent={"center"}
                  >
                    <Avatar
                      mx={"auto"}
                      size={"sm"}
                      name={
                        `${chat?.chat?.supportAgent?.firstName ?? ""} ${
                          chat?.chat?.supportAgent?.lastName ?? ""
                        }`.trim() || "Not available"
                      }
                    />
                  </Flex>
                  <Box
                    w={{ base: "100%", md: "10%" }}
                    display={"flex"}
                    justifyContent={"center"}
                  >
                    <Flex
                      bg={chat?.chat?.status === "Open" ? "green" : "red"}
                      textColor={"white"}
                      w={"fit-content"}
                      mx={"auto"}
                      p={1}
                      px={4}
                      textAlign={"center"}
                      borderRadius={"12px"}
                    >
                      {chat?.chat?.status}
                    </Flex>
                  </Box>
                  <Box p={1} w={{ base: "100%", md: "20%" }}>
                    <Text noOfLines={1}>
                      {getChatSentTime(chat?.lastMessage?.sentAt)}
                    </Text>
                  </Box>
                </Flex>
              );
            })}

            {chats && chats?.length === 0 && (
              <Box
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                mt={"5rem"}
              >
                <Box>
                  <Image src="/emptyChatAndTicket.svg" />
                </Box>
                <Heading color={"black"} fontWeight={"500"}>
                  {" "}
                  Oops Nothing here!{" "}
                </Heading>
              </Box>
            )}
          </Box>

          {/* Chat Component */}
          <Box display={chatDetailsProps ? "block" : "none"}>
            <ChatComponent data={chatDetailsProps} />
          </Box>
        </Box>

        {/* Tickets List and Ticket Component */}
        <Box
          display={showTickets ? "block" : "none"}
          transition="0.1s ease"
          bg={"rgba(26, 99, 255, 0.03)"}
          w={{
            base: "100%",
            md: sidebarReducedData?.isReduced ? "90%" : "80%",
          }}
        >
          {/* Ticket List */}
          <Box display={chatDetailsProps ? "none" : "block"}>
            <Flex
              p={{ base: "1rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              justify="space-between"
            >
              {/* Search Input */}
              <Flex align="center" gap={2}>
                <Input
                  value={ticketSearchTermData}
                  onChange={(e) => setTicketSearchTermData(e.target.value)}
                  placeholder="Search"
                  size="sm"
                  variant="filled"
                />
                <SearchIcon
                  onClick={() => setTicketSearchTerm(ticketSearchTermData)}
                  color="gray.500"
                />
              </Flex>
              {/* Navigation */}
              <Flex align="center" gap={2}>
                <Box>
                  {ticketPage} of{" "}
                  {ticketCount ? Math.ceil(ticketCount / limit) : ""}
                </Box>
                <IconButton
                  icon={<ChevronLeftIcon fontSize={"x-large"} />}
                  aria-label="Previous"
                  size="sm"
                  onClick={fetchPreviousTickets}
                />
                <IconButton
                  icon={<ChevronRightIcon fontSize={"x-large"} />}
                  aria-label="Next"
                  size="sm"
                  onClick={fetchNextTickets}
                />
              </Flex>
            </Flex>
            <Flex
              p={{ base: "1rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              justify="space-between"
            >
              <Button
                leftIcon={
                  <FiFilter
                    style={{ fontSize: "20px", color: "currentColor" }}
                  />
                }
                aria-label="Filter"
                variant="ghost"
                _hover={{
                  bg: "gray.200",
                  color: "blue.500",
                  transform: "scale(1.1)",
                }}
                color="black"
              >
                Filter
              </Button>
              <Flex align="center" gap={1}>
                <Text fontSize="sm">Auto Refresh</Text>
                <Switch size="sm" />
              </Flex>
            </Flex>
            {/* Ticket List Header */}
            <Flex
              p={{ base: "0.5rem", md: "1.4rem 1rem" }}
              borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
              align="center"
              display={{ base: "none", md: "flex" }}
              bg="gray.50"
            >
              <Box w={"20%"}>
                <Flex alignItems={"center"} gap={3}>
                  <Checkbox />
                  <Text fontSize="sm" fontWeight="medium" color="gray.600">
                    Contact
                  </Text>
                </Flex>
              </Box>
              <Box w={"25%"}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Ticket
                </Text>
              </Box>
              <Box w={"15%"} textAlign={"center"}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Assignee
                </Text>
              </Box>
              <Box w={"15%"} textAlign={"center"}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Priority
                </Text>
              </Box>
              <Box w={"15%"} textAlign={"center"}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Status
                </Text>
              </Box>
              <Box w={"10%"} textAlign={"center"}>
                <Text fontSize="sm" fontWeight="medium" color="gray.600">
                  Updated
                </Text>
              </Box>
            </Flex>
            {/* Ticket Body */}
            {tickets?.map((ticket: TicketInterface) => {
              return (
                <Flex
                  p={{ base: "1rem", md: "0.8rem 1rem" }}
                  borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
                  align="center"
                  flexDirection={{ base: "column", md: "row" }}
                  _hover={{
                    backgroundColor: "rgba(26, 99, 255, 0.33) !important",
                  }}
                  cursor={"pointer"}
                >
                  {/* Contact Column */}
                  <Box w={{ base: "100%", md: "20%" }}>
                    <Flex alignItems={"center"} gap={3}>
                      <Checkbox />
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.900"
                        >
                          {ticket?.customer?.name || ticket?.contact}
                        </Text>
                        <Text fontSize="xs" color="blue.500">
                          {ticket?.customer?.email || "..."}
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Ticket Column */}
                  <Box w={{ base: "100%", md: "25%" }}>
                    <Text fontSize="sm" color="gray.700" noOfLines={1}>
                      {ticket?.subject}
                    </Text>
                    <Text fontSize="xs" color="gray.500" noOfLines={2}>
                      {ticket?.message}
                    </Text>
                  </Box>

                  {/* Assignee Column */}
                  <Box w={{ base: "100%", md: "15%" }} textAlign={"center"}>
                    <Flex
                      alignItems="center"
                      gap={2}
                      w={"fit-content"}
                      mx={"auto"}
                    >
                      <Box
                        w="32px"
                        h="32px"
                        borderRadius="full"
                        bg="red.500"
                        color="white"
                        fontSize="sm"
                        fontWeight="bold"
                        display={"flex"}
                        alignItems={"center"}
                        justifyContent={"center"}
                      >
                        {ticket?.supportAgent?.firstname
                          ?.slice(0, 1)
                          .toUpperCase()}
                        {ticket?.supportAgent?.lastname
                          ?.slice(0, 1)
                          .toUpperCase()}
                      </Box>
                    </Flex>
                  </Box>

                  {/* Priority Column */}
                  <Box w={{ base: "100%", md: "15%" }} textAlign="center">
                    <Box
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      bg={severityColors[ticket.priority as Priority] || "grey"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontSize="sm"
                      fontWeight="bold"
                      mx="auto"
                    >
                      {ticket.priority.slice(0, 1).toLocaleUpperCase()}
                    </Box>
                  </Box>

                  {/* Status Column */}
                  <Box w={{ base: "100%", md: "15%" }} textAlign="center">
                    <Box
                      bg={
                        ticket.status.toUpperCase() === "OPEN"
                          ? "green.400"
                          : "gray.400"
                      }
                      color="white"
                      px={3}
                      py={1}
                      borderRadius="md"
                      fontSize="xs"
                      fontWeight="medium"
                      display="inline-block"
                    >
                      {ticket.status.toUpperCase()}
                    </Box>
                  </Box>

                  {/* Updated Column */}
                  <Box w={{ base: "100%", md: "10%" }} textAlign="center">
                    <Text fontSize="xs" color="gray.600">
                      {getChatSentTime(ticket.updatedAt)}
                    </Text>
                  </Box>
                </Flex>
              );
            })}

            {tickets && tickets?.length === 0 && (
              <Box
                display={"flex"}
                flexDir={"column"}
                alignItems={"center"}
                mt={"5rem"}
              >
                <Box>
                  <Image src="/emptyChatAndTicket.svg" />
                </Box>
                <Heading color={"black"} fontWeight={"500"}>
                  {" "}
                  Oops Nothing here!{" "}
                </Heading>
              </Box>
            )}
          </Box>

          {/* Ticket Component */}
          <Box display={chatDetailsProps ? "block" : "none"}>
            <ChatComponent data={chatDetailsProps} />
          </Box>
        </Box>
      </Flex>
    </SidebarWithHeader>
  );
};

export default Indox;
