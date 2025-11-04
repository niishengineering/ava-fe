"use client";

import React, { useState } from "react";
import AnalyticsSidebar from "../../libs/Components/analytics/AnalyticsSidebar";
import AnalyticsChart from "../../libs/Components/analytics/AnalyticsChart";
import SidebarWithHeader from "@/libs/Layouts/Dashboard";

const AnalyticsPage: React.FC = () => {
  // state lives here
  const [activeReport, setActiveReport] = useState("Chat Volume");

  return (
    <SidebarWithHeader>
      <div className="flex gap-2">
        {/* Sidebar */}
        <div>
          <AnalyticsSidebar active={activeReport} onSelect={setActiveReport} />
        </div>

        {/* Chart */}
        <div className="flex-1">
          <AnalyticsChart active={activeReport} />
        </div>
      </div>
    </SidebarWithHeader>
  );
};

export default AnalyticsPage;
