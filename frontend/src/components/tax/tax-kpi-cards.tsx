import { Vehicle } from "@/types/vehicle";
import { Car, CheckCircle2, AlertTriangle, XCircle, CreditCard, Receipt } from "lucide-react";

interface TaxKpiCardsProps {
  vehicles: Vehicle[];
}

export function TaxKpiCards({ vehicles }: TaxKpiCardsProps) {
  const stats = vehicles.reduce((acc, vehicle) => {
    // Total Vehicles
    acc.total++;

    // Status metrics
    if (vehicle.tax_status === 'ACTIVE') acc.active++;
    else if (vehicle.tax_status === 'EXPIRING_SOON') acc.expiringSoon++;
    else if (vehicle.tax_status === 'EXPIRED') acc.expired++;
    else if (vehicle.tax_status === 'DUE') acc.due++;

    // Total Amount
    if (vehicle.tax) {
      const amount = parseFloat(vehicle.tax.amount?.toString() || "0");
      const penalty = parseFloat(vehicle.tax.penalty?.toString() || "0");
      const interest = parseFloat(vehicle.tax.interest?.toString() || "0");
      acc.totalAmount += (amount + penalty + interest);
    }

    return acc;
  }, { total: 0, active: 0, expiringSoon: 0, expired: 0, due: 0, totalAmount: 0 });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const cards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: Car,
      subtitle: "Total registered in system"
    },
    {
      title: "Active / Paid",
      value: stats.active,
      icon: CheckCircle2,
      subtitle: "Tax up to date"
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      subtitle: "Expires in < 30 days"
    },
    {
      title: "Tax Due",
      value: stats.due,
      icon: Receipt,
      subtitle: "Payment missing"
    },
    {
      title: "Expired",
      value: stats.expired,
      icon: XCircle,
      subtitle: "Validity period ended"
    },
    {
      title: "Total Tax Amount",
      value: formatCurrency(stats.totalAmount),
      icon: CreditCard,
      subtitle: "Combined tax values"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="group relative overflow-hidden rounded-[14px] border border-[#E5E5E5] bg-white p-5 transition-all hover:border-[#A0A0A0]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-semibold text-[#111111]">{card.title}</p>
            <card.icon className="h-5 w-5 text-[#A0A0A0] transition-colors group-hover:text-[#111111]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[32px] font-bold text-[#111111] leading-none tracking-tight">{card.value}</span>
            <span className="mt-2 text-[12px] text-[#666666] truncate">{card.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
