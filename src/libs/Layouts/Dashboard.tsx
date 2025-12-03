// Profile - Mobile Friendly Version
import React, { ReactNode, useContext, useEffect, useState } from "react";

import {
  IconButton,
  Box,
  Flex,
  useColorModeValue,
  Drawer,
  Image,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  useBreakpointValue,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import { TfiControlBackward } from "react-icons/tfi";
import { FiAlignRight } from "react-icons/fi";
import { RiUserFollowLine } from "react-icons/ri";
import { GrCodeSandbox } from "react-icons/gr";
import GroupChatComponent from "../Components/Dashboard/GroupChat";
import SideBarFooter from "../Components/Dashboard/SideBarFooter";
import { useGetUserInfo } from "../Hooks/usersHooks";
import useUserStore from "@/store/userStore";
import usePropertyChatStore from "@/store/propertyChatStore";
import MobileNav from "./MobileNav";
import SidebarMenu from "./SidebarMenu";
import { useSocketStore } from "@/store/socketStore";

export default function SidebarWithHeader({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const [sidebarReducedData, setSidebarReducedData] = useState<any>({
    isReduced: false,
    ReducedMode: false,
  });
  const [user, setUser] = useState<object>();
  const { data: userInfo, isLoading, isError } = useGetUserInfo();

  // Responsive breakpoint values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false });

  const updateUser = useUserStore((state: any) => state.editUser);
  const updateSelectedProperty = usePropertyChatStore(
    (state: any) => state.editSelectedProperty
  );
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  // socket store
  const { socket, connectSocket, disconnectSocket } = useSocketStore();
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "";
  useEffect(() => {
    if (!userInfo?.user || !selectedProperty) return;

    connectSocket(baseUrl, userInfo.user.id, selectedProperty);

    return () => {
      disconnectSocket();
    };
  }, [userInfo, selectedProperty]);

  useEffect(() => {
    updateUser(userInfo?.user);
    updateSelectedProperty(userInfo?.user.properties[0]?.id);
    setUser(userInfo?.user);
  }, [userInfo]);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarReducedData({
        isReduced: true,
        ReducedMode: true,
      });
    }
  }, [isMobile]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      {/* Desktop Sidebar - Hidden on mobile */}
      <SidebarContent
        onClose={() => onClose}
        sidebarReducedData={sidebarReducedData}
        setSidebarReducedData={setSidebarReducedData}
        display={{ base: "none", md: "block" }}
      />

      {/* Mobile Drawer */}
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size={{ base: "xs", sm: "sm" }}
        lockFocusAcrossFrames={undefined}
      >
        <DrawerContent>
          <SidebarContent
            sidebarReducedData={{ isReduced: false, ReducedMode: false }}
            setSidebarReducedData={setSidebarReducedData}
            onClose={onClose}
            isMobileDrawer={true}
          />
        </DrawerContent>
      </Drawer>

      {/* Mobile Navigation */}
      <MobileNav
        sidebarReducedData={sidebarReducedData}
        setSidebarReducedData={setSidebarReducedData}
        user={user}
        onOpen={onOpen}
        title={title}
      />

      {/* Main Content */}
      <Box
        ml={{
          base: 0, // No margin on mobile
          md: sidebarReducedData.isReduced ? 16 : 60, // Responsive margin
          lg: sidebarReducedData.isReduced ? 20 : 60,
        }}
        minH={"100vh"}
        bg={"white"}
        p={{ base: 2, sm: 3, md: 5, lg: 10 }}
        overflowX={"auto"}
        pt={{ base: "4rem", md: "5rem" }} // Account for mobile nav
      >
        <Box
          bg={"white"}
          w={"full"}
          mt={{ base: 4, md: 12 }}
          px={{ base: 1, sm: 2, md: 1, lg: 1 }}
          overflowY={"auto"}
          h={{ base: "calc(100vh - 8rem)", md: "85vh" }}
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none", // IE/Edge
            "scrollbar-width": "none", // Firefox
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
  sidebarReducedData: { isReduced: boolean; ReducedMode: boolean };
  setSidebarReducedData: React.Dispatch<
    React.SetStateAction<{ isReduced: boolean; ReducedMode: boolean }>
  >;
  isMobileDrawer?: boolean;
}

