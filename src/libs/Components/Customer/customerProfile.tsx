import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaGlobe,
  FaMobileAlt,
  FaDesktop,
} from "react-icons/fa";
import { MdOutlineWeb, MdChatBubbleOutline } from "react-icons/md";
import Flag from "react-world-flags";
import {
  Flex,
  Box,
  Input,
  Divider,
  Button,
  VStack,
  Text,
  IconButton,
  Icon,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import {
  FaRegUser,
  FaShareAlt,
  FaPlus,
  FaClock,
  FaRegFileAlt,
  FaRegEnvelope,
  FaEdit,
} from "react-icons/fa";
import { LuPhone } from "react-icons/lu";
import { PiSuitcaseSimple } from "react-icons/pi";
import { useUpdateCustomer } from "@/libs/Hooks/customerHooks";
import { toast } from "react-toastify";
import { useGetCustomerSession } from "@/libs/Hooks/sessionHooks";
import { SessionInterface } from "@/libs/interface";
import { getChatSentTime } from "@/libs/utilities";
import CustomerSocials from "./customerSocials";
/**
 * Reusable Hover-to-Edit field component.
 * You can use this for Email, Phone, Job Title, etc.
 */
interface HoverEditFieldProps {
  label: string;
  icon: any; // Icon component (e.g., FaRegEnvelope)
  value: string;
  onChange: (newVal: string) => void;
  onSave: () => void; // Callback for "Save"
  placeholder?: string;
  text: string;
}

const HoverEditField: React.FC<HoverEditFieldProps> = ({
  label,
  icon,
  value,
  onChange,
  onSave,
  placeholder,
  text,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditIcon, setShowEditIcon] = useState(false);

  return (
    <Box w="full" maxW="400px" fontSize="sm">
      {!isEditing ? (
        // READ MODE
        <Flex
          p={2}
          align="center"
          bg={showEditIcon ? "green.50" : "transparent"}
          onMouseEnter={() => setShowEditIcon(true)}
          onMouseLeave={() => setShowEditIcon(false)}
          borderRadius="md"
        >
          <Icon as={icon} color="gray.500" mr={2} />
          <Text noOfLines={1} color="gray.600" fontWeight="medium">
            {label}: {text}
          </Text>
          <Spacer />
          {showEditIcon && (
            <IconButton
              aria-label="Edit"
              icon={<FaEdit />}
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
            />
          )}
        </Flex>
      ) : (
        // EDIT MODE
        <Box bg="green.50" p={2} borderRadius="md">
          <Flex align="center">
            <Icon as={icon} color="gray.500" mr={2} />
            <Text color="gray.600" fontWeight="medium">
              {label}
            </Text>
          </Flex>

          <Input
            mt={2}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            size="sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          <Flex mt={3} gap={2}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Logic to add another field (if needed)
              }}
            >
              + Add another
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>

            <Button
              colorScheme="green"
              size="sm"
              onClick={() => {
                onSave();
                setIsEditing(false);
              }}
            >
              Save
            </Button>
          </Flex>
        </Box>
      )}
    </Box>
  );
};

/**
 * Main CustomerProfile component with tab logic.
 */

