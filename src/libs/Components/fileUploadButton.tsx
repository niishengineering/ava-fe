import React, { useRef } from "react";
import { IconButton, Box } from "@chakra-ui/react";
import { FaPaperclip } from "react-icons/fa";

interface FileUploadButtonProps {
  onFileSelect: (file: File) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Simulate click on hidden file input
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file); // Pass the selected file to the parent
    }
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }} // Hide the file input
      />
      <IconButton
        icon={<FaPaperclip />}
        aria-label="Attach file"
        variant="ghost"
        size="lg"
        minWidth={"2.3rem"}
        color="gray.600"
        onClick={handleButtonClick}
        w={"10%"}
      />
    </Box>
  );
};

export default FileUploadButton;
