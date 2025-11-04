import { Flex, IconButton, Box, Image, Text, Avatar } from "@chakra-ui/react";
import { FaChevronLeft, FaTimes, FaMinus } from "react-icons/fa";

interface ChatHeaderProps {
  logo?: string;
  propertyName: string | undefined;
  color: string;
  goHome: () => void;
  toggleWidget: () => void;
}

const ChatHeader = (props: ChatHeaderProps) => {
  const { logo, propertyName, color, toggleWidget, goHome } = props;

  return (
    <Box
      as="header"
      background={color}
      color="white"
      p="16px"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mt={1}
      ml={1}
      mr={1}
      minH="64px"
      borderTopRightRadius={12}
      borderTopLeftRadius={12}
    >
      <Flex alignItems="center" gap="12px">
        <IconButton
          icon={<FaChevronLeft />}
          aria-label="Back"
          variant="ghost"
          color="white"
          onClick={goHome}
          size="sm"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
        />

        {logo ? (
          <Image
            src={logo}
            alt="Logo"
            boxSize="32px"
            borderRadius="full" // Makes it circular like the Avatar
            objectFit="cover"
          />
        ) : (
          <Avatar
            size="sm"
            bg="orange.400"
            icon={<Text fontSize="sm">🤖</Text>}
          />
        )}

        <Text fontSize="lg" fontWeight="600">
          {propertyName?.toLocaleUpperCase() || "Chat Widget"}
        </Text>
      </Flex>
      <IconButton
        icon={<FaMinus />}
        aria-label="Close chat"
        variant="ghost"
        color="white"
        size="sm"
        _hover={{ bg: "rgba(255,255,255,0.1)" }}
        onClick={toggleWidget}
      />
    </Box>
  );
};

export default ChatHeader;
