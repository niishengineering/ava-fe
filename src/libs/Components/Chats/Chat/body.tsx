import { Flex, Box, Image, Text, Spinner } from "@chakra-ui/react";
import { ChatJoinNotification, ChatLeaveNotification } from "./JoinedChat";

interface ChatBodyProps {
  boxRef: React.RefObject<HTMLDivElement>;
  darkMode: boolean;
  messageIsSending?: boolean;
  parentUrl?: string;
  displayColor: string | undefined;
  textColor: string;
  welcomeMessage: string | undefined;
  setDarkMode: (value: boolean) => void;
  customerMessages: any[];
  customerMessagesLoading?: boolean;
  customerid: string;
  createDarkFromColor: (color: string | undefined) => string;
  createLightFromColor: (color: string | undefined) => string;
  getChatSentTime: (date: Date | undefined) => string;
  suggestedMessage?: string[];
  sendSuggestedMessage: (message: string) => void;
}

const ChatBody = (props: ChatBodyProps) => {
  const {
    boxRef,
    darkMode,
    parentUrl,
    displayColor,
    textColor,
    welcomeMessage,
    setDarkMode,
    customerMessages,
    customerMessagesLoading,
    customerid,
    createDarkFromColor,
    createLightFromColor,
    getChatSentTime,
    suggestedMessage,
    sendSuggestedMessage,
    messageIsSending,
  } = props;

  return (
    <Box
      as="main"
      flex="1"
      ref={boxRef}
      overflowY="auto"
      pt={{ lg: "8rem", md: "5rem", sm: "2rem", base: "2rem" }}
      pb="8rem"
      px="1rem"
      bg={darkMode ? "gray.900" : "white"} // Optional: background color change
      color={darkMode ? "white" : "black"} // Optional: text color change
    >
      <div className="hidden">
        <h1>Chat Widget</h1>
        {parentUrl ? (
          <p>Parent Page URL: {parentUrl}</p>
        ) : (
          <p>Waiting for Parent URL...</p>
        )}
        {/* Optional: Dark mode toggle button */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>
      <Box>
        {customerMessagesLoading && (
          <Flex
            w={"100%"}
            h={"90vh"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Spinner size="md" ml={2} color={displayColor} />
          </Flex>
        )}
        <Flex
          bg={displayColor}
          p={{ base: "0.8rem", lg: "2rem" }}
          mt={"2rem"}
          maxWidth={"50%"}
          fontSize={"20px"}
          color={textColor}
          width={"fit-content"}
          borderTopLeftRadius={"12px"}
          borderTopRadius={"12px"}
          borderBottomLeftRadius={"0"}
          borderBottomRightRadius={"12px"}
        >
          <Text
            fontSize={{
              lg: "large",
              md: "medium",
              sm: "small",
              base: "small",
            }}
          >
            {welcomeMessage}
          </Text>
        </Flex>
        {customerMessages?.map((message: any, index: number) => {
          const isCustomer = message?.senderId == customerid;
          const bgColor = isCustomer
            ? createDarkFromColor(displayColor)
            : createLightFromColor(displayColor);
          const textColor = isCustomer ? "white" : "black";

          // IMAGE + TEXT
          if (message?.imageContent && message?.messageContent) {
            return (
              <Flex
                key={index}
                flexDir={"column"}
                ml={isCustomer ? "auto" : "0"}
                maxWidth={{
                  base: "80%",
                  sm: "80%",
                  md: "50%",
                  lg: "50%",
                }}
                bg={bgColor}
                color={textColor}
                p={{ base: "0.3rem", lg: "2rem" }}
                mt={"2rem"}
                fontSize={"20px"}
                width={"fit-content"}
                borderTopLeftRadius={"12px"}
                borderTopRadius={"12px"}
                borderBottomLeftRadius={isCustomer ? "12px" : "0"}
                borderBottomRightRadius={isCustomer ? "0" : "12px"}
              >
                <Text
                  fontSize={{
                    lg: "large",
                    md: "medium",
                    sm: "small",
                    base: "small",
                  }}
                >
                  {message?.messageContent}
                </Text>
                <Image src={message?.imageContent} alt="Image" />
              </Flex>
            );
          }

          // TEXT ONLY
          if (message?.messageContent) {
            return (
              <Flex
                key={index}
                ml={isCustomer ? "auto" : "0"}
                flexDir={"column"}
                maxWidth={{
                  base: "80%",
                  sm: "80%",
                  md: "50%",
                  lg: "50%",
                }}
                bg={bgColor}
                color={textColor}
                p={{ base: "0.8rem", lg: "2rem" }}
                mt={"2rem"}
                fontSize={"20px"}
                width={"fit-content"}
                borderTopLeftRadius={"12px"}
                borderTopRadius={"12px"}
                borderBottomLeftRadius={isCustomer ? "12px" : "0"}
                borderBottomRightRadius={isCustomer ? "0" : "12px"}
              >
                <Text
                  fontSize={{
                    lg: "large",
                    md: "medium",
                    sm: "small",
                    base: "small",
                  }}
                >
                  {message?.messageContent}
                </Text>
                <Text
                  ml={"auto"}
                  fontSize={{
                    lg: "x-small",
                    md: "x-small",
                    sm: "xx-small",
                    base: "xx-small",
                  }}
                  color={isCustomer ? "rgba(255,255,255,0.7)" : "GrayText"}
                >
                  {getChatSentTime(message?.sentAt)}
                </Text>
              </Flex>
            );
          }

          if (message?.notificationContent?.type === "join") {
            return (
              <ChatJoinNotification
                userName={message?.notificationContent?.username}
                timestamp={message?.notificationContent?.timestamp}
                key={index}
              />
            );
          }

          if (message?.notificationContent?.type === "leave") {
            return (
              <ChatLeaveNotification
                userName={message?.notificationContent?.username}
                timestamp={message?.notificationContent?.timestamp}
                key={index}
              />
            );
          }

          // IMAGE ONLY
          if (message?.imageContent) {
            return (
              <Flex
                key={index}
                ml={isCustomer ? "auto" : "0"}
                maxWidth={{
                  base: "90%",
                  sm: "90%",
                  md: "70%",
                  lg: "50%",
                }}
                bg={bgColor}
                color={textColor}
                p={{
                  base: "0.3rem",
                  sm: "0.5rem",
                  md: "1rem",
                  lg: "1rem",
                }}
                mt={"2rem"}
                fontSize={"20px"}
                width={"fit-content"}
                borderTopLeftRadius={"12px"}
                borderTopRadius={"12px"}
                borderBottomLeftRadius={isCustomer ? "12px" : "0"}
                borderBottomRightRadius={isCustomer ? "0" : "12px"}
              >
                <Image src={message?.imageContent} alt="Image" />
              </Flex>
            );
          }
        })}
        <Spinner
          display={messageIsSending ? "block" : "none"}
          size="sm"
          ml={2}
          color={displayColor}
          mt={"2rem"}
        />
      </Box>

      <Box display={customerMessages?.length === 0 ? "block" : "none"}>
        {suggestedMessage &&
          suggestedMessage?.map((message) => {
            return (
              <Flex
                key={message}
                ml={"auto"}
                onClick={() => sendSuggestedMessage(message)}
                flexDir={"column"}
                maxWidth={{ base: "80%", sm: "80%", md: "50%", lg: "50%" }}
                border={`1px solid ${displayColor}`}
                cursor={"pointer"}
                color={displayColor}
                p={{ base: "0.8rem", lg: "2rem" }}
                mt={"1rem"}
                fontSize={"20px"}
                width={"fit-content"}
                borderTopLeftRadius={"12px"}
                borderTopRadius={"12px"}
                borderBottomLeftRadius={"12px"}
                borderBottomRightRadius={"0"}
              >
                <Text
                  fontSize={{
                    lg: "large",
                    md: "medium",
                    sm: "small",
                    base: "small",
                  }}
                >
                  {message}
                </Text>
              </Flex>
            );
          })}
      </Box>
    </Box>
  );
};

export default ChatBody;
