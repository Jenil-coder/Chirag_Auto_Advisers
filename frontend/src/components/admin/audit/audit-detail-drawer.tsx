"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api-admin";
import { X, User, Clock, FileText, Monitor, CheckCircle, XCircle } from "lucide-react";

interface AuditDetailDrawerProps {
  auditId: number;
  onClose: () => void;
}

export function AuditDetailDrawer({ auditId, onClose }: AuditDetailDrawerProps) {
  const { data: log, isLoading } = useQuery({
    queryKey: ["admin-audit", auditId],
    queryFn: () => adminApi.getAuditLog(auditId),
  });

  const formatJson = (data: any) => {
    try {
      const obj = typeof data === 'string' ? JSON.parse(data) : data;
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-sm transition-all">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] bg-gray-50">
          <div>
            <h2 className="text-xl font-serif font-medium text-[#111111]">Audit Log Details</h2>
            <p className="text-sm text-gray-500">ID: #{auditId}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 flex items-center justify-center text-gray-500">Loading details...</div>
          ) : log ? (
            <div className="p-6 space-y-8">
              
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center text-gray-500 mb-1">
                    <User className="h-4 w-4 mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider">User</span>
                  </div>
                  <div className="font-medium text-[#111111]">{log.user?.name || 'System Action'}</div>
                  {log.user?.email && <div className="text-sm text-gray-500">{log.user.email}</div>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Timestamp</span>
                  </div>
                  <div className="font-medium text-[#111111]">{new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                  <div className="text-sm text-gray-500">{new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center text-gray-500 mb-1">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Action & Module</span>
                  </div>
                  <div className="font-medium text-[#111111]">{log.action}</div>
                  <div className="text-sm text-gray-500">{log.module}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Monitor className="h-4 w-4 mr-2" />
                    <span className="text-xs font-semibold uppercase tracking-wider">System Info</span>
                  </div>
                  <div className="font-medium text-[#111111]">{log.ip_address || 'Unknown IP'}</div>
                  <div className="text-xs text-gray-500 truncate mt-1" title={log.user_agent}>{log.user_agent || 'Unknown Agent'}</div>
                </div>
              </div>

              {/* Status and Entity */}
              <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                <div className="px-5 py-3 border-b border-[#E5E7EB] bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#111111]">Event Details</h3>
                  {log.status === 'Success' ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Success
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="h-3 w-3 mr-1" /> Failed
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Entity / Record</span>
                    <span className="text-[15px] font-medium text-[#111111]">{log.entity_name || `Record #${log.record_id || 'N/A'}`}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</span>
                    <span className="text-[15px] text-[#333333]">{log.description || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Data Diffs */}
              {(log.old_values || log.new_values) && (
                <div className="space-y-4">
                  <h3 className="text-lg font-serif font-medium text-[#111111]">Data Changes</h3>
                  
                  {log.old_values && (
                    <div className="border border-red-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-red-50 border-b border-red-200">
                        <h4 className="text-sm font-semibold text-red-800">Before Change (Old Values)</h4>
                      </div>
                      <div className="p-4 bg-gray-50 max-h-64 overflow-auto text-sm">
                        <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap">{formatJson(log.old_values)}</pre>
                      </div>
                    </div>
                  )}

                  {log.new_values && (
                    <div className="border border-green-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-green-50 border-b border-green-200">
                        <h4 className="text-sm font-semibold text-green-800">After Change (New Values)</h4>
                      </div>
                      <div className="p-4 bg-gray-50 max-h-64 overflow-auto text-sm">
                        <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap">{formatJson(log.new_values)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-red-500">Failed to load audit log details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
