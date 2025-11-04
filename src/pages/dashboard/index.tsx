import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import { Box, Flex, Text, Avatar, IconButton } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import HistoricalAnalysis from "@/libs/Components/Graph/HistoricalAnalysis";
import { IoPeopleOutline } from "react-icons/io5";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";
import { MdOutlineChat } from "react-icons/md";
import { AiOutlineFolderView } from "react-icons/ai";
import { TbAntennaBars5 } from "react-icons/tb";
import usePropertyChatStore from "@/store/propertyChatStore";
import { useGerPropertyChatOverview } from "@/libs/Hooks/analyticsHooks";
import { useGetAllCustomers } from "@/libs/Hooks/customerHooks";
import Flag from "react-world-flags";
import { getChatSentTime } from "@/libs/utilities";
import LoadingSpinner from "@/libs/Components/loadingSpinner";
import { useGetAnalyticsChatVolume } from "@/libs/Hooks/chatHooks";

interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  siteId: string | null;
  website: string | null;
  propertyChatIds: string[];
  role: string;
  image: string | null;
}

interface Customer {
  id: string;
  sessionId: string | null;
  chatSessionId: string;
  siteId: string;
  country: string;
  email: string | null;
  jobTitle: string | null;
  name: string | null;
  phone: string | null;
  userAgent: string[] | null;
  currentAgent: Agent | null;
  lastMessageSentAt: Date | string;
}

