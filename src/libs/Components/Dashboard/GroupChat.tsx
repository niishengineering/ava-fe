import React, { useState } from "react";
import {
  Box,
  Text,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  Button,
  Input,
  Flex,
} from "@chakra-ui/react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { PiChatsLight } from "react-icons/pi";

interface GroupChatComponentProps {
  isSidebarReduced : boolean;
}

// function GroupChatComponent ({isSidebarReduced}): React.FC<GroupC.hatComponentProps>  {
  const GroupChatComponent : React.FC<GroupChatComponentProps> = ({isSidebarReduced})=>{
  const [showGroups, setShowGroups] = useState(false);
  const [groups,setGroup] =useState<any>([])
  const [isSearchActive, setIsSearchActive] = useState(false);

  return (
  <Box>
    <Box
      position="relative"
      alignItems="center"
      bg={'transparent'}
      borderRadius="md"
      boxShadow="md"
      maxWidth="100%"
      display={isSidebarReduced?'none':'flex'}
    >
        {!isSearchActive && (
          <>
            {/* Dropdown for Groups */}
            <IconButton
              icon={<FiChevronDown />}
              aria-label="Show Groups"
              color={'white'}
              variant="ghost"
              onClick={() => setShowGroups(!showGroups)}
              mr={2}
            />

            {showGroups && (
              <Flex
                flexDir={'column'}
                position="absolute"
                top="100%"
                left={0}
                mt={1}
                bg="transparent"
                borderRadius="md"
                zIndex={1}
                width="100%"
                p={2}
              >
                {groups.map((group:any, index:any) => (
                  <Text key={index} py={1}>
                    {group}
                  </Text>
                ))}
                {groups.length === 0 && (
                <Button mt={5} mx={'auto'}> Add new Group</Button>
                )}
              </Flex>
            )}

            {/* Groups Label */}
            <Text flex="1" fontWeight="400" color={'white'}>
              Groups
            </Text>

            {/* Three Dots Menu as Popover */}
            <Popover placement="bottom-start">
              <PopoverTrigger>
                <IconButton
                  icon={<BsThreeDotsVertical />}
                  aria-label="Options"
                  variant="ghost"
                  color={'white'}
                  mr={2}
                />
              </PopoverTrigger>
              <PopoverContent w="200px">
                <PopoverArrow />
                <PopoverBody>
                  <Text>Option 1</Text>
                  <Text>Option 2</Text>
                  <Text>Option 3</Text>
                </PopoverBody>
              </PopoverContent>
            </Popover>

            {/* Search Icon */}
            <Box onMouseEnter={() => setIsSearchActive(true)}>
              <IconButton color={'white'} icon={<FiSearch />} aria-label="Search" variant="ghost" />
            </Box>
          </>
        )}

        {/* Expanding Search Input with Animation from Right to Left */}
        <AnimatePresence>
          {isSearchActive && (
            <motion.div
              initial={{ width: 0 }} // Initial state (collapsed)
              animate={{ width: "100%" }} // Expanding to 100% width
              exit={{ width: 0 }} // Shrinks back to 0% width when leaving
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                top: "0",
                right: "0", // Start from the right
                height: "100%",
                zIndex: 2,
              }}
              onMouseLeave={() => setIsSearchActive(false)} // Hide the input on mouse leave
            >
              <Input
                width="100%"
                height="100%"
                bg={'#2C3338'}
                color={'white'}
                p={'1.2rem 0'}
                boxShadow="md"
                placeholder="Search groups..."
                borderRadius="md"
                autoFocus
                _focus={{
                  borderColor: '#2C3338', // Example: change to a green border on focus
                  boxShadow: '0 0 0 2px #2C3338' // Optional: add a glowing effect
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
    </Box>
    
    <IconButton
                  icon={< PiChatsLight style={{ fontSize: "38px" ,color: "currentColor"}}/>}
                  aria-label="Insert emoji"
                  variant="ghost"
                  _hover={{
                    bg: "gray.200", // Background color on hover
                    color: "blue.500", // Icon color on hover
                    transform: "scale(1.1)", // Optional: slight scaling effect
                  }}
                  color={'white'}    
                  mx={'auto'}     
                  display={isSidebarReduced?'flex':'none'}              
    />
    </Box>
  );
}

export default GroupChatComponent;