const SidebarContent = ({
  onClose,
  sidebarReducedData,
  setSidebarReducedData,
  isMobileDrawer = false,
  ...rest
}: SidebarProps) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeNav, setActiveNav] = useState<any>(null);

  // Don't show hover effects on mobile
  const isMobile = useBreakpointValue({ base: true, md: false });

  function toggleExpandSideBar() {
    if (!isMobile) {
      setSidebarReducedData((prevData) => ({
        isReduced: false,
        ReducedMode: !prevData.ReducedMode,
      }));
    }
  }

  const sidebarWidth = isMobileDrawer
    ? "100%"
    : {
        base: 16, // Smaller on mobile when visible
        md: sidebarReducedData.isReduced ? 16 : 60,
        lg: sidebarReducedData.isReduced ? 20 : 60,
      };

  const shouldShowHoverEffects = !isMobile && !isMobileDrawer;

  return (
    <Box
      transition="0.3s ease"
      bg={"#101828"}
      borderRight="0px"
      borderRightColor={"gray.200"}
      w={sidebarWidth}
      pos="fixed"
      h="full"
      zIndex="20"
      {...rest}
      onMouseEnter={() => {
        if (shouldShowHoverEffects && sidebarReducedData.ReducedMode) {
          setSidebarReducedData((prevData) => ({
            isReduced: false,
            ReducedMode: true,
          }));
        }
      }}
      onMouseLeave={() => {
        if (shouldShowHoverEffects && sidebarReducedData.ReducedMode) {
          setSidebarReducedData((prevData) => ({
            isReduced: true,
            ReducedMode: true,
          }));
        }
      }}
    >
      {/* Sidebar Header */}
      <Flex
        h="10vh"
        alignItems="center"
        mx="0"
        justifyContent={isMobileDrawer ? "space-around" : "space-between"}
        px={isMobileDrawer ? 4 : 2}
        flexWrap="wrap"
      >
        <IconButton
          icon={
            <GrCodeSandbox
              style={{
                fontSize: isMobileDrawer ? "18px" : "16px",
                color: "currentColor",
              }}
            />
          }
          aria-label="Code Sandbox"
          variant="ghost"
          size={isMobileDrawer ? "md" : "sm"}
          _hover={{
            bg: "gray.700",
            color: "blue.300",
            transform: "scale(1.05)",
          }}
          color={"white"}
          display={
            isMobileDrawer
              ? "flex"
              : {
                  base: sidebarReducedData.isReduced ? "none" : "flex",
                  lg: sidebarReducedData.isReduced ? "none" : "flex",
                }
          }
        />

        <IconButton
          icon={
            <RiUserFollowLine
              style={{
                fontSize: isMobileDrawer ? "18px" : "16px",
                color: "currentColor",
              }}
            />
          }
          aria-label="User Follow"
          variant="ghost"
          size={isMobileDrawer ? "md" : "sm"}
          _hover={{
            bg: "gray.700",
            color: "blue.300",
            transform: "scale(1.05)",
          }}
          color={"white"}
          display={
            isMobileDrawer
              ? "flex"
              : {
                  base: sidebarReducedData.isReduced ? "none" : "flex",
                  lg: sidebarReducedData.isReduced ? "none" : "flex",
                }
          }
        />

        <IconButton
          icon={
            <FiAlignRight
              style={{
                fontSize: isMobileDrawer ? "18px" : "16px",
                color: "currentColor",
              }}
            />
          }
          aria-label="Align Right"
          variant="ghost"
          size={isMobileDrawer ? "md" : "sm"}
          _hover={{
            bg: "gray.700",
            color: "blue.300",
            transform: "scale(1.05)",
          }}
          color={"white"}
          display={
            isMobileDrawer
              ? "flex"
              : {
                  base: sidebarReducedData.isReduced ? "none" : "flex",
                  lg: sidebarReducedData.isReduced ? "none" : "flex",
                }
          }
        />

        {/* Only show collapse button on desktop */}
        {!isMobileDrawer && (
          <IconButton
            icon={
              <TfiControlBackward
                style={{
                  fontSize: "16px",
                  color: "currentColor",
                  transform: sidebarReducedData.isReduced
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                }}
              />
            }
            aria-label="Toggle Sidebar"
            variant="ghost"
            size="sm"
            _hover={{
              bg: "gray.700",
              color: "blue.300",
              transform: "scale(1.05)",
            }}
            onClick={() => toggleExpandSideBar()}
            color={"white"}
          />
        )}
      </Flex>

      {/* Logo Section */}
      <Box
        p={isMobileDrawer ? 4 : sidebarReducedData.isReduced ? 2 : 2}
        borderTop={"1px solid rgba(255, 255, 255, 0.31)"}
        borderBottom={"1px solid rgba(255, 255, 255, 0.31)"}
        display={"flex"}
        h={"10vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {sidebarReducedData.isReduced ? (
          <Image
            src="/slogo.svg"
            alt="Logo"
            maxH={isMobileDrawer ? "40px" : "32px"}
            mx="auto"
          />
        ) : (
          <Image
            src="/Logo.svg"
            alt="Logo"
            maxH={isMobileDrawer ? "40px" : "32px"}
            mx="auto"
          />
        )}
      </Box>

      {/* Sidebar Content */}
      <Flex
        gap={3}
        p={isMobileDrawer ? 4 : sidebarReducedData.isReduced ? 2 : 5}
        flexDir={"column"}
        overflowY="auto"
        h={sidebarReducedData.isReduced ? "50vh" : "70vh"}
        flex="1"
        sx={{
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none", // IE/Edge
          "scrollbar-width": "none", // Firefox
        }}
      >
        <GroupChatComponent
          isSidebarReduced={
            isMobileDrawer ? false : sidebarReducedData.isReduced
          }
        />
        <SidebarMenu
          isreduced={isMobileDrawer ? false : sidebarReducedData.isReduced}
        />
      </Flex>

      {/* Sidebar Footer */}
      <Box h={sidebarReducedData.isReduced ? "30vh" : "10vh"} display={"flex"}>
        <SideBarFooter
          isSidebarReduced={
            isMobileDrawer ? false : sidebarReducedData.isReduced
          }
        />
      </Box>
    </Box>
  );
};
