import { Flex,Box,Text,Heading,IconButton } from "@chakra-ui/react"
import { BsFillChatTextFill } from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";
import { SiKnowledgebase } from "react-icons/si";
import { CgNotes } from "react-icons/cg";
import { useRouter } from "next/router";




export default function Products(){
    const router = useRouter()

    function navigationHandler (){
       router.push('/sign-up/single-product') 
    }
  return(
    <Flex justify={'center'} alignItems={'center'} height={'100vh'}>
        
        <Box p={2}>
        <Heading mb={'3rem'} textAlign={'center'}>Which product would you like to setup</Heading>
        <Flex mb={'1rem'} gap={3} flexDir={{lg:'row',md:'column',sm:'column',base:'column'}}>
                <Box p={'1.8rem'} onClick={navigationHandler} width={{lg:"50%",md:"100%",sm:'100%',base:'100%'}} border={'1px solid'} cursor={'pointer'} borderColor="gray.400" borderRadius={'24px'}>
                    <Flex>
                    <IconButton
                        icon={<BsFillChatTextFill style={{ fontSize: "20px" ,color: "currentColor",margin:'0 auto'}}/>}
                        aria-label="Insert emoji"
                        variant="ghost"
                        _hover={{
                            bg: "gray.200", // Background color on hover
                            color: "blue.500", // Icon color on hover
                            transform: "scale(1.1)", // Optional: slight scaling effect
                        }}
                        color={'green'}  
                        mx={'auto'}                        
                    />
                    <Box>
                            <Heading fontSize={'24px'}>Live Chat</Heading>
                            <Text>Add Live Chat to your Website</Text>
                        </Box>
                    </Flex>
                </Box>
                <Box p={'1.8rem'} width={{lg:"50%",md:"100%",sm:'100%',base:'100%'}} border={'1px solid'} cursor={'pointer'} borderColor="gray.400" borderRadius={'24px'}>
                    <Flex>
                    <IconButton
                        icon={<FaTicket style={{ fontSize: "20px" ,color: "currentColor",margin:'0 auto'}}/>}
                        aria-label="Insert emoji"
                        variant="ghost"
                        _hover={{
                            bg: "gray.200", // Background color on hover
                            color: "blue.500", // Icon color on hover
                            transform: "scale(1.1)", // Optional: slight scaling effect
                        }}
                        color={'purple'}  
                        mx={'auto'}                        
                    />
                    <Box>
                            <Heading fontSize={'24px'}>Ticketing</Heading>
                            <Text>Ticket management made easy</Text>
                        </Box>
                    </Flex>
                </Box>
        </Flex>
        <Flex  gap={3} flexDir={{lg:'row',md:'column',sm:'column',base:'column'}}>
                <Box p={'1.8rem'} width={{lg:"50%",md:"100%",sm:'100%',base:'100%'}} border={'1px solid'} cursor={'pointer'} borderColor="gray.400" borderRadius={'24px'}>
                    <Flex>
                    <IconButton
                        icon={<SiKnowledgebase style={{ fontSize: "20px" ,color: "currentColor",margin:'0 auto'}}/>}
                        aria-label="Insert emoji"
                        variant="ghost"
                        _hover={{
                            bg: "gray.200", // Background color on hover
                            color: "blue.500", // Icon color on hover
                            transform: "scale(1.1)", // Optional: slight scaling effect
                        }}
                        color={'blue'}  
                        mx={'auto'}                        
                    />
                    <Box>
                            <Heading fontSize={'24px'}>Knowledge Base</Heading>
                            <Text>Help customers help themselves</Text>
                        </Box>
                    </Flex>
                </Box>
                <Box p={'1.8rem'} width={{lg:"50%",md:"100%",sm:'100%',base:'100%'}} border={'1px solid'} cursor={'pointer'} borderColor="gray.400" borderRadius={'24px'}>
                    <Flex>
                    <IconButton
                        icon={<CgNotes style={{ fontSize: "20px" ,color: "currentColor",margin:'0 auto'}}/>}
                        aria-label="Insert emoji"
                        variant="ghost"
                        _hover={{
                            bg: "gray.200", // Background color on hover
                            color: "blue.500", // Icon color on hover
                            transform: "scale(1.1)", // Optional: slight scaling effect
                        }}
                        color={'orange'}  
                        mx={'auto'}                        
                    />
                    <Box>
                            <Heading fontSize={'24px'}>Pages</Heading>
                            <Text>Get a ava.com/yourbrand page</Text>
                        </Box>
                    </Flex>
                </Box>
        </Flex>
        </Box>
    </Flex>
  )
}