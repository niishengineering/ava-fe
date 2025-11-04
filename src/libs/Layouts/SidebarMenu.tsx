import { Flex, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { TbLayoutDashboard } from "react-icons/tb";
import { RiContactsLine } from "react-icons/ri";
import { HiOutlineInboxIn } from "react-icons/hi";
import { GoGraph } from "react-icons/go";
import { SiKnowledgebase } from "react-icons/si";
import { IoSettingsOutline } from "react-icons/io5";
import React from "react";

interface SideBarProp {
  isreduced: boolean;
}

const SidebarMenu: React.FC<SideBarProp> = ({ isreduced }) => {
  const router = useRouter();
  return (
    <Flex mb={5} gap={5} flexDirection="column">
      <Button
        leftIcon={<TbLayoutDashboard style={{ fontSize: "20px" }} />}
        aria-label="Dashboard"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
        onClick={() => router.push("/dashboard")}
      >
        {!isreduced && "Dashboard"}
      </Button>

      <Button
        leftIcon={<HiOutlineInboxIn style={{ fontSize: "20px" }} />}
        aria-label="Inbox"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
        onClick={() => router.push("/dashboard/inbox")}
      >
        {!isreduced && "Inbox"}
      </Button>

      <Button
        leftIcon={<RiContactsLine style={{ fontSize: "20px" }} />}
        aria-label="Contacts"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
        onClick={() => router.push("/dashboard/contacts")}
      >
        {!isreduced && "Contacts"}
      </Button>

      <Button
        leftIcon={<SiKnowledgebase style={{ fontSize: "20px" }} />}
        aria-label="Knowledge Base"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
        onClick={() => router.push("/dashboard/knowledge-base")}
      >
        {!isreduced && "Knowledge Base"}
      </Button>

      <Button
        leftIcon={<GoGraph style={{ fontSize: "20px" }} />}
        aria-label="Analytics"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
      >
        {!isreduced && "Analytics"}
      </Button>

      <Button
        leftIcon={<IoSettingsOutline style={{ fontSize: "20px" }} />}
        aria-label="Settings"
        variant="ghost"
        justifyContent={isreduced ? "center" : "flex-start"}
        _hover={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        _active={{
          bg: "gray.200",
          color: "blue.500",
          transform: "scale(1.05)",
        }}
        color="white"
        w={"100%"}
        onClick={() => router.push("/dashboard/settings")}
      >
        {!isreduced && "Settings"}
      </Button>
    </Flex>
  );
};

export default SidebarMenu;
