import { Flex,Modal,Button,ModalBody,ModalOverlay,ModalContent,ModalHeader,Text,useDisclosure} from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegBell } from "react-icons/fa";
import { MdChatBubbleOutline } from "react-icons/md";

interface onOpenModalProps {
    
}

export const HambugerMenu: React.FC<onOpenModalProps> = () => {
const {onOpen,onClose,isOpen} = useDisclosure()

return(
    <Flex>
        <GiHamburgerMenu onClick={onOpen} color="white"></GiHamburgerMenu>
       

{/* Modal component */}
<Modal isOpen={isOpen} onClose={onClose}>
  <ModalOverlay />
  <ModalContent>

    <ModalBody>
        <Flex
          alignItems="center" 
          gap={3} 
          p={2} 
          borderRadius="md" 
          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
        > 
           <CgProfile></CgProfile>
           <Text>Change Name</Text>
        </Flex>
        <Flex
          alignItems="center" 
          gap={3} 
          p={2} 
          borderRadius="md" 
          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
        > 
           <MdOutlineEmail></MdOutlineEmail>
           <Text>Mail Transcript</Text>
        </Flex>
        <Flex
          alignItems="center" 
          gap={3} 
          p={2} 
          borderRadius="md" 
          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
        > 
          <FaRegBell></FaRegBell>
           <Text>Sound On</Text>
        </Flex>
        <Flex
          alignItems="center" 
          gap={3} 
          p={2} 
          borderRadius="md" 
          _hover={{ backgroundColor: "gray.100", cursor: "pointer" }}
        > 
          <MdChatBubbleOutline></MdChatBubbleOutline>
           <Text>Add Chat to Your WebSite</Text>
        </Flex>
    </ModalBody>
 


  </ModalContent>
</Modal>

    </Flex>
)

}