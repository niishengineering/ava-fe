import React, { useState, useRef, useEffect } from "react";
import { Avatar, Tooltip } from "@chakra-ui/react";

// Mock Flag component
const Flag = ({ code, className }: any) => (
  <div
    className={`${className} bg-blue-500 flex items-center justify-center text-white text-xs font-bold`}
  >
    {code}
  </div>
);

type SessionRowProps = {
  name: string;
  avatarUrl?: string;
  countryCode: string;
  ipAddress: string;
  currentPage: string;
  browser: string;
  os: string;
  visits: number;
  chats: number;
  onViewHistory: () => void;
  onStartNewChat?: () => void;
};

const SessionRow: React.FC<SessionRowProps> = React.memo(
  ({
    name,
    avatarUrl,
    countryCode,
    ipAddress,
    currentPage,
    browser,
    os,
    visits,
    chats,
    onViewHistory,
    onStartNewChat,
  }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          menuRef.current &&
          !menuRef.current.contains(event.target as Node)
        ) {
          setIsMenuOpen(false);
        }
      };

      if (isMenuOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isMenuOpen]);

    const handleMenuItemClick = (action: () => void | undefined) => {
      if (action) action();
      setIsMenuOpen(false);
    };

    return (
      <div className="relative" ref={menuRef}>
        {/* Row */}

        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex mt-3 items-center border rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:bg-gray-50 transition cursor-pointer"
        >
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

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border rounded-lg py-1 z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                onViewHistory();
                console.log("testing");
              }}
            >
              View History
            </button>

            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              // onClick={() => handleMenuItemClick(onStartNewChat)}
            >
              Start New Chat
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default SessionRow;
