"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chatVolumeData = [
  { name: "15 Apr - 21 Apr", chats: 2500 },
  { name: "22 Apr - 28 Apr", chats: 2000 },
  { name: "29 Apr - 06 May", chats: 1500 },
  { name: "07 May - 14 May", chats: 1000 },
];

export default function ChatVolumeChart() {
  return (
    <div>
      <div className="m">
        <div className="flex justify-between pl-8 mx-0 max-w-[900px] pt-3">
          <div>
            <p className="text-[21px] font-medium text-[#000]">
              7330 Chat Volume
            </p>
            <p className="text-[15px]">
              <span className="text-red-500">53% less</span> actions since last
              week
            </p>
          </div>
          <div className="mt-2 flex gap-2">
            <button className="px-4 text-sm border rounded-full bg-[#1A63FF2E]">
              7 days
            </button>
            <button className="px-4 text-sm border rounded-full bg-[#1A63FFCC]">
              30 days
            </button>
            <button className="px-4 text-sm border rounded-full bg-[#1A63FF2E]">
              90 days
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chatVolumeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="8 8" vertical={false} />
          <XAxis
            dataKey="name"
            interval={0}
            tickLine={false}
            padding={{ left: 0, right: 0 }}
            scale="band"
            axisLine={{ stroke: "#000", strokeWidth: 0.4 }}
          />
          <YAxis
            domain={[0, 2500]}
            ticks={[0, 500, 1000, 1500, 2000, 2500]}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="chats"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{ r: 8, fill: "#2563eb", stroke: "#2563eb", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
