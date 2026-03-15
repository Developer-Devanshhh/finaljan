/**
 * Dashboard API Integration Examples
 * 
 * Replace the mock APIs in the dashboard pages with these real API calls.
 * Adapt the endpoint URLs and methods to match your backend.
 */

import {
  OfficerDashboardSummary,
  Ticket,
  FieldStaff,
  WardSummary,
  DeptPerf,
  CouncillorWeekData,
  TopIssue,
  OverdueTicket,
  CitySummary,
  WardPerf,
  CommissionerWeekData,
  CriticalTicket,
} from "./dashboard-types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ─── Helper: Make authenticated API calls ────────────────────────────────

interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

async function apiCall<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" = "GET",
  body?: any,
  token?: string
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, success: true };
  } catch (error) {
    console.error(`API call failed: ${endpoint}`, error);
    return {
      data: {} as T,
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ─── Officer Dashboard API ──────────────────────────────────────────────

export const officerDashboardApi = {
  /**
   * GET /officer/dashboard/summary
   * Returns: OfficerDashboardSummary
   */
  getDashboardSummary: async (token: string): Promise<OfficerDashboardSummary> => {
    const response = await apiCall<OfficerDashboardSummary>(
      "/officer/dashboard/summary",
      "GET",
      undefined,
      token
    );
    return response.data;
  },

  /**
   * GET /officer/tickets
   * Query params:
   *   - status: OPEN|IN_PROGRESS|RESOLVED|CLOSED
   *   - priority: CRITICAL|HIGH|MEDIUM|LOW
   *   - limit: number
   *   - offset: number
   */
  getTickets: async (
    token: string,
    params?: {
      status?: string;
      priority?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Ticket[]> => {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const endpoint = params ? `/officer/tickets?${queryString}` : "/officer/tickets";
    
    const response = await apiCall<Ticket[]>(endpoint, "GET", undefined, token);
    return response.data || [];
  },

  /**
   * GET /officer/field-staff
   * Returns: List of available technicians/inspectors
   */
  getFieldStaff: async (token: string): Promise<FieldStaff[]> => {
    const response = await apiCall<FieldStaff[]>(
      "/officer/field-staff",
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * POST /officer/tickets/{ticketId}/assign
   * Body: { assigned_officer_id: string }
   * Returns: Updated Ticket
   */
  assignTicket: async (
    ticketId: string,
    staffId: string,
    token: string
  ): Promise<Ticket> => {
    const response = await apiCall<Ticket>(
      `/officer/tickets/${ticketId}/assign`,
      "POST",
      { assigned_officer_id: staffId },
      token
    );
    return response.data;
  },

  /**
   * PUT /officer/tickets/{ticketId}/status
   * Body: { status: string }
   * Returns: Updated Ticket
   */
  updateTicketStatus: async (
    ticketId: string,
    status: string,
    token: string
  ): Promise<Ticket> => {
    const response = await apiCall<Ticket>(
      `/officer/tickets/${ticketId}/status`,
      "PUT",
      { status },
      token
    );
    return response.data;
  },

  /**
   * POST /officer/tickets/{ticketId}/schedule
   * Body: { scheduled_date: ISO string, time_slot?: string }
   * Returns: Updated Ticket
   */
  scheduleTicket: async (
    ticketId: string,
    scheduledDate: string,
    timeSlot?: string,
    token?: string
  ): Promise<Ticket> => {
    const response = await apiCall<Ticket>(
      `/officer/tickets/${ticketId}/schedule`,
      "POST",
      { scheduled_date: scheduledDate, time_slot: timeSlot },
      token
    );
    return response.data;
  },
};

// ─── Councillor Dashboard API ───────────────────────────────────────────

export const councillorDashboardApi = {
  /**
   * GET /councillor/ward/{wardId}/summary
   * Returns: WardSummary with metrics for specific ward
   */
  getWardSummary: async (wardId: number, token: string): Promise<WardSummary> => {
    const response = await apiCall<WardSummary>(
      `/councillor/ward/${wardId}/summary`,
      "GET",
      undefined,
      token
    );
    return response.data;
  },

  /**
   * GET /councillor/ward/{wardId}/department-performance
   * Returns: Array of DeptPerf with metrics per department
   */
  getDepartmentPerformance: async (
    wardId: number,
    token: string
  ): Promise<DeptPerf[]> => {
    const response = await apiCall<DeptPerf[]>(
      `/councillor/ward/${wardId}/department-performance`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * GET /councillor/ward/{wardId}/satisfaction-trend
   * Query params:
   *   - weeks: number (default 5)
   * Returns: Array of weekly satisfaction data
   */
  getSatisfactionTrend: async (
    wardId: number,
    weeks?: number,
    token?: string
  ): Promise<CouncillorWeekData[]> => {
    const query = weeks ? `?weeks=${weeks}` : "";
    const response = await apiCall<CouncillorWeekData[]>(
      `/councillor/ward/${wardId}/satisfaction-trend${query}`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * GET /councillor/ward/{wardId}/top-issues
   * Returns: Top issue categories by frequency
   */
  getTopIssues: async (wardId: number, token: string): Promise<TopIssue[]> => {
    const response = await apiCall<TopIssue[]>(
      `/councillor/ward/${wardId}/top-issues`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * GET /councillor/ward/{wardId}/overdue-tickets
   * Returns: Tickets past SLA deadline
   */
  getOverdueTickets: async (
    wardId: number,
    token: string
  ): Promise<OverdueTicket[]> => {
    const response = await apiCall<OverdueTicket[]>(
      `/councillor/ward/${wardId}/overdue-tickets`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },
};

// ─── Commissioner Dashboard API ─────────────────────────────────────────

export const commissionerDashboardApi = {
  /**
   * GET /commissioner/city/summary
   * Returns: CitySummary with city-wide metrics
   */
  getCitySummary: async (token: string): Promise<CitySummary> => {
    const response = await apiCall<CitySummary>(
      "/commissioner/city/summary",
      "GET",
      undefined,
      token
    );
    return response.data;
  },

  /**
   * GET /commissioner/city/ward-performance
   * Query params:
   *   - sort_by: open|closed|overdue|budget (default: overdue)
   *   - limit: number (default: 50)
   * Returns: Array of WardPerf sorted by overdue
   */
  getWardPerformance: async (
    token: string,
    params?: {
      sort_by?: "open" | "closed" | "overdue" | "budget";
      limit?: number;
    }
  ): Promise<WardPerf[]> => {
    const queryString = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const response = await apiCall<WardPerf[]>(
      `/commissioner/city/ward-performance${queryString}`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * GET /commissioner/city/budget-burn-rate
   * Query params:
   *   - weeks: number (default: 10)
   * Returns: Weekly budget spend data
   */
  getBudgetBurnRate: async (
    weeks: number = 10,
    token?: string
  ): Promise<CommissionerWeekData[]> => {
    const response = await apiCall<CommissionerWeekData[]>(
      `/commissioner/city/budget-burn-rate?weeks=${weeks}`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * GET /commissioner/city/critical-tickets
   * Query params:
   *   - limit: number (default: 20)
   * Returns: Critical priority tickets requiring attention
   */
  getCriticalTickets: async (
    limit: number = 20,
    token?: string
  ): Promise<CriticalTicket[]> => {
    const response = await apiCall<CriticalTicket[]>(
      `/commissioner/city/critical-tickets?limit=${limit}`,
      "GET",
      undefined,
      token
    );
    return response.data || [];
  },

  /**
   * POST /commissioner/city/alerts
   * Body: { alert_type: string, ticket_id?: string, message: string }
   * Returns: Created alert
   */
  createAlert: async (
    alert: {
      alert_type: string;
      ticket_id?: string;
      message: string;
    },
    token?: string
  ): Promise<any> => {
    const response = await apiCall<any>(
      "/commissioner/city/alerts",
      "POST",
      alert,
      token
    );
    return response.data;
  },
};

// ─── Usage Example ──────────────────────────────────────────────────────

/**
 * EXAMPLE: Replace mock API in Officer Dashboard
 * 
 * Before (using mock data):
 * const [summary, setSummary] = useState<OfficerDashboardSummary | null>(null);
 * 
 * useEffect(() => {
 *   const loadDashboard = async () => {
 *     const summary = await mockOfficerApi.getDashboardSummary();
 *     setSummary(summary);
 *   };
 *   loadDashboard();
 * }, []);
 * 
 * ─────────────────────────────────────────────────────────────────────────
 * 
 * After (using real API):
 * const { user, token } = useAuth();
 * 
 * useEffect(() => {
 *   if (!token) return;
 *   
 *   const loadDashboard = async () => {
 *     try {
 *       const summary = await officerDashboardApi.getDashboardSummary(token);
 *       setSummary(summary);
 *     } catch (error) {
 *       console.error("Failed to load dashboard:", error);
 *       toast.error("Failed to load dashboard data");
 *     }
 *   };
 *   
 *   loadDashboard();
 * }, [token]);
 */

// ─── Error Handling Pattern ─────────────────────────────────────────────

/**
 * For better error handling, wrap API calls in try-catch:
 * 
 * try {
 *   const data = await officerDashboardApi.getDashboardSummary(token);
 *   if (!data) {
 *     throw new Error("No data returned from API");
 *   }
 *   setSummary(data);
 * } catch (error) {
 *   const message = error instanceof Error ? error.message : "Unknown error";
 *   toast.error(`Failed to load dashboard: ${message}`);
 *   // Optionally retry or set fallback data
 * }
 */
