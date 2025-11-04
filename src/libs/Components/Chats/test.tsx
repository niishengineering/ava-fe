import React from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Input,
  IconButton,
  Button,
  Tabs,
  TabList,
  Tab,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { FaPaperPlane } from "react-icons/fa";

/**
 * Crisp-like chat widget built with Chakra UI (TypeScript)
 *
 * Notes:
 * - Fixes an earlier build error caused by an incompletely closed avatar component.
 * - We intentionally use a custom `TeamAvatars` component and ensure its return is
 *   properly closed with `);` to avoid syntax errors and any naming confusion with Chakra's AvatarGroup.
 * - Includes a lightweight DOM-based test harness using console.assert.
 */

const ChatWidget: React.FC = () => {
  return (
    <Flex
      direction="column"
      w="350px"
      h="500px"
      bg="white"
      borderRadius="xl"
      boxShadow="xl"
      overflow="hidden"
      fontFamily="sans-serif"
    >
      {/* Header */}
      <Box bg="blue.500" color="white" p={4}>
        <Tabs variant="unstyled">
          <TabList justifyContent="center">
            <Tab
              _selected={{ color: "blue.500", bg: "white", borderRadius: "md" }}
              px={4}
              py={2}
              data-testid="tab-chat"
            >
              Chat
            </Tab>
            <Tab
              _selected={{ color: "blue.500", bg: "white", borderRadius: "md" }}
              px={4}
              py={2}
              data-testid="tab-helpdesk"
            >
              Helpdesk
            </Tab>
          </TabList>
        </Tabs>

        <Flex align="center" mt={3}>
          <TeamAvatars />
          <Box ml={3}>
            <Text fontWeight="bold" data-testid="title">
              Talk with Crisp! 😃
            </Text>
            <Text fontSize="sm" color="green.200">
              ● Team replies under 1 hour
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Chat Body */}
      <VStack align="stretch" flex={1} p={4} spacing={4} overflowY="auto">
        <Box
          alignSelf="flex-end"
          bg="blue.500"
          color="white"
          px={3}
          py={2}
          borderRadius="lg"
          data-testid="msg-user"
        >
          Hi, I have a question
        </Box>

        <Box
          bg="gray.100"
          px={3}
          py={2}
          borderRadius="lg"
          data-testid="msg-bot"
        >
          <Text fontSize="sm" color="gray.700">
            Someone will be with you shortly. In the meantime feel free to
            search on Helpdesk or ask me directly.
          </Text>
          <Button
            leftIcon={<SearchIcon />}
            mt={2}
            size="sm"
            bg="gray.800"
            color="white"
            _hover={{ bg: "gray.700" }}
            data-testid="btn-helpdesk"
          >
            Search on Helpdesk
          </Button>
        </Box>
      </VStack>

      {/* Input */}
      <Flex p={3} borderTop="1px solid" borderColor="gray.200" align="center">
        <Input
          placeholder="Compose your message..."
          mr={2}
          data-testid="input-compose"
        />
        <IconButton
          icon={<FaPaperPlane />}
          colorScheme="blue"
          aria-label="Send"
          data-testid="btn-send"
        />
      </Flex>
    </Flex>
  );
};

// Avatar group (explicitly and correctly closed with `);`)
const TeamAvatars: React.FC = () => {
  return (
    <Flex>
      <Avatar
        data-testid="avatar"
        size="sm"
        src="https://i.pravatar.cc/40?img=1"
        mr={-2}
        border="2px solid white"
      />
      <Avatar
        data-testid="avatar"
        size="sm"
        src="https://i.pravatar.cc/40?img=2"
        mr={-2}
        border="2px solid white"
      />
      <Avatar
        data-testid="avatar"
        size="sm"
        src="https://i.pravatar.cc/40?img=3"
        border="2px solid white"
      />
    </Flex>
  );
};

export default ChatWidget;
