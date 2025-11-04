import React from "react";
import { getChatSentTime } from "@/libs/utilities";

const ChatJoinNotification = ({
  userName = "Anastasiia P.",
  timestamp = "13 Sep 2025, 6:29 AM",
  avatarColor = "bg-gradient-to-br from-blue-400 to-blue-800",
}) => {
  return (
    <div className="flex flex-col items-center py-4 px-6 max-w-sm mx-auto">
      {/* Avatar */}
      <div
        className={`w-12 h-12 rounded-full ${avatarColor} mb-3 shadow-md`}
      ></div>

      {/* Join message */}
      <div className="text-center">
        <p className="text-gray-700 font-medium mb-1">{userName}</p>
        <p className="text-gray-600 text-sm mb-2">joined the chat</p>
        <p className="text-gray-400 text-xs">{getChatSentTime(timestamp)}</p>
      </div>
    </div>
  );
};

const ChatLeaveNotification = ({
  userName = "Suzy Q",
  timestamp = "13 Sep 2025, 6:29 AM",
}) => {
  return (
    <div className="flex flex-col items-center py-4 px-6 max-w-sm mx-auto">
      {/* Horizontal line with centered text */}
      <div className="relative w-full flex items-center mb-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <div className="px-4">
          <p className="text-gray-600 text-sm whitespace-nowrap">
            {userName} left the chat
          </p>
        </div>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Timestamp */}
      <p className="text-gray-400 text-xs">{getChatSentTime(timestamp)}</p>
    </div>
  );
};

export { ChatJoinNotification, ChatLeaveNotification };
