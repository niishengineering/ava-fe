import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

interface LoadingSpinnerProps {
    showLoadingSpinner: boolean
}

const LoadingSpinner : React.FC<LoadingSpinnerProps> = ({showLoadingSpinner}) => {
  return (
    <Flex
      display={showLoadingSpinner ? 'flex' : 'none'}
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      align="center"
      justify="center"
      bg="rgba(255, 255, 255, 0.8)" // Semi-transparent overlay
      zIndex="10"
    >
      <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
    </Flex>
  );
};

export default LoadingSpinner;
