"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/kpi-card";
import {
  CitySummary,
  WardPerf,
  CommissionerWeekData,
  CriticalTicket,
  DEPT_NAMES,
  PRIORITY_ICONS,
} from "@/lib/dashboard-types";

// Mock API
const mockCommissionerApi = {
  getCitySummary: async (): Promise<CitySummary> => ({
    total_tickets: 2847,
    closed: 2391,
    resolution_rate: 84,
    overdue: 127,
    avg_satisfaction: 4.1,
    avg_resolution_days: 9,
    total_spent_budget: 4250000,
    total_estimated_budget: 5600000,
  }),

  getWardPerformance: async (): Promise<WardPerf[]> => [
    { ward_id: 1, open: 8, closed: 64, overdue: 2, total: 72, budget_spent: 285000 },
    { ward_id: 2, open: 12, closed: 58, overdue: 4, total: 74, budget_spent: 320000 },
    { ward_id: 3, open: 6, closed: 71, overdue: 1, total: 78, budget_spent: 295000 },
    { ward_id: 4, open: 10, closed: 62, overdue: 3, total: 75, budget_spent: 310000 },
    { ward_id: 5, open: 7, closed: 69, overdue: 2, total: 78, budget_spent: 305000 },
    { ward_id: 6, open: 9, closed: 65, overdue: 3, total: 77, budget_spent: 315000 },
    { ward_id: 7, open: 11, closed: 60, overdue: 4, total: 75, budget_spent: 330000 },
    { ward_id: 8, open: 8, closed: 67, overdue: 2, total: 77, budget_spent: 290000 },
  ],

  getBudgetBurnRate: async (weeks?: number): Promise<CommissionerWeekData[]> => [
    { week_label: "Week 1", budget_spent: 285000 },
    { week_label: "Week 2", budget_spent: 320000 },
    { week_label: "Week 3", budget_spent: 295000 },
    { week_label: "Week 4", budget_spent: 310000 },
    { week_label: "Week 5", budget_spent: 305000 },
    { week_label: "Week 6", budget_spent: 315000 },
    { week_label: "Week 7", budget_spent: 330000 },
    { week_label: "Week 8", budget_spent: 290000 },
    { week_label: "Week 9", budget_spent: 320000 },
    { week_label: "Week 10", budget_spent: 300000 },
  ],

  getCriticalTickets: async (limit?: number): Promise<CriticalTicket[]> => [
    {
      id: "1",
      ticket_code: "JV-002341",
      dept_id: "PWD",
      issue_category: "Major Pothole",
      priority_label: "CRITICAL",
      priority_score: 98,
      ward_id: 2,
      days_overdue: 5,
      estimated_cost: 185000,
    },
    {
      id: "2",
      ticket_code: "JV-002388",
      dept_id: "WTR",
      issue_category: "Water Pipeline Burst",
      priority_label: "CRITICAL",
      priority_score: 95,
      ward_id: 7,
      days_overdue: 2,
      estimated_cost: 420000,
    },
    {
      id: "3",
      ticket_code: "JV-002297",
      dept_id: "HLTH",
      issue_category: "Health Hazard",
      priority_label: "CRITICAL",
      priority_score: 92,
      ward_id: 4,
      days_overdue: 3,
      estimated_cost: 95000,
    },
  ],
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Budget Burn Chart
function BudgetBurnChart({ data }: { data: CommissionerWeekData[] }) {
  if (data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-400 text-sm italic">
        No budget data yet
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.budget_spent), 100000);
  const W = 500,
    H = 150,
    pad = 20;
  const barWidth = ((W - pad * 2) / data.length) * 0.6;
  const xStep = (W - pad * 2) / data.length;

  const yScale = (v: number) => H - pad - (v / maxVal) * (H - pad * 2);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.5, 1].map((mult) => (
        <line
          key={mult}
          x1={pad}
          y1={yScale(maxVal * mult)}
          x2={W - pad}
          y2={yScale(maxVal * mult)}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const x = pad + (i * xStep + (xStep - barWidth) / 2);
        const y = yScale(d.budget_spent);
        const height = H - pad - y;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barWidth}
              height={height}
              fill="url(#budgetGrad)"
              rx="2"
            />
            <text
              x={x + barWidth / 2}
              y={H - 5}
              textAnchor="middle"
              fontSize="10"
              fill="#9ca3af"
            >
              {d.week_label.split(" ")[1]}
            </text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function CommissionerDashboard() {
  const [summary, setSummary] = useState<CitySummary | null>(null);
  const [wardPerf, setWardPerf] = useState<WardPerf[]>([]);
  const [burnRate, setBurnRate] = useState<CommissionerWeekData[]>([]);
  const [criticalTickets, setCriticalTickets] = useState<CriticalTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [s, wp, br, ct] = await Promise.all([
          mockCommissionerApi.getCitySummary(),
          mockCommissionerApi.getWardPerformance(),
          mockCommissionerApi.getBudgetBurnRate(10),
          mockCommissionerApi.getCriticalTickets(20),
        ]);
        setSummary(s);
        setWardPerf(wp);
        setBurnRate(br);
        setCriticalTickets(ct);
      } catch (error) {
        console.error("Failed to load commissioner dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading city command center…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-950 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">
            Executive Overview
          </p>
          <h1 className="text-4xl font-bold mb-1 tracking-tight">Commissioner Dashboard</h1>
          <p className="text-slate-300 text-sm">
            City-wide systems health, budget oversight, and critical infrastructure alerts
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"
          >
            <KPICard
              label="Total Tickets"
              value={summary.total_tickets}
              icon="📋"
              color="blue"
              subtext="city-wide"
            />
            <KPICard
              label="Resolved"
              value={summary.closed}
              icon="✅"
              color="green"
              subtext={`${summary.resolution_rate}% rate`}
            />
            <KPICard
              label="Overdue"
              value={summary.overdue}
              icon="⚠️"
              color="red"
              subtext="past SLA"
            />
            <KPICard
              label="Avg Resolution"
              value={`${summary.avg_resolution_days}d`}
              icon="⏱️"
              color="purple"
              subtext="days"
            />
            <KPICard
              label="Satisfaction"
              value={summary.avg_satisfaction ? `${summary.avg_satisfaction.toFixed(1)}/5` : "N/A"}
              icon="⭐"
              color="blue"
              subtext="citizen feedback"
            />
            <KPICard
              label="Budget Status"
              value={`${Math.round((summary.total_spent_budget / summary.total_estimated_budget) * 100)}%`}
              icon="💰"
              color="slate"
              subtext={`₹${Math.round(summary.total_spent_budget / 1000000)}M spent`}
            />
          </motion.div>
        )}

        {/* Burn Rate + Critical Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Budget Burn Rate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📊</span> Budget Burn Rate
                </CardTitle>
                <CardDescription>Trailing 10 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <BudgetBurnChart data={burnRate} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Critical Tickets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <span className="text-xl">🚨</span> Critical Infrastructure Issues
                </CardTitle>
                <CardDescription className="text-red-700">
                  {criticalTickets.length} high-severity tickets requiring executive attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {criticalTickets.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-3xl mb-2">🎉</p>
                    <p className="text-gray-400 text-sm">
                      No critical infrastructure tickets! All systems operational.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {criticalTickets.map((ticket) => (
                      <motion.div
                        key={ticket.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-600">
                              {ticket.ticket_code}
                            </span>
                            <Badge className="text-[10px] bg-red-600 text-white">
                              Score: {ticket.priority_score.toFixed(0)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {ticket.issue_category}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">
                              {DEPT_NAMES[ticket.dept_id] || ticket.dept_id}
                            </span>
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              Ward {ticket.ward_id}
                            </span>
                            {ticket.estimated_cost && (
                              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                {formatCurrency(ticket.estimated_cost)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          {ticket.days_overdue > 0 ? (
                            <Badge className="bg-red-100 text-red-800 text-xs">
                              {ticket.days_overdue}d Overdue
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-500">In SLA</span>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ward Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-xl">🗺️</span> Ward Infrastructure Performance
              </CardTitle>
              <CardDescription>Service metrics sorted by highest overdue risk</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Ward ID
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Open
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Closed
                      </TableHead>
                      <TableHead className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Overdue Risk
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Budget Spent
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {wardPerf.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                          No ward data
                        </TableCell>
                      </TableRow>
                    ) : (
                      wardPerf.map((w, i) => (
                        <motion.tr
                          key={w.ward_id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="hover:bg-gray-50 transition-colors group"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-sm group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                {w.ward_id}
                              </div>
                              <span className="font-semibold text-slate-700 group-hover:text-slate-900">
                                Ward {w.ward_id}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-slate-600 font-medium">
                            {w.open}
                          </TableCell>
                          <TableCell className="text-center font-medium text-emerald-600">
                            {w.closed}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2.5 rounded-full ${
                                  w.overdue > 10
                                    ? "bg-red-500"
                                    : w.overdue > 0
                                      ? "bg-orange-400"
                                      : "bg-gray-200"
                                }`}
                                style={{
                                  width: `${Math.min((w.overdue / Math.max(w.total, 1)) * 100, 100)}%`,
                                }}
                              />
                              <span
                                className={`text-xs font-bold ${
                                  w.overdue > 0 ? "text-red-600" : "text-slate-400"
                                }`}
                              >
                                {w.overdue} tickets
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-medium text-slate-700">
                            {formatCurrency(w.budget_spent)}
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
