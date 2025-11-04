"use client";

import Image from "next/image";

const menuItems = [
  { label: "Chat Volume", icon: "/phone-icon.png" },
  { label: "Missed Chats", icon: "/missed-call.png" },
  { label: "Offline Messages", icon: "/missed-call.png" },
  { label: "Average Chat Duration", icon: "/missed-call.png" },
  { label: "User Satisfaction", icon: "/missed-call.png" },
  { label: "First Response Time", icon: "/missed-call.png" },
];

export default function AnalyticsSidebar({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (label: string) => void;
}) {
  return (
    <div className="w-60 h-[610px] bg-[#1A63FF08] pt-6 shadow-md">
      <ul className="space-y-2">
        {menuItems.map(({ label, icon }) => (
          <li
            key={label}
            className={`flex items-center gap-2 cursor-pointer rounded-md pl-4 py-2 text-sm transition-colors ${
              active === label
                ? "bg-[#1A63FF21] text-blue-800"
                : "text-[#101828] hover:bg-blue-100"
            }`}
            onClick={() => onSelect(label)}>
            <Image src={icon} alt={label} width={20} height={20} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
