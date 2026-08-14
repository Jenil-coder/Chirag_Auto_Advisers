"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api-admin";
import { Search, ShieldAlert, Eye, Filter, Download } from "lucide-react";
import { AuditDetailDrawer } from "@/components/admin/audit/audit-detail-drawer";

export function AuditGrid() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-audit", page, searchTerm],
    queryFn: () => adminApi.getAuditLogs({ page: page.toString(), search: searchTerm }),
  });

  return (
    <div className="flex flex-col bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search audit logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
            />
          </div>
          <button className="p-2 text-gray-500 border border-[#E5E7EB] rounded-lg hover:bg-gray-50 transition-colors" title="Filter">
            <Filter className="h-4 w-4" />
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-[#E5E7EB] text-[#111111] text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 border-b border-[#E5E7EB] z-10">
            <tr>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">Action & Module</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">Record / Description</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-4 text-[14px] font-semibold text-[#111111] uppercase tracking-wider text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] bg-white">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-32"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-40"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-48"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))
            ) : data?.data.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <ShieldAlert className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-900">No activity logs found</p>
                  <p className="text-sm">Try adjusting your search criteria</p>
                </td>
              </tr>
            ) : (
              data?.data.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[15px] font-medium text-[#111111]">
                      {new Date(log.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="text-[13px] text-[#555555]">
                      {new Date(log.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-[15px] font-medium text-[#111111]">{log.user?.name || 'System Action'}</div>
                    {log.user?.email && <div className="text-[13px] text-[#555555]">{log.user.email}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-[11px] font-bold uppercase rounded-full ${
                        log.action.includes('CREATE') ? 'bg-green-100 text-green-800' :
                        log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-800' :
                        log.action.includes('DELETE') ? 'bg-red-100 text-red-800' :
                        log.action.includes('LOGIN_FAILED') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.action}
                      </span>
                    </div>
                    <div className="text-[14px] text-[#555555] font-medium">{log.module}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[15px] font-medium text-[#111111]">{log.entity_name || `Record #${log.record_id || '-'}`}</div>
                    <div className="text-[14px] text-[#555555] truncate max-w-[300px]">{log.description || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[14px] text-[#555555] font-mono">
                    {log.ip_address || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => setSelectedAuditId(log.id)}
                      className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors inline-flex"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.last_page > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB] bg-gray-50">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(data.current_page - 1) * data.per_page + 1}</span> to <span className="font-medium">{Math.min(data.current_page * data.per_page, data.total)}</span> of <span className="font-medium">{data.total}</span> logs
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page === data.last_page}
              className="px-3 py-1 border border-[#E5E7EB] rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedAuditId && (
        <AuditDetailDrawer 
          auditId={selectedAuditId} 
          onClose={() => setSelectedAuditId(null)} 
        />
      )}
    </div>
  );
}
