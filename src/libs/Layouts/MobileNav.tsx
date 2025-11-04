import {
  Flex,
  Stack,
  useColorModeValue,
  Button,
  Box,
  Badge,
  IconButton,
  Heading,
  FlexProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { TbDeviceAnalytics } from "react-icons/tb";
import { IoMdLogOut } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import ExpandableAvatarCard from "../Components/Dashboard/ExpandableAvatar";
import { IoChatboxOutline } from "react-icons/io5";
import { useLogoutUser } from "../Hooks/usersHooks";
import { useRouter } from "next/router";
import useCustomerLiveTrackingStore from "@/store/customerLiveTrackingStore";
import io from "socket.io-client";
import usePropertyChatStore from "@/store/propertyChatStore";
import { toast } from "react-toastify";
import { useSocketStore } from "@/store/socketStore";

interface MobileProps extends FlexProps {
  onOpen: () => void;
  sidebarReducedData: { isReduced: boolean; ReducedMode: boolean };
  setSidebarReducedData: React.Dispatch<
    React.SetStateAction<{ isReduced: boolean; ReducedMode: boolean }>
  >;
  user: any;
  title?: string;
}

const MobileNav = ({
  onOpen,
  sidebarReducedData,
  setSidebarReducedData,
  title,
  user,
  ...rest
}: MobileProps) => {
  const router = useRouter();

  const baseurl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const { customers, upsertCustomer } = useCustomerLiveTrackingStore();
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const navigator = useRouter();
  const logoutMutation = useLogoutUser();

  // Detect if we're on mobile/tablet to show the menu button
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });
  const { socket } = useSocketStore();

  async function hadleLogout() {
    try {
      await logoutMutation.mutateAsync();
      navigator.push("/sign-in");
    } catch (error) {}
  }

  // Notification permission request
  useEffect(() => {
    if ("Notification" in window && "serviceWorker" in navigator) {
      // console.log("Notifications are supported ✅");
    }
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        // console.log("Notification permission granted ✅");
      } else {
        // console.log("Notification permission denied ❌");
      }
    });
  }, []);

  // recieving live monitoring data from the socket and notification handling
  useEffect(() => {
    if (!socket) return;
    const handleLiveMonitoringData = (data: any) => {
      upsertCustomer(data);
      if (Notification.permission === "granted") {
        new Notification("User Activity Notification", {
          body: `New user activity detected on page ${data.currentUrl}`,
          icon: "/Logo.svg",
        });
      }
    };

    socket.on("receive-live-monitoring-data", handleLiveMonitoringData);

    return () => {
      socket.off("receive-live-monitoring-data", handleLiveMonitoringData);
    };
  }, [socket]);

  // Receiving supportAgent needed notifications via socket
  useEffect(() => {
    if (!socket) return;

    const handleSupportAgentNeeded = (socketMsg: any) => {
      toast.info("New Support Agent Needed Request");
    };
    socket.on("support-agent-needed", handleSupportAgentNeeded);

    // cleanup old listener on re-render/unmount
    return () => {
      socket.off("support-agent-needed", handleSupportAgentNeeded);
    };
  }, [socket]);

  // recieving new chat message data from the socket and notification handling

  return (
    <Stack position="fixed" w={"100%"} zIndex="10">
      <Flex
        ml={{
          base: 0, // No left margin on mobile since sidebar is hidden
          md: sidebarReducedData.isReduced ? 16 : 60, // Adjusted for new responsive sidebar
          lg: sidebarReducedData.isReduced ? 20 : 60,
        }}
        px={{ base: 4, md: 4 }}
        pt={{ base: "none", md: "1rem" }}
        height="20"
        alignItems={"center"}
        bg={"rgba(26, 99, 255, 0.09);"}
        zIndex={"1000"}
        borderBottomWidth="0px"
        borderBottomColor={useColorModeValue("gray.200", "gray.700")}
        justifyContent={{ base: "space-between", md: "space-between" }}
        {...rest}
      >
        {/* Page Title */}
        {(!isMobile || isTablet) && (
          <Heading fontWeight={"500"}>{title}</Heading>
        )}
        {/* Left side - Menu button (only on mobile/tablet) */}
        {(isMobile || isTablet) && (
          <Flex alignItems="center">
            <IconButton
              icon={<FiMenu />}
              aria-label="Open sidebar menu"
              variant="ghost"
              onClick={onOpen} // This opens the mobile drawer
              _hover={{
                bg: "gray.200",
                color: "blue.500",
                transform: "scale(1.1)",
              }}
              color={"black"}
              size="lg"
              fontSize="22px"
            />
          </Flex>
        )}

        {/* Right box of icons */}
        <Flex ms={"auto"} gap={10} alignItems="center" mb={5}>
          <Box position="relative" display="inline-block">
            {/* Badge */}
            {customers.length > 0 && (
              <Badge
                position="absolute"
                top="-1"
                right="-1"
                px={2}
                py={1}
                borderRadius="full"
                bg="red.500"
                color="white"
                fontSize="xs"
                fontWeight="bold"
                zIndex={1}
              >
                {customers.length}
              </Badge>
            )}

            {/* Icon Button */}
            <IconButton
              onClick={() => router.push("/dashboard/live-monitoring")}
              icon={
                <TbDeviceAnalytics
                  style={{ fontSize: "20px", color: "currentColor" }}
                />
              }
              aria-label="Analytics"
              variant="ghost"
              _hover={{
                bg: "gray.200",
                color: "blue.500",
                transform: "scale(1.1)",
              }}
              color={"black"}
              mx={"auto"}
            />
          </Box>

          <IconButton
            icon={
              <IoChatboxOutline
                style={{ fontSize: "20px", color: "currentColor" }}
              />
            }
            aria-label="Chat"
            variant="ghost"
            _hover={{
              bg: "gray.200", // Background color on hover
              color: "blue.500", // Icon color on hover
              transform: "scale(1.1)", // Optional: slight scaling effect
            }}
            color={"black"}
            mx={"auto"}
          />

          <IconButton
            icon={
              <IoMdLogOut style={{ fontSize: "20px", color: "currentColor" }} />
            }
            aria-label="Logout"
            variant="ghost"
            _hover={{
              bg: "gray.200", // Background color on hover
              color: "blue.500", // Icon color on hover
              transform: "scale(1.1)", // Optional: slight scaling effect
            }}
            color={"black"}
            mx={"auto"}
            onClick={hadleLogout}
          />

          <ExpandableAvatarCard user={user}></ExpandableAvatarCard>
        </Flex>
      </Flex>
    </Stack>
  );
};

export default MobileNav;
