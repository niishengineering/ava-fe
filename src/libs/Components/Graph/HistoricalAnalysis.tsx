import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";

import { useGerPropertyChatHistoricalAnalysis } from "@/libs/Hooks/analyticsHooks";
import usePropertyChatStore from "@/store/propertyChatStore";
import LoadingSpinner from "../loadingSpinner";

// Register the components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const dataw = {
  labels: [
    "2025-10-13",
    "2025-10-12",
    "2025-10-11",
    "2025-10-10",
    "2025-10-09",
    "2025-10-08",
    "2025-10-07",
  ],
  datasets: [
    {
      label: "Visitors",
      data: [1, 0, 0, 1, 0, 0, 0],
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      tension: 0.3,
    },
    {
      label: "Chat",
      data: [1, 0, 0, 1, 0, 0, 0],
      fill: false,
      borderColor: "rgba(255,99,132,1)",
      backgroundColor: "rgba(255,99,132,0.2)",
      tension: 0.3,
    },
    {
      label: "Page Views",
      data: [7, 0, 0, 28, 0, 0, 0],
      fill: false,
      borderColor: "rgba(54,162,235,1)",
      backgroundColor: "rgba(54,162,235,0.2)",
      tension: 0.3,
    },
  ],
};
const options: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      display: true,
    },
  },
};

const HistoricalAnalysis = () => {
  const selectedProperty = usePropertyChatStore(
    (state: any) => state.selectedProperty
  );
  const [data, setData] = useState<any>(null);
  const {
    data: histoticalAnalysis,
    isLoading,
    isError,
  } = useGerPropertyChatHistoricalAnalysis(selectedProperty);
  useEffect(() => {
    setData(histoticalAnalysis?.data);
  }, [histoticalAnalysis, selectedProperty]);
  return (
    <div
      style={{
        width: "100%", // Full viewport width
        height: "300px", // Full viewport height
        // display: 'flex', // Center the chart
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <LoadingSpinner showLoadingSpinner={isLoading} />
      {data && <Line data={data} options={options} />}
    </div>
  );
};

export default HistoricalAnalysis;
