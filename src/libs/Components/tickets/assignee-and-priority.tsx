import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react';
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { useGetSupportAgents } from '@/libs/Hooks/usersHooks';
import usePropertyChatStore from '@/store/propertyChatStore';

interface Agent {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

interface Priority {
  id: string;
  label: string;
  color: string;
}

interface AssigneeAndPriorityProps {
  sendAssigneeAndPriority: (assignee: string, priority: string) => void;
}

const priorities: Priority[] = [
  { id: '1', label: 'Critical', color: 'red.900' },
  { id: '2', label: 'High', color: 'red.500' },
  { id: '3', label: 'Medium', color: 'yellow.500' },
  { id: '4', label: 'Low', color: 'blue.500' },
];

const AssigneeAndPriority: React.FC<AssigneeAndPriorityProps> = ({ sendAssigneeAndPriority }) => {
  const selectedProperty = usePropertyChatStore((state: any) => state.selectedProperty);
  const { data: supportAgentsData } = useGetSupportAgents({ siteId: selectedProperty });
  const [supportAgents, setSupportAgents] = useState<Agent[]>([]);
  const [selectedUser, setSelectedUser] = useState<Agent | null>(null);
  const [selectedPriority, setSelectedPriority] = useState(priorities[2]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<'user' | 'priority' | null>(null);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    if (supportAgentsData?.supportAgents) {
      setSupportAgents(supportAgentsData.supportAgents);
      setSelectedUser(supportAgentsData.supportAgents[0]); // default to first agent
    }
  }, [supportAgentsData]);

  const filteredAgents = supportAgents.filter(agent =>
    `${agent.firstname} ${agent.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box p={1} maxW="400px" ms="auto">
      <HStack spacing={4}>
        {/* --- USER DROPDOWN --- */}
        <Box position="relative" w="50%">
          <Button
            onClick={() => {
              setActiveDropdown(activeDropdown === 'user' ? null : 'user');
              setSearchTerm('');
            }}
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            size="md"
            bg={bg}
            borderColor={borderColor}
            _hover={{ bg: hoverBg }}
          >
            <HStack spacing={2}>
              {selectedUser && (
                <>
                  <Avatar
                    size="sm"
                    name={`${selectedUser.firstname} ${selectedUser.lastname}`}
                    bg="teal.500"
                    color="white"
                  />
                  <Text>
                    {selectedUser.firstname} {selectedUser.lastname}
                  </Text>
                </>
              )}
            </HStack>
          </Button>

          {activeDropdown === 'user' && (
            <Box
              position="absolute"
              top="calc(100% + 4px)"
              left="0"
              w="100%"
              bg={bg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              boxShadow="lg"
              zIndex={10}
              maxH="300px"
              overflowY="auto"
            >
              <Box p={2}>
                <InputGroup size="sm">
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search agents"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    border="none"
                    _focus={{ boxShadow: 'none' }}
                  />
                </InputGroup>
              </Box>

              <VStack spacing={0} align="stretch">
                {filteredAgents.map(agent => (
                  <Button
                    key={agent.id}
                    onClick={() => {
                      setSelectedUser(agent);
                      sendAssigneeAndPriority(agent.id, '');
                      setActiveDropdown(null);
                    }}
                    variant="ghost"
                    justifyContent="flex-start"
                    size="sm"
                    py={2}
                    px={3}
                    borderRadius="none"
                    _hover={{ bg: hoverBg }}
                    mb={1}
                  >
                    <HStack spacing={2}>
                      <Avatar
                        size="sm"
                        name={`${agent.firstname} ${agent.lastname}`}
                        bg="teal.500"
                        color="white"
                      />
                      <Text>
                        {agent.firstname} {agent.lastname}
                      </Text>
                    </HStack>
                  </Button>
                ))}
              </VStack>
            </Box>
          )}
        </Box>

        {/* --- PRIORITY DROPDOWN --- */}
        <Box position="relative" w="50%">
          <Button
            onClick={() =>
              setActiveDropdown(activeDropdown === 'priority' ? null : 'priority')
            }
            rightIcon={<ChevronDownIcon />}
            variant="outline"
            size="md"
            bg={bg}
            borderColor={borderColor}
            _hover={{ bg: hoverBg }}
          >
            <HStack spacing={2}>
              <Avatar
                size="sm"
                name={selectedPriority.label}
                bg={selectedPriority.color}
                color="white"
              />
              <Text>{selectedPriority.label}</Text>
            </HStack>
          </Button>

          {activeDropdown === 'priority' && (
            <Box
              position="absolute"
              top="calc(100% + 4px)"
              left="0"
              w="100%"
              bg={bg}
              border="1px solid"
              borderColor={borderColor}
              borderRadius="md"
              boxShadow="lg"
              zIndex={10}
              maxH="300px"
              overflowY="auto"
            >
              <VStack spacing={0} align="stretch">
                {priorities.map(priority => (
                  <Button
                    key={priority.id}
                    onClick={() => {
                      setSelectedPriority(priority);
                      sendAssigneeAndPriority('', priority.label);
                      setActiveDropdown(null);
                    }}
                    variant="ghost"
                    justifyContent="flex-start"
                    size="sm"
                    py={2}
                    px={3}
                    borderRadius="none"
                    _hover={{ bg: hoverBg }}
                    mb={1}
                  >
                    <HStack spacing={2}>
                      <Avatar
                        size="sm"
                        name={priority.label}
                        bg={priority.color}
                        color="white"
                      />
                      <Text>{priority.label}</Text>
                    </HStack>
                  </Button>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      </HStack>
    </Box>
  );
};

export default AssigneeAndPriority;
