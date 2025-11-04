import { Flex,Box,Heading,Button,Text,Input} from "@chakra-ui/react";
import { DragHandleIcon,Tooltip,IconButton } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";

interface sugggestedMessagesProps {
    onSuggestedMessagesChange: (messages: string[]) => void;
    onWelcomeMessageChange: (message: string ) => void;
    
}

export const SuggestedMessages: React.FC<sugggestedMessagesProps> = ({onSuggestedMessagesChange,onWelcomeMessageChange}) => {
const [suggestedMessages,setSuggestedMessages] = useState<string[]>(["I have a question", "Tell me more"])
const [newMessage,setNewMessage] = useState<string>('')
const [welcomeMessage ,setWelcomeMessage] = useState<string >('👋 Hi! How can we help?')

function editMessage(index:number,newValue:string) {
   const updatedMessages = [...suggestedMessages]
   updatedMessages[index] = newValue
   setSuggestedMessages(updatedMessages)
   onSuggestedMessagesChange(updatedMessages)
}

function deleteMessage(index:number){
    const updatedMessages = suggestedMessages.filter((_,i)=>i!==index)
    setSuggestedMessages(updatedMessages)
    onSuggestedMessagesChange(updatedMessages)
}

function addMessage(value:string){
    const updatedMessages = [...suggestedMessages,value]
    setSuggestedMessages(updatedMessages)
    onSuggestedMessagesChange(updatedMessages)
    setNewMessage('')
}


function editWelcomeMessaeg(value:string){
    setWelcomeMessage(value)
    onWelcomeMessageChange(value)
}

return(
          <Box p={4} w="100%" maxW="400px" borderWidth="1px" borderRadius="md" boxShadow="sm">
              {/* Welcome Message */}
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                  Welcome Message
              </Text>
              <Input value={welcomeMessage} onChange={(e)=>editWelcomeMessaeg(e.target.value)} mb={4} borderRadius="md" />

                      {/* Suggested Messages Section */}
                      <Flex justifyContent="space-between" alignItems="center" mb={2}>
                          <Text fontSize="sm" fontWeight="bold">
                          Suggested Message
                          </Text>
                          <Tooltip label="Suggested messages that users can quickly select.">
                          <Text fontSize="md" color="gray.500">
                              ❔
                          </Text>
                          </Tooltip>
                      </Flex>

                      {/* List of Suggested Messages */}
                      {suggestedMessages.map((message, index) => (
                          <Flex key={index} alignItems="center" mb={2}>
                          <DragHandleIcon boxSize={5} color="gray.500" mr={2} />
                          <Input value={message} onChange={(e)=>editMessage(index,e.target.value)} borderRadius="md" flex="1" mr={2} />
                          <IconButton
                              aria-label="Delete message"
                              icon={<FaTrash />}
                              colorScheme="red"
                              size="sm"
                              onClick={()=>deleteMessage(index)}
                          />
                          </Flex>
                      ))}

                      {/* Add New Message */}
                      <Flex mt={4} alignItems="center" gap={2} display={suggestedMessages.length < 3 ? 'Flex' :'none'}>
                          <Input value={newMessage} onChange={(e)=>setNewMessage(e.target.value)} placeholder="Type a new message" borderRadius="md" />
                          <Button fontSize={'12px'} onClick={()=>addMessage(newMessage)} colorScheme="green" borderRadius="md">
                             Add Message
                          </Button>
                      </Flex>
          </Box>

)

}