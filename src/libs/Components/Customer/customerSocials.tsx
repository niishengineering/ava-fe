import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  IconButton,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa";
import { EditIcon } from "@chakra-ui/icons";
import { useGetSocials, useUpdateSocial } from "@/libs/Hooks/socialsHook";

// Define the shape of the social media links
interface SocialLinks {
  facebook: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

// Define each social media item
interface SocialItem {
  label: string;
  icon: React.ElementType;
  field: keyof SocialLinks;
  placeholder: string;
  iconColor: string;
}

export default function CustomerSocials({
  customerId,
}: {
  customerId: string;
}) {
  const [links, setLinks] = useState<SocialLinks>({
    facebook: "",
    linkedin: "",
    twitter: "",
    instagram: "",
  });

  const [editingField, setEditingField] = useState<keyof SocialLinks | null>(
    null
  );
  const [tempValue, setTempValue] = useState<string>("");

  // Chakra UI color mode values
  const bgHover = useColorModeValue("gray.50", "gray.700");
  const editBg = useColorModeValue("blue.50", "blue.900");
  const editBorder = useColorModeValue("blue.200", "blue.600");
  const textColor = useColorModeValue("gray.800", "white");
  const subTextColor = useColorModeValue("gray.500", "gray.400");

  const startEdit = (field: keyof SocialLinks) => {
    setEditingField(field);
    setTempValue(links[field]);
  };

  const saveEdit = () => {
    if (editingField) {
      setLinks((prev) => ({ ...prev, [editingField]: tempValue }));
      updateSocialMutation.mutateAsync({
        customerId,
        [editingField]: tempValue,
      });
      setEditingField(null);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const items: SocialItem[] = [
    {
      label: "Facebook",
      icon: FaFacebook,
      field: "facebook",
      placeholder: "URL",
      iconColor: "blue.600",
    },
    {
      label: "LinkedIn",
      icon: FaLinkedin,
      field: "linkedin",
      placeholder: "URL",
      iconColor: "blue.700",
    },
    {
      label: "Twitter",
      icon: FaTwitter,
      field: "twitter",
      placeholder: "Handle",
      iconColor: "blue.400",
    },
    {
      label: "Instagram",
      icon: FaInstagram,
      field: "instagram",
      placeholder: "Handle",
      iconColor: "pink.500",
    },
  ];

  const { data: socialsData } = useGetSocials(customerId);
  const updateSocialMutation = useUpdateSocial();

  useEffect(() => {
    if (socialsData?.socials) setLinks(socialsData?.socials);
  }, [socialsData]);
  return (
    <Box maxW="md">
      <Text fontSize="lg" fontWeight="medium" color={textColor} mb={4}>
        Social Media
      </Text>

      <VStack spacing={3} align="stretch">
        {items.map(
          ({ label, icon: IconComponent, field, placeholder, iconColor }) => (
            <Box key={field} role="group">
              {editingField !== field ? (
                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  borderRadius="lg"
                  cursor="pointer"
                  transition="background-color 0.2s"
                  _hover={{ bg: bgHover }}
                  onClick={() => startEdit(field)}
                >
                  <Box fontSize="xl" flexShrink={0}>
                    <IconComponent color={iconColor} />
                  </Box>

                  <Box flex={1} minW={0}>
                    <Text fontWeight="medium" color={textColor} fontSize="sm">
                      {label}
                    </Text>
                    <Text fontSize="sm" color={subTextColor} isTruncated>
                      {links[field] || placeholder}
                    </Text>
                  </Box>

                  <IconButton
                    icon={<EditIcon />}
                    size="sm"
                    variant="ghost"
                    opacity={0}
                    transition="opacity 0.2s"
                    _groupHover={{ opacity: 1 }}
                    color={subTextColor}
                    aria-label={`Edit ${label}`}
                  />
                </Flex>
              ) : (
                <Box
                  bg={editBg}
                  border="1px"
                  borderColor={editBorder}
                  borderRadius="lg"
                  p={3}
                >
                  <Flex align="center" gap={3} mb={3}>
                    <Box fontSize="xl" flexShrink={0}>
                      <IconComponent color={iconColor} />
                    </Box>
                    <Box flex={1} minW={0}>
                      <Text fontWeight="medium" color={textColor} fontSize="sm">
                        {label}
                      </Text>
                      <Text fontSize="sm" color={subTextColor}>
                        {placeholder}
                      </Text>
                    </Box>
                  </Flex>

                  <Box ml={9}>
                    <Input
                      value={tempValue}
                      onChange={(e) => setTempValue(e.target.value)}
                      placeholder={placeholder}
                      size="sm"
                      mb={3}
                      focusBorderColor="blue.500"
                      autoFocus
                    />

                    <HStack spacing={2} justify="flex-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button size="sm" colorScheme="blue" onClick={saveEdit}>
                        Save
                      </Button>
                    </HStack>
                  </Box>
                </Box>
              )}
            </Box>
          )
        )}
      </VStack>
    </Box>
  );
}