interface customerProfileProp {
  customerData: any;
}
const CustomerProfile: React.FC<customerProfileProp> = ({ customerData }) => {
  // State to track the active tab. Default is "Profile"
  const [activeTab, setActiveTab] = useState("Profile");
  const [customer, setCustomer] = useState<any>();
  const [session, setSession] = useState<SessionInterface>();
  const useUpdateCustomerMutation = useUpdateCustomer();
  const { data: sessionData } = useGetCustomerSession(customerData?.id);

  useEffect(() => {
    setCustomer(customerData);
  }, [customerData]);

  useEffect(() => {
    if (sessionData) {
      setSession(sessionData?.session);
    }
  }, [sessionData]);

  // Example states for your fields
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [jobTitleValue, setJobTitleValue] = useState("");
  const [nameValue, setNameValue] = useState("");

  async function updateCustomerHandler(data: any) {
    try {
      const response = await useUpdateCustomerMutation.mutateAsync(data);
      setCustomer(response.customer);
    } catch (error: any) {
      toast.error(error?.message);
    }
  }

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        return (
          <Box p={4}>
            <Text fontWeight="bold" mb={2}>
              About
            </Text>
            <Divider mb={4} />

            <VStack align="start" spacing={3}>
              {/* Email Field */}
              <HoverEditField
                label="Email"
                icon={FaRegEnvelope}
                value={emailValue}
                text={customer?.email ? customer?.email : ""}
                onChange={setEmailValue}
                onSave={() =>
                  updateCustomerHandler({ id: customer?.id, email: emailValue })
                }
                placeholder={customer?.email ? customer.email : "Enter email"}
              />

              {/* Phone Field */}
              <HoverEditField
                label="Phone"
                icon={LuPhone} // Replace with an appropriate phone icon if you prefer
                value={phoneValue}
                onChange={setPhoneValue}
                onSave={() =>
                  updateCustomerHandler({ id: customer?.id, phone: phoneValue })
                }
                placeholder={
                  customer?.phone ? customer.phone : "Enter phone number"
                }
                text={customer?.phone ? customer.phone : ""}
              />

              {/* Job Title Field */}
              <HoverEditField
                label="Job Title"
                icon={PiSuitcaseSimple} // Replace with a briefcase or job-related icon if desired
                value={jobTitleValue}
                onChange={setJobTitleValue}
                onSave={() =>
                  updateCustomerHandler({
                    id: customer?.id,
                    jobTitle: jobTitleValue,
                  })
                }
                placeholder={
                  customer?.jobTitle ? customer.jobTitle : "Enter job title"
                }
                text={customer?.jobTitle ? customer.jobTitle : ""}
              />

              <HoverEditField
                label="Name"
                icon={FaRegUser} // Replace with a briefcase or job-related icon if desired
                value={nameValue}
                onChange={setNameValue}
                onSave={() =>
                  updateCustomerHandler({ id: customer?.id, name: nameValue })
                }
                placeholder={
                  customer?.name ? customer?.name : "Enter Your Name"
                }
                text={customer?.name ? customer?.name : ""}
              />

              <Button
                size="sm"
                leftIcon={<FaPlus />}
                colorScheme="blue"
                variant="outline"
              >
                Add Attribute
              </Button>
            </VStack>
          </Box>
        );
      case "Share":
        return (
          <Box p={4}>
            <CustomerSocials customerId={customer?.id} />
          </Box>
        );
      case "History":
        return (
          <Box p={4}>
            <Box>
              {/* Additional Information */}
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Additional Information
              </Text>
              <VStack align="start" spacing={4}>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaClock />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Created
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.createdAt)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaClock />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Updated
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.updatedAt)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaClock />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      First Seen
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.firstSeen)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaClock />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Last Seen
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.lastSeen)}
                    </Text>
                  </VStack>
                </HStack>
              </VStack>

              <Divider my={6} />

              {/* Location */}
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Location
              </Text>
              <VStack align="start" spacing={4}>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaMapMarkerAlt />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Country
                    </Text>
                    <Text fontWeight="medium">{session?.country}</Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaMapMarkerAlt />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      City
                    </Text>
                    <Text fontWeight="medium">{session?.city}</Text>
                  </VStack>
                </HStack>
              </VStack>

              <Divider my={6} />

              {/* Device */}
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Device
              </Text>
              <VStack align="start" spacing={4}>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaGlobe />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      IP
                    </Text>
                    <Text fontWeight="medium">{session?.ip}</Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaMobileAlt />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      OS
                    </Text>
                    <Text fontWeight="medium">{session?.os}</Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <FaDesktop />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Browser
                    </Text>
                    <Text fontWeight="medium">{session?.browser}</Text>
                  </VStack>
                </HStack>
              </VStack>

              <Divider my={6} />

              {/* Web Sessions */}
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Web Sessions
              </Text>
              <VStack align="start" spacing={4}>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdOutlineWeb />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      First Web Session
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.firstWebSession)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdOutlineWeb />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Latest Web Session
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.latestWebSession)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdOutlineWeb />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Total Web Sessions
                    </Text>
                    <Text fontWeight="medium">{session?.totalWebSessions}</Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdOutlineWeb />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Page Views
                    </Text>
                    <Text fontWeight="medium">{session?.pageViews}</Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdOutlineWeb />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Time Spent
                    </Text>
                    <Text fontWeight="medium">{session?.timeSpentMinutes}</Text>
                  </VStack>
                </HStack>
              </VStack>

              <Divider my={6} />

              {/* Live Chat */}
              <Text fontWeight="bold" fontSize="lg" mb={4}>
                Live Chat
              </Text>
              <VStack align="start" spacing={4}>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdChatBubbleOutline />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      First Live Chat
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.firstLiveChat)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdChatBubbleOutline />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Latest Live Chat
                    </Text>
                    <Text fontWeight="medium">
                      {getChatSentTime(session?.latestLiveChat)}
                    </Text>
                  </VStack>
                </HStack>
                <HStack align="start" spacing={3}>
                  <Box mt={1} color="gray.500">
                    <MdChatBubbleOutline />
                  </Box>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" color="gray.500">
                      Total Live Chat
                    </Text>
                    <Text fontWeight="medium">{session?.totalLiveChats}</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </Box>
        );
      case "Notes":
        return (
          <Box p={4}>
            <Text fontWeight="bold" mb={2}>
              Notes
            </Text>
            <Divider mb={4} />
            <Text>This is the Notes tab content.</Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      flex="1"
      direction="column"
      ml={{ base: 0, md: 4 }}
      mt={{ base: 4, md: 0 }}
      borderRadius="md"
      overflow="hidden"
      border="1px solid rgba(26, 99, 255, 0.33)"
      bg="rgba(26, 99, 255, 0.04)"
      boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
    >
      {/* Details Header */}
      <Flex
        align="center"
        p={4}
        borderBottom="1px solid #E2E8F0"
        bg="gray.50"
        gap={2}
      >
        <Flag width="20px" code={customer?.country} />
        <Text fontWeight="bold" fontSize="md" noOfLines={1}>
          {`${session?.customer.name}` && `V${customer?.id}`}
        </Text>
      </Flex>

      {/* Tabs (Icons) */}
      <Flex
        justify="space-around"
        borderBottom="1px solid #E2E8F0"
        bg="white"
        p={2}
      >
        <IconButton
          aria-label="Profile"
          icon={<FaRegUser />}
          variant="ghost"
          onClick={() => setActiveTab("Profile")}
          color={activeTab === "Profile" ? "blue.500" : "gray.500"}
        />
        <IconButton
          aria-label="Share"
          icon={<FaShareAlt />}
          variant="ghost"
          onClick={() => setActiveTab("Share")}
          color={activeTab === "Share" ? "blue.500" : "gray.500"}
        />
        <IconButton
          aria-label="History"
          icon={<FaClock />}
          variant="ghost"
          onClick={() => setActiveTab("History")}
          color={activeTab === "History" ? "blue.500" : "gray.500"}
        />
        <IconButton
          aria-label="Notes"
          icon={<FaRegFileAlt />}
          variant="ghost"
          onClick={() => setActiveTab("Notes")}
          color={activeTab === "Notes" ? "blue.500" : "gray.500"}
          display={"none"}
        />
      </Flex>
      <Box
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "4px" },
          "&::-webkit-scrollbar-track": { background: "#f1f1f1" },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "2px",
          },
        }}
      >
        {/* Tab Content */}
        {renderTabContent()}

        <Box p={4} w="full" mt={6}>
          <Text fontWeight="bold" mb={2}>
            Organization
          </Text>
          <Button size="sm" leftIcon={<FaPlus />} colorScheme="blue">
            New Organization
          </Button>
        </Box>

        <Box p={4} w="full" mt={6}>
          <Text fontWeight="bold" mb={2}>
            Tags
          </Text>
          <Button
            size="sm"
            leftIcon={<FaPlus />}
            colorScheme="blue"
            variant="outline"
          >
            Add Tag
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default CustomerProfile;
