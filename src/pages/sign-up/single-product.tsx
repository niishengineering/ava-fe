import { Flex,Box,Text,Heading,Image,IconButton,Input,Button, Tooltip } from "@chakra-ui/react";
import AvaLogo from '../../../public/AvaLogo.jpg'
import { BsFillChatTextFill } from "react-icons/bs";
import { FaLongArrowAltRight } from "react-icons/fa";
import { PiImagesSquareLight } from "react-icons/pi";
import FileUploadButton from "@/libs/Components/fileUploadButton";
import { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import ColorPickerComponent from "@/libs/Components/colorPicker";
import { DragHandleIcon } from "@chakra-ui/icons";
import { FaTrash } from "react-icons/fa";
import { SuggestedMessages } from "@/libs/Components/SignUp/suggestedMessages";
import WidgetPreviewComponent from "@/libs/Components/SignUp/widgetPreview";
import { useCreateNewUserProperty,useRegisterUserHook } from "@/libs/Hooks/usersHooks";
import { toast } from 'react-toastify';
import { useRouter } from "next/router";

export default function SingleProduct(){
  const [propertyImage,setPropertyImage] = useState<string>('');
  const [image,setImage] = useState<any>(null);
  const [propertyColor,setPropertyColor] = useState<any>('#2ECC71')
  const [welcomeMessage,setWelcomeMessage] = useState<string >('👋 Hi! How can we help?')
  const [suggestedMessages,setSuggestedMessages] = useState<string[]>(["I have a question", "Tell me more"])
  const [activeStep,setActiveStep] = useState<number>(1)
  const [website,setWebsite] = useState<string>()
  const [propertyName,setPropertyName] = useState<string>()
  const [formValidationError,setFormValidationError] = useState<boolean>(false)
  const newPropertyMutation = useCreateNewUserProperty()
  const router = useRouter()


async function uploadImage(image:File) : Promise <string | null> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
  const uploadPreset =  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!apiKey || !uploadPreset) return null

  const formData = new FormData();
  formData.append('file', image);
  formData.append('api_key',apiKey);
  formData.append('upload_preset',uploadPreset);
  
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    console.error('Image upload failed', await response.text());
    return null;
  }

  const data = await response.json();
  return data.secure_url || null;


}

