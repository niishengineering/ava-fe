"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Figma", Shortest: 29, Average: 45, Longest: 59 },
  { name: "Sketch", Shortest: 28, Average: 89, Longest: 70 },
  { name: "XD", Shortest: 96, Average: 85, Longest: 84 },
  { name: "Photoshop", Shortest: 11, Average: 18, Longest: 88 },
  { name: "Illustrator", Shortest: 46, Average: 43, Longest: 67 },
  { name: "AfterEffect", Shortest: 38, Average: 91, Longest: 97 },
  { name: "InDesign", Shortest: 55, Average: 36, Longest: 94 },
  { name: "Maya", Shortest: 17, Average: 38, Longest: 83 },
  { name: "Premiere", Shortest: 57, Average: 64, Longest: 91 },
  { name: "Final Cut", Shortest: 70, Average: 80, Longest: 98 },
  { name: "Figma", Shortest: 62, Average: 35, Longest: 77 },
  { name: "Sketch", Shortest: 42, Average: 28, Longest: 81 },
];

const LINE_TYPE = "monotone"; // keeps curve going through points
const DOT_OUTER_R = 10;
const DOT_RING_R = 6;
const DOT_INNER_R = 3.5;
const HALO_OPACITY = 0.08;
const STROKE_WIDTH = 2.2;

// Round cx/cy to avoid subpixel offsets so centers align exactly
const roundCoord = (n: number | undefined) =>
  typeof n === "number" ? Math.round(n) : n;

const CustomDot = ({ cx, cy, color }: any) => {
  if (cx == null || cy == null) return null;
  const x = roundCoord(cx);
  const y = roundCoord(cy);
  return (
    <g pointerEvents="none">
      <circle
        cx={x}
        cy={y}
        r={DOT_OUTER_R}
        fill={color}
        opacity={HALO_OPACITY}
      />
      <circle
        cx={x}
        cy={y}
        r={DOT_RING_R}
        fill="#fff"
        stroke={color}
        strokeWidth={STROKE_WIDTH}
      />
      <circle cx={x} cy={y} r={DOT_INNER_R} fill={color} />
    </g>
  );
};

const CustomActiveDot = ({ cx, cy, color }: any) => {
  if (cx == null || cy == null) return null;
  const x = roundCoord(cx);
  const y = roundCoord(cy);
  return (
    <g pointerEvents="none">
      <circle
        cx={x}
        cy={y}
        r={DOT_OUTER_R * 1.3}
        fill={color}
        opacity={HALO_OPACITY * 1.25}
      />
      <circle
        cx={x}
        cy={y}
        r={DOT_RING_R * 1.25}
        fill="#fff"
        stroke={color}
        strokeWidth={STROKE_WIDTH + 0.6}
      />
      <circle cx={x} cy={y} r={DOT_INNER_R * 1.15} fill={color} />
    </g>
  );
};

const RenderLegend = ({ payload }: any) => {
  if (!payload) return null;

  const order = ["Shortest", "Average", "Longest"];
  const byKey: Record<string, any> = {};
  payload.forEach((it: any) => {
    const key = it.value ?? it.dataKey ?? (it.payload && it.payload.dataKey);
    if (key) byKey[key] = it;
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 28,
        alignItems: "center",
        paddingTop: 6,
      }}>
      {order.map((k) => {
        const entry = byKey[k];
        if (!entry) return null;
        return (
          <div
            key={entry.value}
            style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg
              width="38"
              height="20"
              viewBox="0 0 38 20"
              style={{ display: "block" }}>
              <line
                x1="4"
                y1="10"
                x2="34"
                y2="10"
                stroke={entry.color}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.8"
              />
              <circle
                cx="19"
                cy="10"
                r="7.4"
                fill="#fff"
                stroke={entry.color}
                strokeWidth="2.1"
              />
              <circle cx="19" cy="10" r="3.8" fill={entry.color} />
            </svg>
            <span style={{ fontSize: 13, color: "#475569" }}>
              {entry.value}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function FirstResponseTimeChart() {
  return (
    <div className="flex-1 p-6 mt-4">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xs font-bold text-[#101828] relative top-6">
            Average Chat Duration
          </h2>
          <span className="text-xs text-gray-500 cursor-pointer relative top-5">
            MORE
          </span>
        </div>

        <div className="flex  mb-4">
          <svg
            width="134"
            height="12"
            viewBox="0 0 134 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5" filter="url(#filter0_f_108_5548)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M29 7H1L0 5H29V7Z"
                fill="#3086F3"
              />
            </g>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M30 8H2L1 5H30V8Z"
              fill="#07DBFA"
            />
            <path d="M33 7V6H233V7H33Z" fill="black" fill-opacity="0.25" />
            <defs>
              <filter
                id="filter0_f_108_5548"
                x="-5"
                y="0"
                width="39"
                height="12"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
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
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M0 5V6H4.20711L13.2071 1H18H800V0H18H12.7929L3.79289 5H0Z"
              fill="black"
              fill-opacity="0.25"
            />
          </svg>
        </div>

        <ResponsiveContainer width="100%" height={360}>
          <LineChart
            data={data}
            margin={{ top: 26, right: 30, left: 30, bottom: 20 }}>
            <CartesianGrid stroke="#E6E9EE" strokeDasharray="4 4" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ textAnchor: "middle", fontSize: 13, fill: "#475569" }}
              tickMargin={10}
              interval={0}
              domain={["dataMin", "dataMax"]}
            />
            <YAxis
              domain={[0, 100]}
              ticks={[20, 40, 60, 80, 100]}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Legend content={RenderLegend} verticalAlign="bottom" height={56} />

            <Line
              type={LINE_TYPE}
              dataKey="Shortest"
              stroke="#7086FD"
              strokeWidth={2.5}
              dot={(props) => <CustomDot {...props} color="#7086FD" />}
              activeDot={(props) => (
                <CustomActiveDot {...props} color="#7086FD" />
              )}
              isAnimationActive={false}
            />
            <Line
              type={LINE_TYPE}
              dataKey="Average"
              stroke="#6FD195"
              strokeWidth={2.5}
              dot={(props) => <CustomDot {...props} color="#6FD195" />}
              activeDot={(props) => (
                <CustomActiveDot {...props} color="#6FD195" />
              )}
              isAnimationActive={false}
            />
            <Line
              type={LINE_TYPE}
              dataKey="Longest"
              stroke="#FFAE4C"
              strokeWidth={2.5}
              dot={(props) => <CustomDot {...props} color="#FFAE4C" />}
              activeDot={(props) => (
                <CustomActiveDot {...props} color="#FFAE4C" />
              )}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
