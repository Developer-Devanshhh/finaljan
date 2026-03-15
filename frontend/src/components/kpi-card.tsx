"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface KPICardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: string;
  color?: "blue" | "green" | "red" | "orange" | "purple" | "slate";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  subtext,
  icon,
  color = "blue",
  trend,
  trendValue,
}) => {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-emerald-500 to-green-600",
    red: "from-red-500 to-rose-600",
    orange: "from-orange-400 to-amber-500",
    purple: "from-purple-500 to-violet-600",
    slate: "from-slate-700 to-slate-900",
  };

  const trendColorMap: Record<string, string> = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${colorMap[color]} text-white rounded-lg p-5 shadow-sm border-0`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-90">{label}</p>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold">{value}</p>
        {trend && trendValue && (
          <span className={`text-sm font-semibold ${trendColorMap[trend]}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>
      {subtext && <p className="text-xs mt-2 opacity-75">{subtext}</p>}
    </motion.div>
  );
};
