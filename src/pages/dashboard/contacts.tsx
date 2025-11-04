import SidebarWithHeader from "@/libs/Layouts/Dashboard";
import React, { useState, useEffect } from "react";
import { Box, Flex, Button, Text, IconButton, Tooltip } from "@chakra-ui/react";
import { BiChevronsLeft, BiChevronsRight } from "react-icons/bi";
import {
  FaUserFriends,
  FaUsers,
  FaUserShield,
  FaBuilding,
} from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import SupportAgentList from "@/libs/Components/Contacts/SupportAgentList";
import CustomerList from "@/libs/Components/Contacts/CustomerList";

const ContactsSidebar = () => {
  const [sidebarReducedData, setSidebarReducedData] = useState<{
    isReduced: boolean;
    ReducedMode: boolean;
  } | null>(null);
  const [activeComponent, setActiveComponent] = useState("customers");

  // Initialize state on first render
  useEffect(() => {
    if (sidebarReducedData === null) {
      setSidebarReducedData({
        isReduced: false,
        ReducedMode: false,
      });
    }
  }, [sidebarReducedData]);

  const toggleSidebar = () => {
    setSidebarReducedData((prevData: any) => ({
      isReduced: false,
      ReducedMode: !prevData.ReducedMode,
    }));
  };

  return (
    <SidebarWithHeader title="Contacts">
      <Flex
        direction={{ base: "column", md: "row" }}
        h={{ base: "auto", md: "full" }}
        gap={{ base: 2, md: "1rem" }}
      >
        {/* sidebar */}
        <Box
          bg={"rgba(26, 99, 255, 0.03)"}
          borderRight="1px solid rgba(0,0,0,0.1)"
          h={{ lg: "85vh", md: "85vh", sm: "fit-content", base: "fit-content" }}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          transition="width 0.2s ease"
          w={{
            base: "100%",
            md: sidebarReducedData?.isReduced ? "80px" : "260px",
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
        >
          <Box>
            {/* Header */}
            <Flex
              px={4}
              py={3}
              align="center"
              justify="space-between"
              borderBottom="1px solid rgba(0,0,0,0.1)"
            >
              {!sidebarReducedData?.isReduced && (
                <Text fontWeight="semibold">Contacts</Text>
              )}
              <Tooltip
                label={sidebarReducedData?.isReduced ? "Expand" : "Collapse"}
                openDelay={300}
              >
                <IconButton
                  aria-label="Toggle sidebar"
                  size="sm"
                  variant="ghost"
                  display={{ base: "none", sm: "none", md: "block" }}
                  icon={
                    sidebarReducedData?.isReduced ? (
                      <BiChevronsRight style={{ fontSize: 18 }} />
                    ) : (
                      <BiChevronsLeft style={{ fontSize: 18 }} />
                    )
                  }
                  _hover={{ bg: "gray.100" }}
                  onClick={toggleSidebar}
                />
              </Tooltip>
            </Flex>

            {/* menu items*/}
            <Box pt={4} display={"flex"} flexDir={"column"}>
              <Button
                w={sidebarReducedData?.isReduced ? "40px" : "90%"}
                mx="auto"
                color="white"
                bg="#0F2A5D"
                _hover={{ bg: "#0C234A" }}
                size="sm"
                leftIcon={
                  !sidebarReducedData?.isReduced ? <AiOutlinePlus /> : undefined
                }
              >
                {sidebarReducedData?.isReduced ? (
                  <AiOutlinePlus />
                ) : (
                  "Add Contact"
                )}
              </Button>

              {/* Menu */}
              <Box mt={6} display={"flex"} flexDirection={"column"} gap={"3"}>
                {[
                  // { icon: <FaUserFriends />, label: "All People" },
                  { icon: <FaUsers />, label: "Customers", value: "customers" },
                  { icon: <FaUserShield />, label: "Agents", value: "agents" },
                  // { icon: <FaBuilding />, label: "Organizations" },
                ].map((item, idx) => (
                  <Flex
                    key={idx}
                    align="center"
                    px={sidebarReducedData?.isReduced ? 0 : 4}
                    py={2}
                    cursor="pointer"
                    _hover={{ bg: "gray.100" }}
                    justify={
                      sidebarReducedData?.isReduced ? "center" : "flex-start"
                    }
                    bg={
                      item.value === activeComponent ? "blue.50" : "transparent"
                    }
                    borderLeft={
                      item.value === activeComponent &&
                      !sidebarReducedData?.isReduced
                        ? "3px solid #1A63FF"
                        : "none"
                    }
                    onClick={() => setActiveComponent(item.value)}
                  >
                    {item.icon}
                    {!sidebarReducedData?.isReduced && (
                      <Text ml={3}>{item.label}</Text>
                    )}
                  </Flex>
                ))}
              </Box>
            </Box>
          </Box>

          {/* Bottom */}
          <Box mb={4} display={"flex"}>
            <Button
              variant="outline"
              w={sidebarReducedData?.isReduced ? "40px" : "90%"}
              mx="auto"
              size="sm"
              leftIcon={
                !sidebarReducedData?.isReduced ? <AiOutlinePlus /> : undefined
              }
            >
              {sidebarReducedData?.isReduced ? <AiOutlinePlus /> : "Attributes"}
            </Button>
          </Box>
        </Box>
        {/* sidebar */}

        {/* Main component */}
        {activeComponent === "agents" && (
          <SupportAgentList isReduced={sidebarReducedData?.isReduced} />
        )}

        {activeComponent === "customers" && (
          <CustomerList isReduced={sidebarReducedData?.isReduced} />
        )}
        {/* Main component */}
      </Flex>
    </SidebarWithHeader>
  );
};

export default ContactsSidebar;
