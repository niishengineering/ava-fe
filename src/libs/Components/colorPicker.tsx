import React, { useState } from "react";
import { Box, Text, Flex, Input, Popover, PopoverTrigger, PopoverContent, PopoverBody, Button } from "@chakra-ui/react";
import { SketchPicker } from "react-color";

interface ColorPickerComponentProp {
   onColorChange : (color:string) => void
}

const ColorPickerComponent : React.FC<ColorPickerComponentProp> = ({onColorChange}) => {
  const [selectedColor, setSelectedColor] = useState("#005EFF"); // Default color
  const [customColor, setCustomColor] = useState(selectedColor);
  const [showPicker, setShowPicker] = useState(false);

  const predefinedColors = ["#005EFF", "#FF0000", "#9B51E0", "#2ECC71"]; // Palette colors

  const handleChangeComplete = (color:any) => {
    setCustomColor(color.hex);
    setSelectedColor(color.hex);
    onColorChange(color.hex);
  };

  const handlePredefinedColorClick = (color:any) => {
    setSelectedColor(color);
    setCustomColor(color); // Updates the custom color button background
    onColorChange(color)
  };

  return (
    <Box p={5}>
      {/* Section Label */}
      <Text fontSize="md" fontWeight="bold" mb={2}>
        Color
      </Text>

      {/* Color Picker Row */}
      <Flex alignItems="center" gap={2}>
        {/* Predefined Colors */}
        {predefinedColors.map((color, index) => (
          <Box
            key={index}
            bg={color}
            w="32px"
            h="32px"
            borderRadius="md"
            border={color === selectedColor ? "2px solid #005EFF" : "2px solid transparent"}
            cursor="pointer"
            onClick={() => handlePredefinedColorClick(color)}
          />
        ))}

        {/* Custom Color Picker */}
        <Box bg="gray.200" display="flex" alignItems="center" gap={3} p={2} borderRadius="md">
          <Popover isOpen={showPicker} onClose={() => setShowPicker(false)}>
            <PopoverTrigger>
              <Button
                w="40px"
                h="40px"
                bg={customColor}
                borderRadius="md"
                border="1px solid #e0e0e0"
                _hover={{ bg: customColor }} // Removes hover effect
                onClick={() => setShowPicker(!showPicker)}
              />
            </PopoverTrigger>
            <PopoverContent w="fit-content">
              <PopoverBody>
                <SketchPicker color={customColor} onChangeComplete={handleChangeComplete} />
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Hex Code Input */}
          <Input
            w="120px"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            onBlur={() => setCustomColor(selectedColor)}
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default ColorPickerComponent;
