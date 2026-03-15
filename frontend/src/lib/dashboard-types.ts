/**
 * Dashboard Data Types
 * Aligned with JanVedha backend API response structures
 */

// ─── Ticket Types ──────────────────────────────────────────────
export interface Ticket {
  id: string;
  ticket_code: string;
  status: "OPEN" | "IN_REVIEW" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "ASSIGNED" | "SCHEDULED";
  description: string;
  dept_id: string;
  issue_category?: string;
  priority_label: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  priority_score: number;
  created_at: string;
  updated_at?: string;
  sla_deadline?: string;
  ward_id?: number;
  location_text?: string;
  seasonal_alert?: string;
  assigned_officer_id?: string;
  technician_id?: string;
  scheduled_date?: string;
  ai_suggested_date?: string;
  after_photo_url?: string;
  lat?: number;
  lng?: number;
  estimated_cost?: number;
}

// ─── Officer Dashboard Types ─────────────────────────────────
export interface DeptStat {
  dept_id: string;
  open: number;
  closed: number;
  overdue: number;
  critical: number;
}

export interface OfficerDashboardSummary {
  total: number;
  open: number;
  closed: number;
  overdue: number;
  critical: number;
  avg_satisfaction: number | null;
  by_department: DeptStat[];
}

export interface FieldStaff {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

// ─── Councillor Dashboard Types ──────────────────────────────
export interface WardSummary {
  ward_id: number;
  total: number;
  open: number;
  closed: number;
  overdue: number;
  resolution_rate: number;
  avg_resolution_days: number;
  avg_satisfaction: number | null;
}

export interface DeptPerf {
  dept_id: string;
  total: number;
  open: number;
  closed: number;
  overdue: number;
}

export interface CouncillorWeekData {
  week_label: string;
  avg_satisfaction: number | null;
  ticket_count: number;
}

export interface TopIssue {
  category: string;
  count: number;
  percentage: number;
}

export interface OverdueTicket {
  id: string;
  ticket_code: string;
  dept_id: string;
  issue_category: string;
  priority_label: string;
  days_overdue: number;
  status: string;
}

// ─── Commissioner Dashboard Types ─────────────────────────────
export interface CitySummary {
  total_tickets: number;
  closed: number;
  resolution_rate: number;
  overdue: number;
  avg_satisfaction: number | null;
  avg_resolution_days: number;
  total_spent_budget: number;
  total_estimated_budget: number;
}

export interface WardPerf {
  ward_id: number;
  open: number;
  closed: number;
  overdue: number;
  total: number;
  budget_spent: number;
}

export interface CommissionerWeekData {
  week_label: string;
  budget_spent: number;
}

export interface CriticalTicket {
  id: string;
  ticket_code: string;
  dept_id: string;
  issue_category: string;
  priority_label: string;
  priority_score: number;
  ward_id: number;
  days_overdue: number;
  estimated_cost?: number;
}

// ─── Department Mapping ────────────────────────────────────────
export const DEPT_NAMES: Record<string, string> = {
  PWD: "Public Works Department",
  HLTH: "Health & Sanitation",
  SWM: "Solid Waste Management",
  WTR: "Water Supply",
  ELEC: "Street Lighting",
  PARK: "Parks & Greenery",
  FIRE: "Fire & Emergency",
  TRF: "Traffic & Transport",
  BLD: "Buildings & Planning",
  REV: "Revenue & Property",
  SOC: "Social Welfare",
  EDU: "Education",
  DM: "Disaster Management",
  SEWER: "Sewage & Drainage",
};

// ─── Priority Badge Map ─────────────────────────────────────────
export const PRIORITY_BADGE: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800 border border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  LOW: "bg-green-100 text-green-800 border border-green-200",
};

// ─── Status Badge Map ───────────────────────────────────────────
export const STATUS_BADGE: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-800",
  IN_REVIEW: "bg-indigo-100 text-indigo-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  ASSIGNED: "bg-cyan-100 text-cyan-800",
  SCHEDULED: "bg-violet-100 text-violet-800",
  RESOLVED: "bg-emerald-100 text-emerald-800",
  CLOSED: "bg-slate-100 text-slate-800",
};

// ─── Priority Icons ────────────────────────────────────────────
export const PRIORITY_ICONS: Record<string, string> = {
  CRITICAL: "🔴",
  HIGH: "🟠",
  MEDIUM: "🟡",
  LOW: "🟢",
};
