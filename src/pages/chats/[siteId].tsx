// 187cc495-e04a-48c0-a286-f9583fa511f4
import { IconButton, Box } from "@chakra-ui/react";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import {
  useCreateNewCustomer,
  useSendMessage,
  useGetCustomerChats,
  useGetCustomerChatMessages,
} from "@/libs/Hooks/customerHooks";
import { useStartChat } from "@/libs/Hooks/chatHooks";
import { useRecordAnalytics } from "@/libs/Hooks/analyticsHooks";
import { useGetWidgetProperty } from "@/libs/Hooks/propertyChatHook";
import { useRouter } from "next/router";
import { getChatSentTime } from "@/libs/utilities";
import ChatHeader from "@/libs/Components/Chats/Chat/header";
import ChatFooter from "@/libs/Components/Chats/Chat/footer";
import ChatBody from "@/libs/Components/Chats/Chat/body";
import HomeView from "@/libs/Components/Chats/Chat/HomeView";
import tinycolor from "tinycolor2";
import { CustomerInterface } from "@/libs/interface";
import { useTrackCustomerPageVisits } from "@/libs/Hooks/PageTrackerHooks";
import { SocketMessageCustomerInterface } from "@/libs/interface";

export default function Home() {
  const socket = useRef<any>();
  const boxRef = useRef<HTMLDivElement>(null);
  const [chatSessionId, setChatSessionId] = useState<string>();
  const [message, setMessage] = useState("");
  const [toggleWidgetData, setToggleWidgetData] = useState<boolean | null>(
    false
  );
  const [sendSocketMessage, setSendSocketMessage] = useState<any>(null);
  const [customer, setCustomer] = useState<CustomerInterface>();
  const [customerMessages, setcustomerMessages] = useState<any>([]);
  const [customerChats, setcustomerChats] = useState<any>(null);
  const [selectedChat, setSelectedChat] = useState<any>();
  const [image, setImage] = useState<File | null>(null);
  const [color, setColor] = useState<string>();
  const [welcomeMessage, setWelcomeMessage] = useState<string>();
  const [propertyName, setPropertyName] = useState<string>();
  const [logo, setLogo] = useState<string>();
  const [chatId, setChatId] = useState<string>();
  const [suggestedMessage, setSuggestedMessage] = useState<string[]>();
  const [messageIsSending, setMessageIsSending] = useState(false);
  const createCustomerMutation = useCreateNewCustomer();
  const sendMessageMutation = useSendMessage();
  const pageTrackerMutation = useTrackCustomerPageVisits();
  const startChatMutation = useStartChat();
  const [isTyping, setIsTyping] = useState(false);
  const {
    data: chatMessages,
    isLoading: chatMessagesLoading,
    isError: chatMessagesError,
  } = useGetCustomerChatMessages(chatId as string);
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const router = useRouter();
  const { siteId } = router.query;
  const {
    data: customerChatsData,
    isLoading,
    isError,
    refetch: reFecthChats,
  } = useGetCustomerChats(customer?.id as string);
  const {
    data: widgetProperty,
    isLoading: widgetIsLoading,
    isError: widgetIsError,
  } = useGetWidgetProperty(siteId);
  const recordAnalyticMutation = useRecordAnalytics();

  //color scheme variables
  // Add this helper function to lighten colors for dark mode
  const lightenColor = (color: any, amount = 0.4) => {
    // Remove # if present
    const hex = color.replace("#", "");

    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Lighten each component
    const newR = Math.min(255, Math.round(r + (255 - r) * amount));
    const newG = Math.min(255, Math.round(g + (255 - g) * amount));
    const newB = Math.min(255, Math.round(b + (255 - b) * amount));

    // Convert back to hex
    return `#${newR.toString(16).padStart(2, "0")}${newG
      .toString(16)
      .padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
  };

  // Assuming you have a darkMode state somewhere in your component
  const [darkMode, setDarkMode] = useState(false); // Add this to your component state

  // Calculate the appropriate color based on mode
  const displayColor = darkMode ? lightenColor(color) : color;
  const textColor = darkMode ? "black" : "white";

  function toggleWidget() {
    setToggleWidgetData(!toggleWidgetData);

    //  send the width and height to the parent iframe window

    if (window.parent) {
      window.parent.postMessage(
        toggleWidgetData
          ? { height: 60, width: 60 }
          : { height: 500, width: 400 },
        "*"
      );
    }
  }

  function createGradientFromColor(baseColor: string | undefined) {
    const color = tinycolor(baseColor);

    const lighter = color.lighten(25).toString();
    const darker = color.darken(24).toString();

    return `linear-gradient(135deg, ${lighter}, ${darker})`;
  }

  function createDarkFromColor(color: string | undefined) {
    const darkColor = tinycolor(color).darken(1).toString();
    return darkColor;
  }

  function createLightFromColor(color: string | undefined) {
    const lightColor = tinycolor(color).lighten(40).toString();
    return lightColor;
  }

  function onFileSelect(file: File) {
    setImage(file);
  }

  function removeSelectedImage() {
    setImage(null);
  }

  async function createNewCustomer(data: any) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_IPINFO_API_KEY;

      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      const countryResponse = await fetch(
        `https://ipinfo.io/${ip}?token=${apiKey}`
      );

      const { country, city, region } = await countryResponse.json();

      const { customer } = await createCustomerMutation.mutateAsync({
        ...data,
        ip,
        country,
        city,
        region,
      });
      setCustomer(customer);
      return customer;
    } catch (err) {}
  }

  async function startChatHandler() {
    if (!customer) return;
    const response = await startChatMutation.mutateAsync({
      id: customer?.id,
      propertyChatId: siteId as string,
    });
    socket.current.emit("send-new-chat", {
      receiverId: siteId,
      chat: { chat: { ...response?.chat, customer }, lastMessage: null },
    });
    setSelectedChat(response?.chat);
    setChatId(response?.chat?.id);
  }

  async function sendMessageHandler() {
    try {
      setMessageIsSending(true);
      if (!image && !message) return;

      setMessage("");

      let messageContent;
      let imageContent;
      const sentAt = new Date();
      const id = customer?.id;

      // uploading image to cloudinary and getting the url
      if (image) {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME; // Add your cloud name to .env.local
        const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY; // Add your API key to .env.local
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET; // Add your upload preset to .env.local

        if (!apiKey || !uploadPreset) return;

        const formData = new FormData();
        formData.append("file", image);
        formData.append("api_key", apiKey);
        formData.append("upload_preset", uploadPreset);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        imageContent = data.secure_url;
      }

      if (message) {
        messageContent = message;
      }

      //  sending message to server and socket
      const data = await sendMessageMutation.mutateAsync({
        id,
        imageContent,
        messageContent,
        sentAt,
        chatId,
      });

      setcustomerMessages([...customerMessages, data.customerMessage]);

      if (!chatId || chatId === "new-chat") setChatId(data?.chat?.id);
      const socketData = {
        receiverId: siteId,
        message: data?.customerMessage,
        chat: data?.chat,
      };

      setSendSocketMessage(socketData);

      //  recording analyticData
      const date = new Date(Date.now()).toISOString().split("T")[0];
      recordAnalytics({
        siteId,
        date,
        customerId: customer?.id,
        updateChatCount: true,
      });

      //  clearing input field for next message
      setMessage("");
      removeSelectedImage();
      if (
        selectedChat?.chat?.mode === "ai" ||
        selectedChat?.chat?.mode === "manual"
      ) {
        setIsTyping(true);
      }
    } catch (error: any) {
    } finally {
      setMessageIsSending(false);
    }
  }

  async function sendSuggestedMessage(message: string) {
    const sentAt = new Date();
    const id = customer?.id;

    //  sending message to server and socket
    const data = await sendMessageMutation.mutateAsync({
      id,
      messageContent: message,
      sentAt,
      chatId,
    });

    setcustomerMessages([...customerMessages, data.customerMessage]);
    const socketData = {
      receiverId: customer?.id,
      message: data?.customerMessage,
      chat: selectedChat,
    };
    setSendSocketMessage(socketData);

    //  recording analyticData
    const date = new Date(Date.now()).toISOString().split("T")[0];
    recordAnalytics({
      siteId,
      date,
      customerId: customer?.id,
      updateChatCount: true,
    });

    //  clearing input field for next message
    setMessage("");
  }

  async function recordAnalytics(data: any) {
    recordAnalyticMutation.mutateAsync(data);
  }

  const [parentUrl, setParentUrl] = useState("");

  // revieving parent url
  useEffect(() => {
    const handleMessage = (event: any) => {
      const allowedOrigin = "*"; // Update to your new parent URL

      if (event.origin !== allowedOrigin) {
        console.warn("Ignored message from unknown origin:", event.origin);
        // return;
      }

      if (event.data && event.data.parentUrl) {
        setParentUrl(event.data.parentUrl);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  // sending live monitoring data through socket
  useEffect(() => {
    if (!parentUrl || !customer || !siteId) return;

    const socketData = {
      receiverId: siteId,
      data: { ...customer, currentUrl: parentUrl },
    };

    socket.current.emit("send-live-monitoring-data", socketData);
    pageTrackerMutation.mutateAsync({
      pageUrl: parentUrl,
      customerId: customer.id,
    });
  }, [parentUrl, customer, siteId, socket.current]);

  // recording analytics
  useEffect(() => {
    if (!siteId || !customer) return;
    const date = new Date(Date.now()).toISOString().split("T")[0];

    recordAnalytics({
      siteId,
      date,
      customerId: customer.id,
      updateChatCount: false,
    });
  }, [siteId, customer]);

  // new customer initailiazation
  useEffect(() => {
    if (!siteId) return;
    const oldChatSessionID = Cookies.get("chatSessionId");
    // Cookies.remove("chatSessionId", { secure: true, sameSite: "None" });
    // return;
    setChatSessionId(oldChatSessionID);
    if (!oldChatSessionID) {
      try {
        const newchatSessionId = uuidv4();
        setChatSessionId(newchatSessionId); // Generate unique session ID
        Cookies.set("chatSessionId", newchatSessionId, {
          expires: 30, // Expires in 30 days
          secure: true,
          sameSite: "None",
        });
        const date = new Date(Date.now()).toISOString();
        const data = { chatSessionId: newchatSessionId, siteId, date };
        if (siteId) createNewCustomer(data);
      } catch (error) {}
    } else {
      const data = { chatSessionId: oldChatSessionID, siteId };
      if (siteId) createNewCustomer(data);
    }
  }, [siteId]);

  // widget initailization
  useEffect(() => {
    // setting the orginal size of the chat widget
    window.parent.postMessage({ height: 60, width: 60 }, "*");

    //styling the widget
    setColor(widgetProperty?.data?.propertyColor);
    setSuggestedMessage(widgetProperty?.data?.suggestedMessages);
    setWelcomeMessage(widgetProperty?.data?.welcomeMessage);
    setPropertyName(widgetProperty?.data?.propertyName);
    setLogo(widgetProperty?.data?.propertyImage);
  }, [siteId, widgetProperty, customer]);

  // intializing customer chat
  useEffect(() => {
    setcustomerChats(customerChatsData?.chats);
  }, [customerChatsData]);

  // socket connection
  useEffect(() => {
    socket.current = io(`${baseURL}`); // Ensure the protocol is correct (http/https).
    const socketUserData = { userId: customer?.id, siteId };
    socket.current.emit("add-new-user", socketUserData);

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [customer]); // Empty dependency array

  // reciveing message with socket
  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveMessage = (data: any) => {
      if (!customerMessages) return;
      if (data.message.chatId !== selectedChat?.chat.id) return;
      setcustomerMessages((prev: any) => [...prev, data.message]);
      setIsTyping(false);
    };

    socket.current.on("receive-message", handleReceiveMessage);

    // cleanup
    return () => {
      socket.current.off("receive-message", handleReceiveMessage);
    };
  }, [socket.current, customerMessages]);

  // reciveing user has joined notification with socket

  useEffect(() => {
    if (!socket.current) return;

    const handleReceiveJoinNotification = (data: any) => {
      setcustomerMessages((prev: any) => [...prev, data.message]);
      setIsTyping(false);
    };

    socket.current.on(
      "receive-joined-chat-notification",
      handleReceiveJoinNotification
    );

    // cleanup
    return () => {
      socket.current.off(
        "receive-joined-chat-notification",
        handleReceiveJoinNotification
      );
    };
  }, [socket.current, customerMessages]);

  // recieved chat mode
  useEffect(() => {
    if (!socket.current) return;

    const handler = (data: any) => {
      if (!selectedChat) return;
      const chatWithNewMode = {
        chat: { ...selectedChat?.chat, mode: data.mode },
        lastMessage: selectedChat?.lastMessage,
      };
      setSelectedChat(chatWithNewMode);
    };

    socket.current.on("receive-chat-mode", handler);

    return () => {
      socket.current.off("receive-chat-mode", handler); // cleanup
    };
  }, [customerChats]);

  // sending message with socket io
  useEffect(() => {
    if (sendSocketMessage !== null) {
      socket.current.emit("send-message-website", sendSocketMessage);
    }
  }, [sendSocketMessage]);

  // handling the scrolling to the bottom of the chatpage component
  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [customerMessages, toggleWidgetData]);

  // setting selected chat
  useEffect(() => {
    if (!chatId || !customerChats) return;
    const selected = customerChats.find((chat: any) => chat.chat.id === chatId);
    if (selected) setSelectedChat(selected);
  }, [chatId, customerChats]);

  // setting user chat messages
  useEffect(() => {
    setcustomerMessages(chatMessages?.messages);
  }, [chatId, chatMessages]);
  // }, [chatId, chatMessages]);

  // getting message for a specific chat
  function receiveChatIdFromChildren(id: string) {
    setChatId(id);
  }

  return (
    <Box bg={"transparent"} h={"100vh"} w={"100vw"}>
      <IconButton
        icon={<IoChatbubbleEllipsesSharp />}
        aria-label="Insert emoji"
        variant="ghost"
        size="lg"
        boxSize={"60px"}
        display={toggleWidgetData ? "none" : "flex"}
        color={color}
        onClick={() => toggleWidget()}
      />

      {/* Home componet */}
      {!chatId && customer && (
        <Box display={toggleWidgetData ? "flex" : "none"}>
          <HomeView
            logo={logo}
            propertyName={propertyName}
            color={createGradientFromColor(color)}
            toggleWidget={toggleWidget}
            onSelectChat={receiveChatIdFromChildren}
            customerChats={customerChats}
            customer={customer}
            onStartNewChat={startChatHandler}
            onRefreshChats={reFecthChats}
          />
        </Box>
      )}

      {/* single chat */}
      {chatId && customer && (
        <Box>
          <Box
            display={toggleWidgetData ? "flex" : "none"}
            flexDirection="column"
            height="100vh"
          >
            {/* header */}
            <ChatHeader
              logo={logo}
              propertyName={propertyName}
              color={createGradientFromColor(color)}
              toggleWidget={toggleWidget}
              goHome={() => setChatId(undefined)}
            />

            {/* body */}
            <ChatBody
              boxRef={boxRef}
              customerid={customer?.id}
              customerMessages={customerMessages}
              displayColor={displayColor}
              textColor={textColor}
              welcomeMessage={welcomeMessage}
              createDarkFromColor={createDarkFromColor}
              createLightFromColor={createLightFromColor}
              getChatSentTime={getChatSentTime}
              suggestedMessage={suggestedMessage}
              sendSuggestedMessage={sendSuggestedMessage}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              messageIsSending={messageIsSending}
              customerMessagesLoading={chatMessagesLoading}
            />

            {/* footer */}
            <ChatFooter
              message={message}
              image={image}
              removeSelectedImage={removeSelectedImage}
              onFileSelect={onFileSelect}
              sendMessageHandler={sendMessageHandler}
              setMessage={setMessage}
              isTyping={isTyping}
            />
          </Box>
        </Box>
      )}
      {/* End of single chat */}
    </Box>
  );
}
