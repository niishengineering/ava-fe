import {
  Box,
  Flex,
  Text,
  Switch,
  Input,
  Button,
  IconButton,
  Avatar,
  Image,
  Heading,
} from "@chakra-ui/react";
import { FiFilter } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

interface SupportAgentProps {
  isReduced: boolean | undefined;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  siteId: string | null;
  website: string | null;
  propertyChatIds: string[];
  role: "admin" | "agent"; // extend with other roles if needed
}

interface Property {
  id: string;
  website: string;
  propertyName: string;
  propertyImage: string | null;
  propertyColor: string;
  welcomeMessage: string;
  suggestedMessages: string[];
  chatMode: "manual" | "auto"; // add more modes if you support them
  propertyOwnerId: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

import { useGetAllSupportAgents } from "@/libs/Hooks/usersHooks";
import usePropertyChatStore from "@/store/propertyChatStore";
import { useGetWidgetProperty } from "@/libs/Hooks/propertyChatHook";

const SupportAgentList: React.FC<SupportAgentProps> = ({ isReduced }) => {
  const [searchTermData, setSearchTermData] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [agents, setAgents] = useState<User[]>([]);
  const [widget, setWidget] = useState<Property>();
  const [count, setCount] = useState();
  const [limit, setLimit] = useState(10);
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const [page, setPage] = useState<number>(1);
  const { data: widgetData } = useGetWidgetProperty(selectedProperty);

  const { data: supportAgentsData } = useGetAllSupportAgents(
    selectedProperty,
    page,
    searchTerm,
    limit
  );

  const fetchNext = () => {
    if (!count) return;
    if (page * limit >= count) return;
    setPage(page + 1);
  };

  const fetchPrevious = () => {
    if (page === 1) return;
    setPage(page - 1);
  };

  useEffect(() => {
    setAgents(supportAgentsData?.supportAgents);
    setCount(supportAgentsData?.count);
  }, [supportAgentsData]);

  useEffect(() => {
    setWidget(widgetData?.data);
  }, [widgetData]);

  if (searchTerm !== "" && searchTermData === "") {
    setSearchTerm("");
  }

  return (
    <Box
      display={"block"}
      transition="0.1s ease"
      bg={"rgba(26, 99, 255, 0.03)"}
      w={{
        base: "100%",
        md: isReduced ? "90%" : "80%",
      }}
    >
      {/* Support Agent List */}
      <Box display={"block"}>
        <Flex
          p={{ base: "1rem", md: "1.4rem 1rem" }}
          borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
          align="center"
          justify="space-between"
        >
          {/* Search Input */}
          <Flex align="center" gap={2}>
            <Input
              value={searchTermData}
              onChange={(e) => setSearchTermData(e.target.value)}
              placeholder="Search"
              size="sm"
              variant="filled"
            />
            <SearchIcon
              onClick={() => setSearchTerm(searchTermData)}
              color="gray.500"
            />
          </Flex>
          {/* Navigation */}
          <Flex align="center" gap={2}>
            <Box>
              {page} of {count ? Math.ceil(count / 10) : ""}
            </Box>
            <IconButton
              icon={<ChevronLeftIcon fontSize={"x-large"} />}
              aria-label="Previous"
              size="sm"
              onClick={fetchPrevious}
            />
            <IconButton
              icon={<ChevronRightIcon fontSize={"x-large"} />}
              aria-label="Next"
              size="sm"
              onClick={fetchNext}
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
              <FiFilter style={{ fontSize: "20px", color: "currentColor" }} />
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
        {/* Support Agent List Header */}
        <Flex
          p={{ base: "0.5rem", md: "1.4rem 1rem" }}
          borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
          align="center"
          display={{ base: "none", md: "flex" }}
        >
          <Box w={"20%"}>Name</Box>
          <Box w={"20%"}>Email</Box>
          <Box w={"15%"}>Phone</Box>
          <Box w={"25%"}>Website URL</Box>
          <Box w={"20%"} textAlign={"center"}>
            Orginisation
          </Box>
        </Flex>

        {/* Support Agent List Body */}
        {agents?.length > 0 && (
          <Box>
            {agents?.map((agent) => {
              return (
                <Flex
                  key={agent.id}
                  p={{ base: "1rem", md: "0.2rem 1rem" }}
                  borderBottom={"1px solid rgba(0, 0, 0, 0.10)"}
                  align="center"
                  flexDirection={{ base: "column", md: "row" }}
                  _hover={{
                    backgroundColor: "rgba(26, 99, 255, 0.33) !important",
                  }}
                  cursor={"pointer"}
                >
                  {/* Name */}
                  <Box p={1} w={{ base: "100%", md: "20%" }}>
                    <Flex alignItems="center" gap={2}>
                      <Avatar
                        size="sm"
                        name={`${agent.firstName} ${agent.lastName}`}
                      />
                      <Text noOfLines={1}>
                        {agent.firstName} {agent.lastName}
                      </Text>
                    </Flex>
                  </Box>

                  {/* Email */}
                  <Box p={1} w={{ base: "100%", md: "20%" }}>
                    <Text noOfLines={1}>{agent.email}</Text>
                  </Box>

                  {/* Phone */}
                  <Box p={1} w={{ base: "100%", md: "15%" }}>
                    <Text noOfLines={1}> {agent.role}</Text>
                  </Box>

                  {/* Website URL */}
                  <Box p={1} w={{ base: "100%", md: "25%" }}>
                    <Text noOfLines={1}>{widget?.website}</Text>
                  </Box>

                  {/* Updated */}
                  <Box p={1} w={{ base: "100%", md: "20%" }} textAlign="center">
                    <Text noOfLines={1}>{widget?.propertyName}</Text>
                  </Box>
                </Flex>
              );
            })}
          </Box>
        )}
        {agents?.length === 0 && (
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
    </Box>
  );
};

export default SupportAgentList;