async function nextStep (){
  
    if (activeStep === 3) {
      try {
        let uploadedImageUrl: string | null = null;

        if(image){
          uploadedImageUrl = await uploadImage(image)
        }

        if(uploadedImageUrl) {
          setPropertyImage(uploadedImageUrl)
        }
        
        const data = await  newPropertyMutation.mutateAsync({website,welcomeMessage,suggestedMessages,propertyName,propertyColor,propertyImage:uploadedImageUrl})
        
        router.push('/dashboard')
      } catch (error:any) {
        toast.error(error?.message)
      }
      
      return
    }
    if(activeStep === 2){
        if(!propertyName){
             setFormValidationError (true)
             return
         }
    }

    
    setActiveStep(activeStep + 1)
  }

  function backStep (){
    if (activeStep === 1) return
    setActiveStep(activeStep -1)
  }


  function onFileSelect(file:File) {
    setImage(file)
  }

  function onColorChange(selectedPropertyColor:any) {
    setPropertyColor(selectedPropertyColor)
  }

  function onWelcomeMessageChange(value:string){
         setWelcomeMessage(value)
  }

  function onSuggestedMessagesChange(value:string[]){
         setSuggestedMessages(value)
  }

  function removeImage(){
    setImage(null)
  }


 return(
    <Flex flexDir={{lg:'row',md:'row',sm:'column',base:'column'}}>
            <Box  bg={'#F0F0F0'} height={{lg:'100vh',md:'100vh',sm:'auto',base:'auto'}}  p={5} overflowY="auto"   width={{lg:'25%',md:'25%',sm:'100%',base:'100%'}}>
            <Image width={100} mt={'1rem'} mx={'auto'} src="/AvaLogo.jpg" alt="logo"></Image>
            <Box p={'1.8rem'} mt={'1rem'} mx={'auto'} width={'100%'}  cursor={'pointer'} bg="white" borderRadius={'12px'}>
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
                            <Heading fontSize={'20px'}>Live Chat</Heading>
                            <Text>Add Live Chat to your Website</Text>
                        </Box>
                    </Flex>
            </Box>
            <Heading fontSize={'1.2rem'} m={'3rem 0'}>Monitor and chat with the visitors on your website</Heading>
            <Text mt={'1rem'}>Let's get you setup with the basics, so that you can instantly see the visitors on your website, and get the widget installed.</Text>
            <Text mt={'1rem'}>Don't worry, there are many more advanced features (all free) which can be customized in the administration area after initial setup.</Text>
            <Text mt={'1rem'}>If you get stuck, initiate a chat below:</Text>
            </Box>
            {/* <Box display={'flex'}  position={'relative'}  flexDir={'column'}  w={{lg:'75%',md:'75%',sm:'100%',base:'100%'}} height={{lg:'100vh',md:'100vh',sm:'50vh',base:'50vh'}} overflowY={'auto'} alignItems={'center'} justifyContent={'center'}> */}
            <Box display={''} position="relative" height="100vh" overflowY="auto" bg="white"  w={{ lg: '75%', md: '75%', sm: '100%', base: '100%' }} >
                {/* site name */}
                <Box display = {activeStep === 1 ? 'block' : 'none'}>
                 <Flex  h={{lg:'100vh',md:'100vh',sm:'50vh',base:'50vh'}} justifyContent={'center'} alignItems={'center'}>  
                 <Box>

                             <Heading mb={'2rem'} textAlign={'center'}>What's your website address?</Heading>

                            <Flex alignItems={'center'} gap={3}>
                                <Input onChange={(e)=>setWebsite(e.target.value)} />
                                <Button bg={'green'} onClick={nextStep} ><FaLongArrowAltRight style={{fontSize:'20px',color:'white'}} /></Button>
                            </Flex> 

                    </Box> 
                  </Flex>
                </Box>
                {/* site name */}

                {/* Organisation name */}
                <Box display = {activeStep === 2 ? 'block' : 'none'}>
                <Flex  h={{lg:'100vh',md:'100vh',sm:'50vh',base:'50vh'}} justifyContent={'center'} alignItems={'center'}>  
                 <Box>

                <Heading mb={'2rem'}>What's the name of your organization?</Heading>
                <Flex alignItems={'center'} gap={3}>
                    <Input onChange={(e)=>{
                        setFormValidationError(false)
                        setPropertyName(e.target.value)
                        }} />
                    <Button bg={'green'} onClick={nextStep}><FaLongArrowAltRight style={{fontSize:'20px',color:'white'}} /></Button>
                </Flex>
                <Text color={'red'} display={formValidationError?'block':'none'} fontSize={'small'}> please enter a name for the organisation </Text>

                <Text mt={'2rem'}>Your organization name will be used to name your first workspace.</Text>
                <Text mt={'1rem'}>At AVA a workspace is called a "Property".</Text>
                <Text mt={'1rem'}>It's just a way to keep things organized.</Text>
                </Box>
                  </Flex>     
                </Box>     
                {/* Organisation name */}

                {/* widget customization */}
                <Box w={'100%'} height="auto" display = {activeStep === 3 ? 'block' : 'none'} p={{lg:'4rem 0rem 0 5rem',md:'2rem',sm:3,base:3}} >
                     <Heading fontSize={'1.5rem'}>Customize the widget to suit your brand</Heading>
                     <Text m={'1rem 0'}>(you can change this later)</Text>
                     
                     <Flex alignItems={'center'} gap={5} flexDir={{lg:'row',md:'row',sm:'column',base:'column'}}>
                          
                            <Box w={{lg:'50%',md:'50%',sm:'100%',base:'100%'}}>
                                    <Heading fontSize={'1.5rem'} mb={'0.5rem'}>Logo</Heading>
                                    <Box bg={'gray.300'} position={'relative'} w={'100px'} h={'100px'} display={'flex'} alignItems={'center'} justifyContent={'center'}>
                                        <Box position={'absolute'} display={image?'none':'block'} top={-2} right={-7}> <FileUploadButton onFileSelect={onFileSelect}/> </Box>
                                        <Box onClick={removeImage} position={'absolute'} top={0} display={image?'block':'none'} right={0}> <IoCloseCircleOutline style={{color:'red'}}/> </Box>

                                        <PiImagesSquareLight style={{fontSize:'20px'}} display={image?'none':'block'} />
                                        <Image src={image?URL.createObjectURL(image):''} display={image?'block':'none'} w={'100px'} h={'100px'}/>
                                    </Box> 
                                    <ColorPickerComponent onColorChange={onColorChange}  />
                                    <SuggestedMessages onWelcomeMessageChange={onWelcomeMessageChange} onSuggestedMessagesChange={onSuggestedMessagesChange} />
                            </Box>

                            <Box w={{lg:'50%',md:'50%',sm:'100%',base:'100%'}}>
                               <WidgetPreviewComponent welcomeMessage={welcomeMessage} color={propertyColor} suggestedMessages={suggestedMessages}/>
                            </Box>

                     </Flex>


                </Box>
                {/* widget customization */}


                {/* <Flex bg={'white'} h={'60px'} alignItems={'center'} position={'absolute'} p={'0 3rem'} justifyContent={'space-between'} bottom={0} w={'100%'}> */}
                <Flex
                    bg={'white'}
                    h={'60px'}
                    alignItems={'center'}
                    position={'sticky'}
                    bottom={0}
                    left={0}
                    w={{ lg: '100%', md: '75%', sm: '100%', base: '100%' }}
                    p={'0 3rem'}
                    justifyContent={'space-between'} 
                    >
                    <Button onClick={backStep}>Back</Button>
                    <Button onClick={nextStep} bg={'green'} color={'white'}>Next</Button>
                </Flex>
            </Box>
    </Flex>
 )

}