import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  Box,
  Text,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { TbTicket } from "react-icons/tb";
import { useCreateTicket } from "@/libs/Hooks/ticketsHooks";
import usePropertyChatStore from "@/store/propertyChatStore";
import { toast } from "react-toastify";
import AssigneeAndPriority from "./assignee-and-priority";
import LoadingSpinner from "../loadingSpinner";
import { useGetAllCustomers } from "@/libs/Hooks/customerHooks";

interface TicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TicketFormData {
  contact: string;
  subject: string;
  message: string;
  propertyChatId: string;
  attachments: File[];
  tags: string[];
}

interface Customer {
  id: string;
  sessionId: string;
  siteId: string;
  country: string;
  email: string | null;
  jobTitle: string | null;
  name: string | null;
  phone: string | null;
  userAgent: string | null;
  lastMessageSentAt: Date;
}

const TicketModal: React.FC<TicketModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<TicketFormData>({
    contact: "",
    subject: "",
    message: "",
    attachments: [],
    propertyChatId: "",
    tags: [],
  });

  const [newTag, setNewTag] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const createTicketMutation = useCreateTicket();
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const [assignee, setAssignee] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false);
  const { data } = useGetAllCustomers(selectedProperty);
  const [customers, setcustomers] = useState<Customer[]>([]);

  const handleInputChange = (field: keyof TicketFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleSubmit = async () => {
    try {
      setShowLoadingSpinner(true);
      if (!formData.contact || !formData.subject || !formData.message) {
        toast.error("Please fill in all required Field");
        return;
      }

      formData.propertyChatId = selectedProperty;
      const data = new FormData();
      data.append("contact", formData.contact);
      data.append("message", formData.message);
      data.append("subject", formData.subject);
      data.append("propertyChatId", formData.propertyChatId);
      if (assignee) data.append("assignee", assignee);
      if (priority) data.append("priority", priority);

      Array.from(formData.attachments).forEach((file) => {
        data.append("attachments", file);
      });

      const createDataTicket = await createTicketMutation.mutateAsync(data);
      toast.success(createDataTicket.message);

      // Reset form and close modal
      setFormData({
        contact: "",
        subject: "",
        message: "",
        attachments: [],
        tags: [],
        propertyChatId: "",
      });
      onClose();
    } catch (error) {
    } finally {
      setShowLoadingSpinner(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      contact: "",
      subject: "",
      message: "",
      propertyChatId: "",
      attachments: [],
      tags: [],
    });
    onClose();
  };

  const handleAssigneeAndPriorityChange = (
    assignee: string,
    priority: string
  ) => {
    if (assignee) setAssignee(assignee);
    if (priority) setPriority(priority);
  };

  // getting customer
  useEffect(() => {
    setcustomers(data?.customers);
  }, [data]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent maxW={"50vw"}>
        <ModalHeader>
          <HStack>
            <Icon as={TbTicket} />
            <Text>Tickets</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <LoadingSpinner showLoadingSpinner={showLoadingSpinner} />

            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">
                Contact
              </FormLabel>
              <Select
                onChange={(e) => handleInputChange("contact", e.target.value)}
              >
                <option>Select</option>
                {customers?.map((customer) => {
                  return (
                    <option value={customer.id} key={customer.id}>
                      {" "}
                      {customer.name ?? customer?.id}
                    </option>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">
                Subject
              </FormLabel>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Enter ticket subject"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm" color="gray.600">
                Message
              </FormLabel>
              <Box
                borderRadius={"12px"}
                border={"1px solid #e5e7eb"}
                borderBottomRightRadius={0}
                borderBottomLeftRadius={0}
              >
                <AssigneeAndPriority
                  sendAssigneeAndPriority={handleAssigneeAndPriorityChange}
                />
              </Box>
              <Textarea
                value={formData.message}
                borderTop={"none"}
                borderTopRightRadius={0}
                borderTopLeftRadius={0}
                onChange={(e) => handleInputChange("message", e.target.value)}
                placeholder="Describe your issue or request"
                rows={6}
                resize="vertical"
              />
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Attachments
              </FormLabel>
              <Box
                border="2px dashed"
                borderColor={dragActive ? "blue.400" : "gray.300"}
                borderRadius="md"
                p={4}
                textAlign="center"
                bg={dragActive ? "blue.50" : "gray.50"}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                cursor="pointer"
                _hover={{ borderColor: "blue.400", bg: "blue.50" }}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <Text fontSize="sm" color="gray.600">
                  Drop your files here or{" "}
                  <Text as="span" color="blue.500">
                    browse
                  </Text>
                </Text>
                <Input
                  id="file-input"
                  type="file"
                  multiple
                  display="none"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </Box>

              {formData.attachments.length > 0 && (
                <VStack align="stretch" mt={2} spacing={1}>
                  {formData.attachments.map((file, index) => (
                    <Flex
                      key={index}
                      justify="space-between"
                      align="center"
                      p={2}
                      bg="gray.50"
                      borderRadius="md"
                    >
                      <Text fontSize="sm" color="gray.700">
                        {file.name}
                      </Text>
                      <IconButton
                        aria-label="Remove attachment"
                        icon={<CloseIcon />}
                        size="xs"
                        variant="ghost"
                        onClick={() => removeAttachment(index)}
                      />
                    </Flex>
                  ))}
                </VStack>
              )}
            </FormControl>

            <FormControl>
              <FormLabel fontSize="sm" color="gray.600">
                Tags
              </FormLabel>
              <HStack>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <IconButton
                  aria-label="Add tag"
                  icon={<AddIcon />}
                  onClick={addTag}
                  variant="outline"
                  size="sm"
                />
              </HStack>

              {formData.tags.length > 0 && (
                <Flex wrap="wrap" gap={2} mt={2}>
                  {formData.tags.map((tag) => (
                    <Tag
                      key={tag}
                      size="md"
                      borderRadius="full"
                      variant="solid"
                      colorScheme="blue"
                    >
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => removeTag(tag)} />
                    </Tag>
                  ))}
                </Flex>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleCancel}>
            Cancel
          </Button>
          <Button bg="#192F5D" color={"white"} onClick={handleSubmit}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TicketModal;
