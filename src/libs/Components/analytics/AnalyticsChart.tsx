"use client";

import { User } from "lucide-react";
import ChatVolumeChart from "../../Components/analytics/ChatVolumeChart";
import MissedChatsChart from "../../Components/analytics/MissedChatsChart";
import OfflineMessageChart from "../../Components/analytics/OfflineMessageChart";
import AverageChatDuration from "./AverageChatDuration";
import FirstResponseTimeChart from "./FirstResponseTimeChart";
import UserSatisfactionChart from "./UserSatisfactionChart";

export default function AnalyticsChart({ active }: { active: string }) {
  const renderChart = () => {
    switch (active) {
      case "Chat Volume":
        return <ChatVolumeChart />;
      case "Missed Chats":
        return <MissedChatsChart />;
      case "Offline Messages":
        return (
          <div>
            <OfflineMessageChart />
          </div>
        );
      case "Average Chat Duration":
        return (
          <div>
            <AverageChatDuration />
          </div>
        );
      case "User Satisfaction":
        return (
          <div>
            <UserSatisfactionChart />
          </div>
        );
      case "First Response Time":
        return (
          <div>
            <FirstResponseTimeChart />
          </div>
        );
      default:
        return <div>Select a report from the sidebar</div>;
    }
  };

  // ✅ Show header for these reports
  const showHeader =
    active === "Chat Volume" ||
    active === "Missed Chats" ||
    active === "Offline Messages";

  return (
    <div className="p-6 border-t-2 mt-6">
      {showHeader && (
        <div className="mb-4">
          <h2 className="text-lg text-center bg-[#101828] text-[#FFFFFF] py-[7px] font-semibold">
            {active} Report
          </h2>
        </div>
      )}

      {renderChart()}
    </div>
  );
}