export default function DashboardIndex() {
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const { data, isLoading, isError } =
    useGerPropertyChatOverview(selectedProperty);
  const { data: customersData, isLoading: customersIsLoading } =
    useGetAllCustomers(selectedProperty);
  const [analyticData, setAanlyticData] = useState<any>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const { data: chatVolumeData } = useGetAnalyticsChatVolume({
    days: "30",
    siteId: selectedProperty,
  });

  // setting analytic data
  useEffect(() => {
    setAanlyticData(data?.data);
  }, [selectedProperty, data]);

  // setting customers data
  useEffect(() => {
    setCustomers(customersData?.customers);
  }, [customersData, selectedProperty]);

  return (
    <SidebarWithHeader title="Dashboard">
      <Flex
        gap={"1rem"}
        mt={"2rem"}
        flexDir={{ base: "column", sm: "column", md: "column", lg: "row" }}
      >
        <Box w={{ base: "100%", md: "100%", lg: "40%" }}>
          {/* Visitor and Chat */}
          <Flex
            gap="1rem"
            flexDir={{ base: "column", sm: "column", md: "row" }} // 👈 stack on mobile
          >
            {/* vistor */}
            <Flex
              flexDir="column"
              gap={3}
              boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
              borderRadius="md"
              p="0.5rem 1rem"
              w="100%" // 👈 always full width inside stacked flex
            >
              <Flex gap={2} alignItems={"center"}>
                <IoPeopleOutline style={{ fontSize: "20px", color: "green" }} />
                <Text fontSize={"1rem"} alignItems={"center"}>
                  Vistors
                </Text>
              </Flex>
              <Box>
                <Text mt={5} color={"grey"}>
                  Today
                </Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"2rem"} fontWeight={"600"}>
                    {analyticData?.visitorCountPercentage?.count}
                  </Text>
                  {analyticData?.visitorCountPercentage?.percentage >= 0 ? (
                    <Flex>
                      <IoMdTrendingUp
                        style={{
                          fontSize: "20px",
                          marginTop: "1rem",
                          color: "green",
                        }}
                      />
                      <Text
                        color={"green"}
                        fontSize={"1rem"}
                        mt={4}
                        fontWeight={"600"}
                      >
                        {analyticData?.visitorCountPercentage?.percentage}.0%
                      </Text>
                    </Flex>
                  ) : (
                    <Flex>
                      <IoMdTrendingDown
                        style={{
                          fontSize: "20px",
                          marginTop: "1rem",
                          color: "red",
                        }}
                      />
                      <Text
                        color={"red"}
                        fontSize={"1rem"}
                        mt={4}
                        fontWeight={"600"}
                      >
                        {analyticData?.visitorCountPercentage?.percentage}.0%
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Box>

              <Flex gap={3}>
                <Text fontSize={"20px"}>Last 7 days</Text>
                <Text fontSize={"20px"} display={"flex"} alignItems={"center"}>
                  {" "}
                  <IoArrowUp style={{ color: "green", fontSize: "20px" }} />
                  {analyticData?.higestVisitorCount}
                </Text>
                <Text display={"flex"} fontSize={"20px"} alignItems={"center"}>
                  {" "}
                  <IoArrowDown style={{ color: "red", fontSize: "20px" }} />
                  {analyticData?.smallestVisitorCount}
                </Text>
              </Flex>
            </Flex>
            {/* vistor */}

            {/* chat */}
            <Flex
              flexDir="column"
              gap={3}
              boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
              borderRadius="md"
              p="0.5rem 1rem"
              w="100%"
            >
              <Flex gap={2} alignItems={"center"}>
                <MdOutlineChat style={{ fontSize: "20px", color: "pink" }} />
                <Text fontSize={"1rem"} alignItems={"center"}>
                  Chats
                </Text>
              </Flex>

              <Flex justifyContent={"space-between"}>
                <Box>
                  <Text color={"grey"} mt={5}>
                    Today
                  </Text>
                  <Flex alignItems={"center"} gap={3}>
                    <Text fontSize={"2rem"} fontWeight={"600"}>
                      {analyticData?.chatCountPercentage?.count}
                    </Text>
                    {analyticData?.chatCountPercentage?.percentage >= 0 ? (
                      <Flex>
                        <IoMdTrendingUp
                          style={{
                            fontSize: "20px",
                            marginTop: "1rem",
                            color: "green",
                          }}
                        />
                        <Text
                          color={"green"}
                          fontSize={"1rem"}
                          mt={4}
                          fontWeight={"600"}
                        >
                          {analyticData?.chatCountPercentage?.percentage}.0%
                        </Text>
                      </Flex>
                    ) : (
                      <Flex>
                        <IoMdTrendingDown
                          style={{
                            fontSize: "20px",
                            marginTop: "1rem",
                            color: "red",
                          }}
                        />
                        <Text
                          color={"red"}
                          fontSize={"1rem"}
                          mt={4}
                          fontWeight={"600"}
                        >
                          {analyticData?.chatCountPercentage?.percentage}.0%
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
                <Box display={"none"}>
                  <Text color={"grey"} mt={5}>
                    Missed
                  </Text>
                  <Flex alignItems={"center"} gap={3}>
                    <Text fontSize={"2rem"} fontWeight={"600"}>
                      2
                    </Text>
                    <IoMdTrendingUp
                      style={{
                        fontSize: "20px",
                        marginTop: "1rem",
                        color: "green",
                      }}
                    />
                    <Text
                      color={"green"}
                      fontSize={"1rem"}
                      mt={4}
                      fontWeight={"600"}
                    >
                      0.0%
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              <Flex gap={3}>
                <Text fontSize={"20px"}>Last 7 days</Text>

                <Text fontSize={"20px"} display={"flex"} alignItems={"center"}>
                  {" "}
                  <IoArrowUp style={{ color: "green", fontSize: "20px" }} />
                  {analyticData?.higestChatCount}
                </Text>
                <Text display={"flex"} fontSize={"20px"} alignItems={"center"}>
                  {" "}
                  <IoArrowDown style={{ color: "red", fontSize: "20px" }} />
                  {analyticData?.smallestChatCount}
                </Text>
              </Flex>
            </Flex>
            {/* chat */}
          </Flex>
          {/* Visitor and Chat */}

          {/* Page view and reporting */}
          <Flex
            gap="1rem"
            mt="1rem"
            flexDir={{ base: "column", sm: "column", md: "row" }}
          >
            {/* Page view */}
            <Flex
              flexDir="column"
              gap={3}
              boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
              borderRadius="md"
              p="0.5rem 1rem"
              w="100%"
            >
              <Flex gap={2} alignItems={"center"}>
                <AiOutlineFolderView
                  style={{ fontSize: "20px", color: "orange" }}
                />
                <Text fontSize={"1rem"} alignItems={"center"}>
                  Page View
                </Text>
              </Flex>
              <Box>
                <Text mt={5} color={"grey"}>
                  Today
                </Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"2rem"} fontWeight={"600"}>
                    {analyticData?.pageViewCountPercentage?.count}
                  </Text>
                  {analyticData?.pageViewCountPercentage?.percentage >= 0 ? (
                    <Flex>
                      <IoMdTrendingUp
                        style={{
                          fontSize: "20px",
                          marginTop: "1rem",
                          color: "green",
                        }}
                      />
                      <Text
                        color={"green"}
                        fontSize={"1rem"}
                        mt={4}
                        fontWeight={"600"}
                      >
                        {analyticData?.pageViewCountPercentage?.percentage}.0%
                      </Text>
                    </Flex>
                  ) : (
                    <Flex>
                      <IoMdTrendingDown
                        style={{
                          fontSize: "20px",
                          marginTop: "1rem",
                          color: "red",
                        }}
                      />
                      <Text
                        color={"red"}
                        fontSize={"1rem"}
                        mt={4}
                        fontWeight={"600"}
                      >
                        {analyticData?.pageViewCountPercentage?.percentage}.0%
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Box>

              <Flex gap={3}>
                <Text fontSize={"20px"}>Last 7 days</Text>
                <Text fontSize={"20px"} display={"flex"} alignItems={"center"}>
                  {" "}
                  <IoArrowUp style={{ color: "green", fontSize: "20px" }} />
                  {analyticData?.higestPageViewCount}
                </Text>
                <Text display={"flex"} fontSize={"20px"} alignItems={"center"}>
                  {" "}
                  <IoArrowDown style={{ color: "red", fontSize: "20px" }} />
                  {analyticData?.smallestPageViewCount}
                </Text>
              </Flex>
            </Flex>
            {/* Page view */}
            {/* reporting */}
            <Flex
              flexDir="column"
              gap={3}
              boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
              borderRadius="md"
              p="0.5rem 1rem"
              w="100%"
            >
              <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                  <TbAntennaBars5 style={{ fontSize: "20px", color: "blue" }} />
                  <Text fontSize={"1rem"} alignItems={"center"}>
                    Reporting
                  </Text>
                </Flex>

                <Text fontSize={"1rem"} color={"green"} textDecor={"underline"}>
                  More
                </Text>
              </Flex>

              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"1rem"}>Positive Sentiment</Text>
                <Flex alignItems={"center"} gap={3}>
                  <IoMdTrendingDown
                    style={{
                      fontSize: "20px",
                      marginTop: "1rem",
                      color: "red",
                    }}
                  />
                  <Text color={"red"} fontSize={"1rem"} fontWeight={"600"}>
                    0.0%
                  </Text>
                </Flex>
              </Flex>

              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"1rem"}>Engagement</Text>
                <Flex alignItems={"center"} gap={3}>
                  <IoMdTrendingDown
                    style={{
                      fontSize: "20px",
                      marginTop: "1rem",
                      color: "red",
                    }}
                  />
                  <Text color={"red"} fontSize={"1rem"} fontWeight={"600"}>
                    0.0%
                  </Text>
                </Flex>
              </Flex>

              <Flex justifyContent={"space-between"} alignItems={"center"}>
                <Text fontSize={"1rem"}>Availability</Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text color={"green"} fontSize={"1rem"} fontWeight={"600"}>
                    100%
                  </Text>
                </Flex>
              </Flex>
            </Flex>
            {/* reporting */}
          </Flex>
        </Box>
        {/* right side */}
        <Box
          w={{ base: "100%", sm: "100%", md: "100%", lg: "60%" }}
          position={"relative"}
        >
          <LoadingSpinner showLoadingSpinner={customersIsLoading} />
          <Box
            boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
            p={"0 1rem"}
            borderRadius="md"
            width="100%"
            height="400px"
            display="flex"
            flexDir="column"
          >
            {/* Fixed Header */}
            <Box
              as="header"
              position="sticky"
              top="0"
              backgroundColor="white"
              zIndex="1"
              borderBottom="1px solid #e0e0e0"
            >
              <Flex
                alignItems={"center"}
                gap={5}
                p={"0.5rem 0"}
                borderBottom={"1px solid rgba(11, 7, 255, 0.30);"}
              >
                <Text fontSize={"1.5rem"}>History</Text>
              </Flex>
              <Flex
                p={"0.9rem 0"}
                borderBottom={"1px solid rgba(11, 7, 255, 0.30);"}
              >
                <Box w={"50%"}>Visitors</Box>
                <Box w={"20%"} textAlign={"center"}>
                  Agent
                </Box>
                <Box w={"30%"} textAlign={"left"}>
                  Time
                </Box>
              </Flex>
            </Box>
            {/* Fixed Header */}

            {/* Scrollable Body */}
            <Box as="main" flex="1" overflowY="auto">
              {customers?.map((customer) => {
                return (
                  <Flex
                    key={customer.id}
                    mt={"2rem"}
                    bg={"#f5f5f5"}
                    borderRadius={3}
                    p={3}
                    color={"black"}
                    _hover={{
                      bg: "green",
                      color: "white",
                    }}
                  >
                    <Box w={"50%"}>
                      <Flex gap={4}>
                        <Flag
                          width={"50px"}
                          height={"50px"}
                          code={customer.country}
                        />
                        <Text noOfLines={1}>V{customer.id}</Text>
                      </Flex>
                    </Box>
                    <Box w={"20%"} display={"flex"}>
                      <Avatar
                        mx={"auto"}
                        name={
                          customer.currentAgent
                            ? `${customer?.currentAgent?.firstName} ${customer?.currentAgent?.lastName}`
                            : "N A"
                        }
                        src=""
                        size="xs"
                        bg="teal.500"
                      />
                    </Box>
                    <Box w={"30%"} textAlign={"center"}>
                      {getChatSentTime(customer.lastMessageSentAt)}
                    </Box>
                  </Flex>
                );
              })}
            </Box>
            {/* Scrollable Body */}
          </Box>
        </Box>
      </Flex>

      <Box
        boxShadow="0px 4px 10px 4px rgba(0, 0, 0, 0.2)"
        mt={"4rem"}
        w="100%"
        p={3}
        borderRadius={"md"}
      >
        {/* Header */}
        <Flex>
          <Flex alignItems={"center"} gap={5}>
            <Avatar name="WheelAround" src="" size="sm" bg="teal.500" />
            <Text fontSize={"1rem"}>Historical Analysis</Text>
          </Flex>
        </Flex>
        {/* Header */}
        {/* body */}

        <HistoricalAnalysis></HistoricalAnalysis>

        {/* body */}
      </Box>
    </SidebarWithHeader>
  );
}
