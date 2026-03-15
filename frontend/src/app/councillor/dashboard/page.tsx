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
import { TicketTable } from "@/components/ticket-table";
import {
  WardSummary,
  DeptPerf,
  CouncillorWeekData,
  TopIssue,
  OverdueTicket,
  DEPT_NAMES,
  PRIORITY_ICONS,
} from "@/lib/dashboard-types";

import { councillorApi } from "@/lib/api";

// Mock API
const mockCouncillorApi = {
  getWardSummary: async (): Promise<WardSummary> => ({
    ward_id: 5,
    total: 156,
    open: 18,
    closed: 132,
    overdue: 4,
    resolution_rate: 84.6,
    avg_resolution_days: 8.2,
    avg_satisfaction: 4.3,
  }),

  getDepartmentPerformance: async (): Promise<DeptPerf[]> => [
    { dept_id: "PWD", total: 54, open: 8, closed: 44, overdue: 2 },
    { dept_id: "WTR", total: 32, open: 4, closed: 28, overdue: 0 },
    { dept_id: "SWM", total: 28, open: 3, closed: 24, overdue: 1 },
    { dept_id: "ELEC", total: 22, open: 2, closed: 20, overdue: 1 },
    { dept_id: "HLTH", total: 20, open: 1, closed: 19, overdue: 0 },
  ],

  getSatisfactionTrend: async (): Promise<CouncillorWeekData[]> => [
    { week_label: "Week 1", avg_satisfaction: 4.1, ticket_count: 28 },
    { week_label: "Week 2", avg_satisfaction: 4.0, ticket_count: 31 },
    { week_label: "Week 3", avg_satisfaction: 4.4, ticket_count: 24 },
    { week_label: "Week 4", avg_satisfaction: 4.3, ticket_count: 26 },
    { week_label: "Week 5", avg_satisfaction: 4.2, ticket_count: 29 },
  ],

  getTopIssues: async (): Promise<TopIssue[]> => [
    { category: "Pothole Repair", count: 28, percentage: 18 },
    { category: "Water Pipeline", count: 24, percentage: 15 },
    { category: "Street Lighting", count: 19, percentage: 12 },
    { category: "Waste Management", count: 15, percentage: 10 },
    { category: "Drainage Issue", count: 12, percentage: 8 },
  ],

  getOverdueTickets: async (): Promise<OverdueTicket[]> => [
    {
      id: "1",
      ticket_code: "JV-001101",
      dept_id: "PWD",
      issue_category: "Road Damage",
      priority_label: "CRITICAL",
      days_overdue: 3,
      status: "IN_PROGRESS",
    },
    {
      id: "2",
      ticket_code: "JV-001056",
      dept_id: "WTR",
      issue_category: "Pipe Burst",
      priority_label: "HIGH",
      days_overdue: 1,
      status: "ASSIGNED",
    },
    {
      id: "3",
      ticket_code: "JV-000998",
      dept_id: "SWM",
      issue_category: "Waste Dump",
      priority_label: "MEDIUM",
      days_overdue: 2,
      status: "OPEN",
    },
    {
      id: "4",
      ticket_code: "JV-001001",
      dept_id: "ELEC",
      issue_category: "Lighting",
      priority_label: "MEDIUM",
      days_overdue: 1,
      status: "ASSIGNED",
    },
  ],
};

