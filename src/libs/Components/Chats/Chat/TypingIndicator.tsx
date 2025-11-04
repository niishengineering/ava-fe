import React from "react";

interface TypingIndicatorProp {
  isTyping: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProp> = ({ isTyping }) => {
  if (!isTyping) return null;
  return (
    <div className="flex items-center space-x-1 px-3 py-1 w-fit ">
      <div className="flex space-x-1">
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-.2s]"></span>
        <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce [animation-delay:-.4s]"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
