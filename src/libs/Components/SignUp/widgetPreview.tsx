import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Input,
  Text,
  Avatar,
  Button,
} from "@chakra-ui/react";
import { CloseIcon, ArrowBackIcon, HamburgerIcon } from "@chakra-ui/icons";
import { useEffect } from "react";

interface WidgetPreviewComponentProps {
    welcomeMessage : string 
    color : string
    suggestedMessages : string[]
}

const WidgetPreviewComponent: React.FC<WidgetPreviewComponentProps> = ({welcomeMessage,color,suggestedMessages}) => {
  return (
    <Flex
      direction="column"
      w={["100%", "400px"]}
      h="500px"
      border="1px solid #e2e2e2"
      borderRadius="lg"
      boxShadow="md"
      overflow="hidden"
      bg="white"
    >
      {/* Header */}
      <Flex bg={color} p={2} align="center" justify="space-between" color="white">
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          variant="ghost"
          color="white"
        />
        <Text fontWeight="bold">Chat</Text>
        <Flex>
          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            color="white"
          />
          <IconButton
            aria-label="Close"
            icon={<CloseIcon />}
            variant="ghost"
            color="white"
          />
        </Flex>
      </Flex>

      {/* Chat Area */}
      <Flex flex="1" direction="column" p={4} overflowY="auto">
        <Flex align="center" mb={2}>
          <Avatar size="sm" mr={2} />
          <Box bg={color} color="white" px={4} py={2} borderRadius="lg">
            {welcomeMessage}
          </Box>
        </Flex>
        <Flex flexDir={'column'} ml={'auto'}>
            {suggestedMessages.map((message,index)=>{
                return(
                    <Box border={'1px solid'} mb={'0.5rem'} key={index} borderColor={color} color={color} px={4} py={2} borderRadius="lg">
                    {message}
                  </Box>
                )
            })}
   
       
        </Flex>
      </Flex>

      {/* Footer */}
      <Box borderTop="1px solid #e2e2e2" p={4}>
        <Flex align="center" mb={2}>
          <Text fontSize="sm" color="gray.500">
            🌱 Add free <Text as="span" fontWeight="bold">live chat</Text> to your site
          </Text>
        </Flex>
        <Flex align="center">
          <Input
            placeholder="Type here and press enter..."
            flex="1"
            borderRadius="md"
            mr={2}
          />
          <Button variant="ghost" colorScheme="gray">
            👍
          </Button>
          <Button variant="ghost" colorScheme="gray">
            ✏️
          </Button>
          <Button variant="ghost" colorScheme="gray">
            😊
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default WidgetPreviewComponent;
