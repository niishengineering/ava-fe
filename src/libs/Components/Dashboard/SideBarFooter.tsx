import { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Avatar,
  Input,
  Text,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FaRegQuestionCircle } from "react-icons/fa";
import { CiBellOn } from "react-icons/ci";
import { useGetUserInfo } from "@/libs/Hooks/usersHooks";

interface SideBarFooterProps {
  isSidebarReduced: boolean;
}

const SideBarFooter: React.FC<SideBarFooterProps> = ({ isSidebarReduced }) => {
  const { data: userData } = useGetUserInfo();
  const [user, setUser] = useState(userData?.user || {});

  useEffect(() => {
    console.log("user-from-data", userData);
    setUser(userData?.user);
  }, [userData]);

  return (
    <Box my={"auto"} w={"100%"}>
      <Flex
        px={5}
        gap={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={isSidebarReduced ? "column" : "row"}
      >
        <Box p={2}>
          <Avatar
            name={`${user?.firstName} ${user?.lastName}`}
            src=""
            size="sm"
            bg="teal.500"
          />
        </Box>

        <Flex gap={3} flexDir={isSidebarReduced ? "column" : "row"}>
          <IconButton
            icon={
              <FaRegQuestionCircle
                style={{ fontSize: "20px", color: "currentColor" }}
              />
            }
            aria-label="Insert emoji"
            variant="ghost"
            _hover={{
              bg: "gray.200", // Background color on hover
              color: "blue.500", // Icon color on hover
              transform: "scale(1.1)", // Optional: slight scaling effect
            }}
            color={"white"}
            mx={"auto"}
          />
          <IconButton
            icon={
              <CiBellOn style={{ fontSize: "20px", color: "currentColor" }} />
            }
            aria-label="Insert emoji"
            variant="ghost"
            _hover={{
              bg: "gray.200", // Background color on hover
              color: "blue.500", // Icon color on hover
              transform: "scale(1.1)", // Optional: slight scaling effect
            }}
            color={"white"}
            mx={"auto"}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default SideBarFooter;
