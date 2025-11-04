import {
  Flex,
  IconButton,
  Box,
  Image,
  Input,
  CloseButton,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import FileUploadButton from "@/libs/Components/fileUploadButton";
import TypingIndicator from "./TypingIndicator";

interface ChatFooterProps {
  message: string;
  image: File | null;
  isTyping: boolean;
  removeSelectedImage: () => void;
  onFileSelect: (file: File) => void;
  sendMessageHandler: () => void;
  setMessage: (value: string) => void;
}

const ChatFooter = (props: ChatFooterProps) => {
  const {
    onFileSelect,
    image,
    removeSelectedImage,
    sendMessageHandler,
    message,
    setMessage,
    isTyping,
  } = props;

  return (
    <Box
      as="footer"
      height={{ base: "1rem", lg: "8rem" }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="1000"
    >
      <Box>
        <Box
          alignItems="center"
          justifyContent="center"
          p="0.5rem"
          bg="white"
          width="100%"
          position="fixed"
          bottom="16"
          left="0"
          zIndex="1000"
        >
          <TypingIndicator isTyping={isTyping} />
        </Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          p="0.5rem"
          borderTop="1px solid #e0e0e0"
          bg="white"
          width="100%"
          position="fixed"
          bottom="0"
          left="0"
          zIndex="1000" // Ensures it stays above other content
          // paddingX={{ base: 0, sm: 0, md: "2rem", lg: "6rem" }} // Add horizontal padding
          boxShadow="0 -2px 5px rgba(0, 0, 0, 0.1)" // Optional: Add a shadow for better visibility
        >
          {/* Attachment Icon */}

          <FileUploadButton onFileSelect={onFileSelect}></FileUploadButton>

          {/* message input and image previewer */}
          <Box
            flexBasis="100%"
            border={"1px solid grey"}
            borderRadius={"24px"}
            flexDir={"column"}
          >
            {/* image preview */}
            {image && (
              <Box
                position="relative"
                w={{ base: "50px", sm: "50px", md: "100px", lg: "100px" }}
                ml="2rem"
                mt="1rem"
                mr="1rem"
              >
                <Image
                  src={URL.createObjectURL(image)} // Create a URL for the selected image
                  alt="Preview"
                  boxSize={{
                    base: "50px",
                    sm: "50px",
                    md: "100px",
                    lg: "100px",
                  }}
                  objectFit="cover"
                  borderRadius="md"
                />
                <CloseButton
                  size={{ base: "sm", sm: "sm", md: "sm", lg: "sm" }}
                  boxSize={{
                    base: "15px",
                    sm: "15px",
                    md: "25px",
                    lg: "30px",
                  }}
                  position="absolute"
                  top="5px"
                  right="5px"
                  onClick={removeSelectedImage} // Remove image preview
                  bg="rgba(0, 0, 0, 0.6)" // Optional: add a dark background to make the button more visible
                  color="white" // Optional: make the 'X' white for better visibility
                  _hover={{ bg: "rgba(0, 0, 0, 0.8)" }} // Optional: darker hover effect
                />
              </Box>
            )}

            {/* Text Input */}
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              border={"none"}
              borderRadius={"12px"}
              variant="unstyled"
              p={{ base: "0.5rem", sm: "2rem", lg: "2rem" }}
            />
          </Box>

          <IconButton
            icon={<IoMdSend />}
            aria-label="Insert emoji"
            variant="ghost"
            size="lg"
            color="gray.600"
            onClick={() => sendMessageHandler()}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default ChatFooter;
