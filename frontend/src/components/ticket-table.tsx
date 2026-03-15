"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Ticket, DEPT_NAMES, PRIORITY_BADGE, STATUS_BADGE } from "@/lib/dashboard-types";

interface TicketTableProps {
  tickets: Ticket[];
  showActions?: boolean;
  onAssign?: (ticket: Ticket) => void;
  onStatusChange?: (ticketId: string, newStatus: string) => void;
  maxRows?: number;
}

const getSLAStatus = (deadline?: string) => {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / 86400000);
  
  if (days < 0) {
    return { label: `${Math.abs(days)}d overdue`, color: "text-red-600 font-bold" };
  }
  if (days <= 1) return { label: "Due today!", color: "text-red-500 font-bold" };
  if (days <= 3) return { label: `${days}d left`, color: "text-orange-500 font-semibold" };
  return { label: `${days}d left`, color: "text-gray-400" };
};

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  showActions = false,
  onAssign,
  onStatusChange,
  maxRows,
}) => {
  const displayTickets = maxRows ? tickets.slice(0, maxRows) : tickets;

  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-b border-gray-200 hover:bg-gray-50">
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Ticket ID
            </TableHead>
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Category
            </TableHead>
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Priority
            </TableHead>
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Ward
            </TableHead>
            <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              SLA
            </TableHead>
            {showActions && (
              <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider text-right">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-gray-100">
          {displayTickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={showActions ? 7 : 6} className="py-8 text-center">
                <p className="text-gray-400 text-sm italic">No tickets found</p>
              </TableCell>
            </TableRow>
          ) : (
            displayTickets.map((ticket, i) => {
              const slaStatus = getSLAStatus(ticket.sla_deadline);
              return (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono font-bold text-blue-600 text-sm">
                    {ticket.ticket_code}
                  </TableCell>
                  <TableCell className="font-medium text-gray-800 text-sm">
                    {ticket.issue_category || "General Issue"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs font-semibold ${
                        PRIORITY_BADGE[ticket.priority_label] || PRIORITY_BADGE.LOW
                      }`}
                    >
                      {ticket.priority_label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`text-xs font-semibold ${
                        STATUS_BADGE[ticket.status] || STATUS_BADGE.OPEN
                      }`}
                    >
                      {ticket.status.replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    {ticket.ward_id ? `Ward ${ticket.ward_id}` : "—"}
                  </TableCell>
                  <TableCell className={`text-sm ${slaStatus?.color || "text-gray-400"}`}>
                    {slaStatus?.label || "—"}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ⋯
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onAssign && (
                            <DropdownMenuItem onClick={() => onAssign(ticket)}>
                              Assign to Staff
                            </DropdownMenuItem>
                          )}
                          {onStatusChange && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onStatusChange(ticket.id, "IN_PROGRESS")}
                              >
                                Mark In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onStatusChange(ticket.id, "RESOLVED")}
                              >
                                Mark Resolved
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onStatusChange(ticket.id, "CLOSED")}
                              >
                                Close Ticket
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </motion.tr>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