// Simple inline SVG satisfaction chart
function SatisfactionChart({ data }: { data: CouncillorWeekData[] }) {
  const validData = data.filter((d) => d.avg_satisfaction !== null);
  if (validData.length < 2) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-400 text-sm italic">
        Not enough data yet
      </div>
    );
  }

  const W = 500,
    H = 180,
    pad = 30;
  const maxSat = Math.max(...validData.map((d) => d.avg_satisfaction ?? 0), 5);
  const minSat = Math.min(...validData.map((d) => d.avg_satisfaction ?? 0), 0);

  const yScale = (v: number) => {
    const normalized = (v - minSat) / (maxSat - minSat || 1);
    return H - pad - normalized * (H - pad * 2);
  };

  const xStep = (W - pad * 2) / (validData.length - 1 || 1);

  const points = validData
    .map((d, i) => {
      const x = pad + i * xStep;
      const y = yScale(d.avg_satisfaction ?? 0);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-40" preserveAspectRatio="none">
      {/* Grid lines */}
      {[0, 0.5, 1].map((mult) => (
        <line
          key={mult}
          x1={pad}
          y1={yScale(minSat + (maxSat - minSat) * mult)}
          x2={W - pad}
          y2={yScale(minSat + (maxSat - minSat) * mult)}
          stroke="#e5e7eb"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Line */}
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />

      {/* Points */}
      {validData.map((d, i) => {
        const x = pad + i * xStep;
        const y = yScale(d.avg_satisfaction ?? 0);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="#3b82f6"
            stroke="white"
            strokeWidth="2"
          />
        );
      })}

      {/* Labels */}
      {validData.map((d, i) => {
        const x = pad + i * xStep;
        return (
          <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
            {d.week_label}
          </text>
        );
      })}
    </svg>
  );
}

export default function CouncillorDashboard() {
  const [wardSummary, setWardSummary] = useState<WardSummary | null>(null);
  const [deptPerf, setDeptPerf] = useState<DeptPerf[]>([]);
  const [satisfactionTrend, setSatisfactionTrend] = useState<CouncillorWeekData[]>([]);
  const [topIssues, setTopIssues] = useState<TopIssue[]>([]);
  const [overdueTickets, setOverdueTickets] = useState<OverdueTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [realWard, realDept, realTrend, realIssues, realOverdue] = await Promise.allSettled([
          councillorApi.getWardSummary().then(res => res.data),
          councillorApi.getDeptPerformance().then(res => res.data),
          councillorApi.getSatisfactionTrend().then(res => res.data),
          councillorApi.getTopIssues().then(res => res.data),
          councillorApi.getOverdueTickets().then(res => res.data),
        ]);

        const wardData = realWard.status === "fulfilled" && realWard.value?.total > 0
          ? realWard.value
          : await mockCouncillorApi.getWardSummary();

        const deptData = realDept.status === "fulfilled" && realDept.value?.length > 0
          ? realDept.value
          : await mockCouncillorApi.getDepartmentPerformance();

        const trendData = realTrend.status === "fulfilled" && realTrend.value?.length > 0
          ? realTrend.value
          : await mockCouncillorApi.getSatisfactionTrend();

        const issuesData = realIssues.status === "fulfilled" && realIssues.value?.length > 0
          ? realIssues.value
          : await mockCouncillorApi.getTopIssues();

        const overdueData = realOverdue.status === "fulfilled" && realOverdue.value?.length > 0
          ? realOverdue.value
          : await mockCouncillorApi.getOverdueTickets();

        setWardSummary(wardData);
        setDeptPerf(deptData);
        setSatisfactionTrend(trendData);
        setTopIssues(issuesData);
        setOverdueTickets(overdueData);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
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
          <p className="text-sm text-gray-500">Loading councillor dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-emerald-200 text-sm uppercase tracking-wider font-semibold mb-2">
            Ward Administration
          </p>
          <h1 className="text-4xl font-bold mb-1 tracking-tight">
            Councillor Dashboard {wardSummary && `— Ward ${wardSummary.ward_id}`}
          </h1>
          <p className="text-emerald-100 text-sm">
            Monitor service delivery, citizen satisfaction, and departmental performance
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Cards */}
        {wardSummary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <KPICard
              label="Total Complaints"
              value={wardSummary.total}
              icon="📋"
              color="blue"
            />
            <KPICard
              label="Open Issues"
              value={wardSummary.open}
              icon="🔓"
              color="orange"
              subtext={`${wardSummary.overdue} overdue`}
            />
            <KPICard
              label="Resolved"
              value={wardSummary.closed}
              icon="✅"
              color="green"
              subtext={`${wardSummary.resolution_rate.toFixed(1)}% rate`}
            />
            <KPICard
              label="Avg Resolution"
              value={`${wardSummary.avg_resolution_days.toFixed(1)}d`}
              icon="⏱️"
              color="purple"
              subtext="days to close"
            />
            <KPICard
              label="Satisfaction"
              value={wardSummary.avg_satisfaction ? `${wardSummary.avg_satisfaction.toFixed(1)}/5` : "N/A"}
              icon="⭐"
              color="blue"
              subtext="citizen feedback"
            />
          </motion.div>
        )}

        {/* Two-column grid: Satisfaction Trend + Top Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Satisfaction Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">📈</span> Citizen Satisfaction Trend
                </CardTitle>
                <CardDescription>Last 5 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <SatisfactionChart data={satisfactionTrend} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-xl">🏷️</span> Top Issue Categories
                </CardTitle>
                <CardDescription>By frequency in ward</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topIssues.map((issue, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {issue.category}
                        </span>
                        <span className="text-xs font-bold text-blue-600">
                          {issue.count} ({issue.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${issue.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Department Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
              <CardDescription>Service metrics by department in this ward</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200 hover:bg-gray-50">
                      <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Department
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Total
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Open
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Closed
                      </TableHead>
                      <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Overdue
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100">
                    {deptPerf.map((dept) => (
                      <TableRow
                        key={dept.dept_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-semibold text-gray-900">
                          {DEPT_NAMES[dept.dept_id] || dept.dept_id}
                        </TableCell>
                        <TableCell className="text-center text-gray-700 font-medium">
                          {dept.total}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">{dept.open}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-100 text-green-800">{dept.closed}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {dept.overdue > 0 ? (
                            <Badge className="bg-red-100 text-red-800">{dept.overdue}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Overdue Tickets */}
        {overdueTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <span className="text-xl">⚠️</span> Overdue Complaints
                </CardTitle>
                <CardDescription className="text-red-700">
                  {overdueTickets.length} ticket{overdueTickets.length !== 1 ? "s" : ""} past SLA deadline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {overdueTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-100"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-blue-600">
                            {ticket.ticket_code}
                          </span>
                          <Badge className="text-[10px]">
                            {PRIORITY_ICONS[ticket.priority_label]} {ticket.priority_label}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {ticket.issue_category} • {DEPT_NAMES[ticket.dept_id] || ticket.dept_id}
                        </p>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <Badge className="bg-red-100 text-red-800">
                          {ticket.days_overdue}d overdue
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
