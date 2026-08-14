"use client";

import Link from "next/link";
import { 
  Car, 
  AlertCircle, 
  Clock, 
  ShieldAlert, 
  Plus, 
  FileUp, 
  FileBarChart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const kpiData = [
  { title: "Total Vehicles", value: "1,248", subtitle: "Registered vehicles", icon: Car },
  { title: "Active Vehicles", value: "1,156", subtitle: "Currently active", icon: CheckCircle2 },
  { title: "Expiring Soon", value: "48", subtitle: "Compliance within 30 days", icon: Clock },
  { title: "Expired", value: "44", subtitle: "Requires attention", icon: AlertCircle },
  { title: "Insurance Due", value: "18", subtitle: "Policies requiring renewal", icon: ShieldAlert },
];

const vehicleOverviewData = [
  { name: "Active", value: 1156, color: "#111111" },
  { name: "Inactive", value: 38, color: "#A0A0A0" },
  { name: "Expired", value: 44, color: "#E5E5E5" },
  { name: "Under Maintenance", value: 10, color: "#666666" },
];

const complianceData = [
  { name: "Tax", total: 1248, valid: 1200, expiring: 36, expired: 12 },
  { name: "Fitness", total: 1248, valid: 1220, expiring: 19, expired: 9 },
  { name: "Permit", total: 1248, valid: 1180, expiring: 61, expired: 7 },
  { name: "Insurance", total: 1248, valid: 1195, expiring: 35, expired: 18 },
];

const recentActivity = [
  { vehicle: "GJ01AB1234", owner: "Rajesh Kumar", type: "Heavy Commercial", activity: "Insurance Updated", by: "Jenil Admin", date: "Today, 10:42 AM", status: "Updated" },
  { vehicle: "GJ05CD4567", owner: "Suresh Transport Co.", type: "Light Commercial", activity: "Vehicle Added", by: "System System", date: "Today, 09:15 AM", status: "Active" },
  { vehicle: "GJ18EF7890", owner: "Amit Patel", type: "Passenger", activity: "Tax Updated", by: "Jenil Admin", date: "Yesterday, 16:30 PM", status: "Updated" },
  { vehicle: "GJ27GH2345", owner: "Bhavik Shah", type: "Heavy Commercial", activity: "Document Uploaded", by: "Neha Desai", date: "Yesterday, 14:10 PM", status: "Pending" },
  { vehicle: "GJ01JK6789", owner: "Jayesh Logistics", type: "Trailer", activity: "Fitness Expired", by: "System", date: "Aug 10, 00:01 AM", status: "Expired" },
];

const upcomingExpiries = [
  { vehicle: "GJ01MN4567", owner: "Rajesh Kumar", type: "Insurance", date: "Aug 15, 2026", days: 3, urgent: true },
  { vehicle: "GJ05PQ8901", owner: "Suresh Transport Co.", type: "Tax", date: "Aug 18, 2026", days: 6, urgent: true },
  { vehicle: "GJ18RS2345", owner: "Amit Patel", type: "Fitness", date: "Aug 24, 2026", days: 12, urgent: false },
  { vehicle: "GJ27TU6789", owner: "Bhavik Shah", type: "Permit", date: "Aug 28, 2026", days: 16, urgent: false },
];

export default function Dashboard() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Row with Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Overview</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/documents/upload" className="inline-flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:bg-[#F7F7F7] hover:border-[#A0A0A0]">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Document
          </Link>
          <Link href="/reports" className="inline-flex items-center justify-center rounded-lg border border-[#E5E5E5] bg-white px-4 py-2 text-[13px] font-medium text-[#111111] transition-colors hover:bg-[#F7F7F7] hover:border-[#A0A0A0]">
            <FileBarChart className="mr-2 h-4 w-4" />
            View Reports
          </Link>
          <Link href="/vehicles/new" className="inline-flex items-center justify-center rounded-lg bg-[#111111] px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#333333]">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiData.map((kpi, i) => (
          <div key={i} className="group relative overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white p-5 transition-all hover:border-[#A0A0A0]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] font-semibold text-[#111111]">{kpi.title}</p>
              <kpi.icon className="h-5 w-5 text-[#A0A0A0] transition-colors group-hover:text-[#111111]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[32px] font-bold text-[#111111] leading-none tracking-tight">{kpi.value}</span>
              <span className="mt-2 text-[12px] text-[#666666]">{kpi.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Vehicle Overview (Chart) */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-6">
          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-[#111111]">Vehicle Overview</h3>
            <p className="text-[13px] text-[#666666] mt-1">Fleet distribution by current status</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 h-[240px]">
            <div className="h-[200px] w-[200px] flex-shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vehicleOverviewData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {vehicleOverviewData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #E5E5E5', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', fontSize: '13px' }}
                    itemStyle={{ color: '#111111', fontWeight: 500 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[24px] font-bold text-[#111111]">1.2k</span>
                <span className="text-[11px] text-[#666666]">Total</span>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-4">
              {vehicleOverviewData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-[#111111]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-[#666666] font-medium w-12 text-right">{item.value}</span>
                    <span className="text-[#A0A0A0] w-12 text-right">{((item.value / 1248) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Compliance Overview */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white p-6">
          <div className="mb-6">
            <h3 className="text-[16px] font-semibold text-[#111111]">Compliance Overview</h3>
            <p className="text-[13px] text-[#666666] mt-1">Status of key vehicle documents</p>
          </div>
          
          <div className="space-y-5">
            {/* Header row */}
            <div className="grid grid-cols-5 text-[11px] font-medium text-[#A0A0A0] uppercase tracking-wider pb-2 border-b border-[#F7F7F7]">
              <div className="col-span-2">Type</div>
              <div className="text-right">Valid</div>
              <div className="text-right">Expiring</div>
              <div className="text-right">Expired</div>
            </div>
            
            {/* Data rows */}
            {complianceData.map((item, i) => (
              <div key={i} className="grid grid-cols-5 items-center group">
                <div className="col-span-2 flex items-center gap-3">
                  <span className="text-[14px] font-semibold text-[#111111]">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-end gap-1.5 w-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#111111]" />
                    <span className="text-[13px] font-medium text-[#111111]">{item.valid}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-end gap-1.5 w-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#666666]" />
                    <span className="text-[13px] font-medium text-[#666666]">{item.expiring}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-end gap-1.5 w-full">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#E5E5E5]" />
                    <span className="text-[13px] font-medium text-[#A0A0A0]">{item.expired}</span>
                  </div>
                </div>
                
                {/* Visual bar below row */}
                <div className="col-span-5 flex h-1.5 w-full overflow-hidden rounded-full bg-[#F7F7F7] mt-3">
                  <div style={{ width: `${(item.valid / item.total) * 100}%` }} className="bg-[#111111]" />
                  <div style={{ width: `${(item.expiring / item.total) * 100}%` }} className="bg-[#666666]" />
                  <div style={{ width: `${(item.expired / item.total) * 100}%` }} className="bg-[#E5E5E5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Vehicle Activity (Span 2) */}
        <div className="lg:col-span-2 rounded-[16px] border border-[#E5E5E5] bg-white flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#F7F7F7]">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111111]">Recent Vehicle Activity</h3>
              <p className="text-[13px] text-[#666666] mt-1">Latest updates across the fleet</p>
            </div>
            <Link href="/activity" className="text-[13px] font-medium text-[#111111] hover:text-[#666666] flex items-center transition-colors">
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F7F7F7]/50 text-[11px] font-medium uppercase tracking-wider text-[#A0A0A0]">
                <tr>
                  <th className="px-6 py-3 font-medium">Vehicle</th>
                  <th className="px-6 py-3 font-medium">Activity</th>
                  <th className="px-6 py-3 font-medium">Date & Time</th>
                  <th className="px-6 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7F7F7]">
                {recentActivity.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F7F7F7]/50 transition-colors group">
                    <td className="px-6 py-3.5">
                      <div className="font-semibold text-[#111111]">{row.vehicle}</div>
                      <div className="text-[#666666] text-[11px] mt-0.5">{row.owner}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-medium text-[#111111]">{row.activity}</div>
                      <div className="text-[#A0A0A0] text-[11px] mt-0.5">By {row.by}</div>
                    </td>
                    <td className="px-6 py-3.5 text-[#666666]">{row.date}</td>
                    <td className="px-6 py-3.5 text-right">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium
                        ${row.status === 'Active' ? 'bg-[#111111] text-white' : 
                          row.status === 'Updated' ? 'border border-[#111111] text-[#111111]' : 
                          row.status === 'Pending' ? 'bg-[#F7F7F7] text-[#666666] border border-[#E5E5E5]' : 
                          'bg-[#E5E5E5] text-[#111111]'}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Expiries (Span 1) */}
        <div className="rounded-[16px] border border-[#E5E5E5] bg-white flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-[#F7F7F7]">
            <div>
              <h3 className="text-[16px] font-semibold text-[#111111]">Upcoming Expiries</h3>
              <p className="text-[13px] text-[#666666] mt-1">Requires attention</p>
            </div>
            <Link href="/reports/expiries" className="p-1 text-[#A0A0A0] hover:text-[#111111] transition-colors rounded-md hover:bg-[#F7F7F7]">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="flex-1 p-2">
            {upcomingExpiries.map((item, i) => (
              <div key={i} className="flex items-start justify-between p-4 hover:bg-[#F7F7F7]/50 rounded-xl transition-colors group border-b border-transparent">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[13px] text-[#111111]">{item.vehicle}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded border border-[#E5E5E5] text-[#666666] bg-white font-medium">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#A0A0A0] mt-1">
                    Expires on <span className="font-medium text-[#666666]">{item.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[12px] font-bold ${item.urgent ? 'text-[#111111]' : 'text-[#666666]'}`}>
                    {item.days} days
                  </span>
                  <button className="text-[11px] font-semibold text-[#111111] border-b border-[#111111] leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                    Action
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[#F7F7F7] mt-auto">
            <button className="w-full rounded-lg border border-[#E5E5E5] bg-white py-2 text-[13px] font-medium text-[#111111] hover:bg-[#F7F7F7] transition-colors">
              View All Expiries
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
