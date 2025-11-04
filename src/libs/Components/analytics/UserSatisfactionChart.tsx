"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";

const data = [
  { name: "Figma", Shortest: 29, Average: 45, Longest: 59 },
  { name: "Sketch", Shortest: 28, Average: 89, Longest: 70 },
  { name: "XD", Shortest: 96, Average: 85, Longest: 84 },
  { name: "Photoshop", Shortest: 11, Average: 18, Longest: 88 },
  { name: "Illustrator", Shortest: 46, Average: 43, Longest: 67 },
  { name: "AfterEffect", Shortest: 38, Average: 91, Longest: 97 },
];

export default function AverageChartDuration() {
  // map original keys to custom labels
  const labelMap: Record<string, string> = {
    Shortest: "Negative",
    Average: "Positive",
    Longest: "Neutral",
  };

  // custom legend renderer — forces the desired order
  const renderLegend = (props: any) => {
    const { payload } = props || {};
    if (!payload || !Array.isArray(payload)) return null;

    const order = ["Shortest", "Average", "Longest"]; // keep order aligned with data
    const byKey: Record<string, any> = {};
    payload.forEach((it: any) => {
      const key = it.value ?? it.dataKey ?? (it.payload && it.payload.dataKey);
      if (key) byKey[key] = it;
    });

    return (
      <div className="flex justify-center items-center gap-4">
        {order.map((k) => {
          const item = byKey[k];
          if (!item) return null;
          const color =
            item.color ?? (item.payload && item.payload.fill) ?? "#ccc";
          return (
            <div
              key={k}
              className="flex items-center gap-2 text-xs text-gray-600">
              <span
                style={{
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  display: "inline-block",
                  borderRadius: 3, // small rounding to mimic bars
                }}
              />
              <span>{labelMap[k] ?? k}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-6 mt-4">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xs font-bold text-[#101828] relative top-6">
            User Satisfaction
          </h2>
          <span className="text-xs text-gray-500 cursor-pointer relative top-5">
            MORE
          </span>
        </div>

        <div className="flex mb-4">
          <svg
            width="134"
            height="12"
            viewBox="0 0 134 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5" filter="url(#filter0_f_108_5548)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29 7H1L0 5H29V7Z"
                fill="#3086F3"
              />
            </g>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30 8H2L1 5H30V8Z"
              fill="#07DBFA"
            />
            <path d="M33 7V6H233V7H33Z" fill="black" fillOpacity="0.25" />
            <defs>
              <filter
                id="filter0_f_108_5548"
                x="-5"
                y="0"
                width="39"
                height="12"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="BackgroundImageFix"
                  result="shape"
                />
                <feGaussianBlur
                  stdDeviation="2.5"
                  result="effect1_foregroundBlur_108_5548"
                />
              </filter>
            </defs>
          </svg>

          <svg
            width="775"
            height="6"
            viewBox="0 0 775 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 5V6H4.20711L13.2071 1H18H800V0H18H12.7929L3.79289 5H0Z"
              fill="black"
              fillOpacity="0.25"
            />
          </svg>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 30, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid
              stroke="#E6E9EE"
              strokeDasharray="2 2"
              vertical={true}
            />
            <XAxis
              dataKey="name"
              axisLine={true}
              tickLine={false}
              interval={0}
              scale="band"
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            {/* use the custom renderer here */}
            <Legend content={renderLegend} verticalAlign="bottom" />

            <Bar dataKey="Shortest" fill="#7086FD" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Shortest"
                position="top"
                fill="#666"
                fontSize="11"
                fontWeight="500"
              />
            </Bar>
            <Bar dataKey="Average" fill="#6FD195" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Average"
                position="top"
                fill="#666"
                fontSize="11"
                fontWeight="500"
              />
            </Bar>
            <Bar dataKey="Longest" fill="#FFAE4C" radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="Longest"
                position="top"
                fill="#666"
                fontSize="11"
                fontWeight="500"
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
