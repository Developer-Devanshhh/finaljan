"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KPICard } from "@/components/kpi-card";
import { TicketTable } from "@/components/ticket-table";
import {
  Ticket,
  OfficerDashboardSummary,
  DeptStat,
  FieldStaff,
  DEPT_NAMES,
  PRIORITY_ICONS,
} from "@/lib/dashboard-types";

// Mock API functions - replace with actual API calls
const mockOfficerApi = {
  getDashboardSummary: async (): Promise<OfficerDashboardSummary> => ({
    total: 247,
    open: 42,
    closed: 189,
    overdue: 8,
    critical: 3,
    avg_satisfaction: 4.2,
    by_department: [
      { dept_id: "PWD", open: 15, closed: 67, overdue: 2, critical: 1 },
      { dept_id: "WTR", open: 12, closed: 45, overdue: 3, critical: 1 },
      { dept_id: "SWM", open: 8, closed: 38, overdue: 2, critical: 0 },
      { dept_id: "ELEC", open: 7, closed: 39, overdue: 1, critical: 1 },
    ],
  }),

  getTickets: async (): Promise<Ticket[]> => [
    {
      id: "6754a1b2c3d4e5f6g7h8i9j0",
      ticket_code: "JV-001234",
      status: "IN_PROGRESS",
      description: "Pothole repair on MG Road near Gandhi statue",
      dept_id: "PWD",
      issue_category: "Road Damage",
      priority_label: "CRITICAL",
      priority_score: 95,
      created_at: "2024-11-20T10:30:00Z",
      sla_deadline: "2024-11-25T10:30:00Z",
      ward_id: 5,
      assigned_officer_id: "officer123",
      estimated_cost: 45000,
    },
    {
      id: "6754a1b2c3d4e5f6g7h8i9j1",
      ticket_code: "JV-001235",
      status: "ASSIGNED",
      description: "Water supply pipeline burst in Anna Nagar",
      dept_id: "WTR",
      issue_category: "Water Pipeline",
      priority_label: "HIGH",
      priority_score: 78,
      created_at: "2024-11-22T14:15:00Z",
      sla_deadline: "2024-11-28T14:15:00Z",
      ward_id: 8,
      estimated_cost: 120000,
    },
    {
      id: "6754a1b2c3d4e5f6g7h8i9j2",
      ticket_code: "JV-001236",
      status: "SCHEDULED",
      description: "Street light repair in T. Nagar area",
      dept_id: "ELEC",
      issue_category: "Lighting",
      priority_label: "MEDIUM",
      priority_score: 52,
      created_at: "2024-11-18T09:00:00Z",
      sla_deadline: "2024-12-02T09:00:00Z",
      ward_id: 12,
      estimated_cost: 8500,
    },
    {
      id: "6754a1b2c3d4e5f6g7h8i9j3",
      ticket_code: "JV-001237",
      status: "OPEN",
      description: "Garbage accumulation near Puratchi Thalaivi Park",
      dept_id: "SWM",
      issue_category: "Solid Waste",
      priority_label: "MEDIUM",
      priority_score: 45,
      created_at: "2024-11-23T11:45:00Z",
      sla_deadline: "2024-11-30T11:45:00Z",
      ward_id: 3,
    },
    {
      id: "6754a1b2c3d4e5f6g7h8i9j4",
      ticket_code: "JV-001238",
      status: "OPEN",
      description: "Tree pruning at Besant Nagar Cres",
      dept_id: "PWD",
      issue_category: "Parks & Greenery",
      priority_label: "LOW",
      priority_score: 28,
      created_at: "2024-11-22T16:20:00Z",
      sla_deadline: "2024-12-07T16:20:00Z",
      ward_id: 6,
    },
  ],

  getFieldStaff: async (): Promise<FieldStaff[]> => [
    { id: "staff1", name: "Raj Kumar", email: "raj@janvedha.com", role: "Technician" },
    { id: "staff2", name: "Priya Singh", email: "priya@janvedha.com", role: "Technician" },
    { id: "staff3", name: "Arjun Nair", email: "arjun@janvedha.com", role: "Inspector" },
  ],
};

interface AssignModalState {
  open: boolean;
  ticket: Ticket | null;
  selectedStaff: string;
}

interface OfficerDashboardProps {
  userOverride?: any;
  forcedRole?: string;
}

