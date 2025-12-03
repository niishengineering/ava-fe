import React, { useState, useEffect } from "react";
import {
  Stack,
  Box,
  Avatar,
  Input,
  Text,
  Image,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon } from "@chakra-ui/icons";
import Cookies from "js-cookie";
import usePropertyChatStore from "@/store/propertyChatStore";

interface ExpandableAvatarCardProp {
  user: any;
}

const ExpandableAvatarCard: React.FC<ExpandableAvatarCardProp> = ({ user }) => {
  const [isPropertyTabActive, setIsPropertyTabActive] = useState(false);
  const updateSelectedProperty = usePropertyChatStore(
    (state: any) => state.editSelectedProperty
  );
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );

  return (
    <Stack>
      <Box
        borderRadius={"md"}
        border={"3px solid #1A1A1A"}
        p={2}
        onMouseEnter={() => setIsPropertyTabActive(true)}
      >
        {/* <Text fontSize="38px" fontWeight={'700'}  color="white">W</Text> */}
        <Avatar
          name={`${user?.firstName} ${user?.lastName}`}
          src=""
          size="sm"
          bg="teal.500"
        />
      </Box>
      <AnimatePresence>
        {isPropertyTabActive && (
          <motion.div
            initial={{ width: 0 }} // Initial state (collapsed)
            animate={{ width: "20%" }} // Expanding to 100% width
            exit={{ width: 0 }} // Shrinks back to 0% width when leaving
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "0",
              right: "0", // Start from the right
              height: "100%",
              zIndex: 2,
            }}
            onMouseLeave={() => setIsPropertyTabActive(false)} // Hide the input on mouse leave
          >
            <Stack>
              <Input
                width="100%"
                height="100%"
                bg={"black"}
                p={"1.1rem 0.2rem"}
                boxShadow="md"
                placeholder="Search groups..."
                borderRadius="md"
                mt={1}
                autoFocus
              />
              <Box
                mt={1}
                bg="black"
                color="white"
                boxShadow="lg"
                borderRadius="md"
                zIndex={1}
                width="100%"
                p={2}
                border="1px solid white"
              >
                {user?.properties &&
                  user?.properties.map((property: any, index: number) => {
                    const isActive = selectedProperty === property?.id;

                    return (
                      <Flex
                        align="center"
                        bg={isActive ? "grey" : "black"}
                        color="white"
                        onClick={() => updateSelectedProperty(property?.id)}
                        p={4}
                        borderRadius="md"
                        key={property.id}
                        cursor={"pointer"}
                        maxW="sm"
                        _hover={{ background: "grey" }}
                        transition="background 0.2s ease"
                        border={
                          isActive ? "2px solid teal" : "2px solid transparent"
                        }
                      >
                        {/* Avatar */}
                        <Avatar
                          name={property.propertyName}
                          src={property.propertyImage} // Use avatarUrl if provided
                          bg={isActive ? "teal.500" : "yellow.500"}
                          color="white"
                          size="sm"
                          fontWeight="bold"
                          mr={3}
                        />

                        {/* Text */}
                        <Text flex="1" fontSize="sm" fontWeight="bold">
                          {property.propertyName}
                        </Text>

                        {/* Check Icon - only show when active */}
                        {isActive && (
                          <Icon as={CheckIcon} color="teal.300" boxSize={4} />
                        )}
                      </Flex>
                    );
                  })}
              </Box>
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>
    </Stack>
  );
};

export default ExpandableAvatarCard;
