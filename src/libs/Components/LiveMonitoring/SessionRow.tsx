import React from "react";
import Flag from "react-world-flags";
import { Avatar, Tooltip } from "@chakra-ui/react";

type SessionRowProps = {
  name: string;
  avatarUrl?: string;
  countryCode: string; // e.g. "NG"
  ipAddress: string;
  currentPage: string;
  browser: string;
  os: string;
  visits: number;
  chats: number;
};

const SessionRow: React.FC<SessionRowProps> = ({
  name,
  avatarUrl,
  countryCode,
  ipAddress,
  currentPage,
  browser,
  os,
  visits,
  chats,
}) => {
  return (
    <div className="flex mt-3 items-center border rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 transition">
      {/* Col 1: Avatar + Flag (10%) */}
      <div className="flex items-center gap-2 w-[10%]">
        <Tooltip label={name} placement="top" hasArrow>
          <Avatar size="sm" name={name} src={avatarUrl} />
        </Tooltip>
        <Flag code={countryCode} className="h-5 w-8 rounded-sm" />
      </div>

      {/* Col 2: IP Address (25%) */}
      <Tooltip label="IP address" placement="top" hasArrow>
        <div className="truncate text-gray-700 w-[25%]">{ipAddress}</div>
      </Tooltip>

      {/* Col 3: Current Page (25%) */}
      <Tooltip label="Current Page" placement="top" hasArrow>
        <div className="truncate w-[25%]">{currentPage}</div>
      </Tooltip>

      {/* Col 4: Browser + OS (15%) */}
      <div className="flex flex-row gap-4 text-gray-500 w-[15%]">
        <Tooltip label={`Browser: ${browser}`} placement="top" hasArrow>
          <span className="truncate">{browser}</span>
        </Tooltip>
        <Tooltip label="Operating system" placement="top" hasArrow>
          <span className="truncate">{os}</span>
        </Tooltip>
      </div>

      {/* Col 5: Visitor Count (15%) */}
      <Tooltip label="Visit Count" placement="top" hasArrow>
        <div className="font-semibold text-gray-800 text-center w-[15%]">
          {visits}
        </div>
      </Tooltip>

      {/* Col 6: Chat Count (5%) */}
      <Tooltip label="Chat Count" placement="top" hasArrow>
        <div className="font-semibold text-gray-800 text-center w-[5%]">
          {chats}
        </div>
      </Tooltip>
    </div>
  );
};

export default SessionRow;