export default function OfficerDashboard({ userOverride, forcedRole }: OfficerDashboardProps = {}) {
  const [summary, setSummary] = useState<OfficerDashboardSummary | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [fieldStaff, setFieldStaff] = useState<FieldStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState<AssignModalState>({
    open: false,
    ticket: null,
    selectedStaff: "",
  });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summaryData, ticketsData, staffData] = await Promise.all([
          mockOfficerApi.getDashboardSummary(),
          mockOfficerApi.getTickets(),
          mockOfficerApi.getFieldStaff(),
        ]);
        setSummary(summaryData);
        setTickets(ticketsData);
        setFieldStaff(staffData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleAssign = (ticket: Ticket) => {
    setAssignModal({ open: true, ticket, selectedStaff: "" });
  };

  const handleConfirmAssign = async () => {
    if (!assignModal.ticket || !assignModal.selectedStaff) return;

    // Mock assignment - replace with actual API call
    console.log(`Assigned ticket ${assignModal.ticket.ticket_code} to staff ${assignModal.selectedStaff}`);
    
    // Update local state
    setTickets(
      tickets.map((t) =>
        t.id === assignModal.ticket!.id
          ? { ...t, assigned_officer_id: assignModal.selectedStaff, status: "ASSIGNED" }
          : t
      )
    );

    setAssignModal({ open: false, ticket: null, selectedStaff: "" });
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    console.log(`Updated ticket ${ticketId} status to ${newStatus}`);
    setTickets(
      tickets.map((t) => (t.id === ticketId ? { ...t, status: newStatus as any } : t))
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading officer dashboard…</p>
        </div>
      </div>
    );
  }

  const criticalTickets = tickets.filter((t) => t.priority_label === "CRITICAL");
  const openTickets = tickets.filter((t) => ["OPEN", "ASSIGNED"].includes(t.status));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 text-white px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-indigo-200 text-sm uppercase tracking-wider font-semibold mb-2">
            Field Operations
          </p>
          <h1 className="text-4xl font-bold mb-1 tracking-tight">Officer Dashboard</h1>
          <p className="text-indigo-100 text-sm">
            Manage complaints, assign staff, and track resolution progress in real time
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI Cards */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <KPICard
              label="Total Tickets"
              value={summary.total}
              icon="📋"
              color="blue"
              subtext="All time"
            />
            <KPICard
              label="Open & Assigned"
              value={summary.open}
              icon="🔓"
              color="orange"
              subtext={`${openTickets.length} in queue`}
            />
            <KPICard
              label="Critical Issues"
              value={summary.critical}
              icon="🚨"
              color="red"
              subtext={`Require immediate attention`}
            />
            <KPICard
              label="Avg Satisfaction"
              value={summary.avg_satisfaction ? `${summary.avg_satisfaction.toFixed(1)}/5` : "N/A"}
              icon="⭐"
              color="purple"
              subtext={`${summary.closed} resolved`}
            />
          </motion.div>
        )}

        {/* Department Performance Grid */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {summary.by_department.map((dept) => (
              <Card key={dept.dept_id} className="border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-gray-900">
                    {DEPT_NAMES[dept.dept_id] || dept.dept_id}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Open</span>
                    <Badge variant="secondary">{dept.open}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Closed</span>
                    <Badge className="bg-green-100 text-green-800">{dept.closed}</Badge>
                  </div>
                  {dept.overdue > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">Overdue</span>
                      <Badge className="bg-red-100 text-red-800">{dept.overdue}</Badge>
                    </div>
                  )}
                  {dept.critical > 0 && (
                    <div className="pt-2 border-t border-gray-100">
                      <span className="text-xs font-semibold text-red-600 flex items-center gap-1">
                        🔴 {dept.critical} Critical
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Critical Tickets Alert */}
        {criticalTickets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900 flex items-center gap-2">
                  <span className="text-xl">🚨</span> Critical Issues Requiring Attention
                </CardTitle>
                <CardDescription className="text-red-700">
                  {criticalTickets.length} high-priority ticket{criticalTickets.length !== 1 ? "s" : ""}{" "}
                  need immediate action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TicketTable
                  tickets={criticalTickets}
                  showActions={true}
                  onAssign={handleAssign}
                  onStatusChange={handleStatusChange}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* All Tickets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle>All Complaints</CardTitle>
              <CardDescription>
                {tickets.length} total complaints across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TicketTable
                tickets={tickets}
                showActions={true}
                onAssign={handleAssign}
                onStatusChange={handleStatusChange}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Assign Staff Dialog */}
      <Dialog open={assignModal.open} onOpenChange={(open) => {
        if (!open) {
          setAssignModal({ open: false, ticket: null, selectedStaff: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
            <DialogDescription>
              Assign {assignModal.ticket?.ticket_code} to a field staff member
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {assignModal.ticket && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Ticket</span>
                  <span className="font-mono font-bold text-blue-600">
                    {assignModal.ticket.ticket_code}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Issue</span>
                  <span className="text-sm font-medium text-gray-800">
                    {assignModal.ticket.issue_category || "General"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Priority</span>
                  <Badge className="bg-red-100 text-red-800">
                    {PRIORITY_ICONS[assignModal.ticket.priority_label]} {assignModal.ticket.priority_label}
                  </Badge>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Staff Member</label>
              <Select value={assignModal.selectedStaff} onValueChange={(value) => {
                setAssignModal((prev) => ({ ...prev, selectedStaff: value }));
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a technician or inspector…" />
                </SelectTrigger>
                <SelectContent>
                  {fieldStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>
                      {staff.name} — {staff.role || "Staff"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setAssignModal({ open: false, ticket: null, selectedStaff: "" })}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmAssign}
                disabled={!assignModal.selectedStaff}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Assign Ticket
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
