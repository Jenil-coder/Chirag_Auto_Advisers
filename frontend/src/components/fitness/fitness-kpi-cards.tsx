import { Vehicle } from "@/types/vehicle";
import { Car, CheckCircle2, AlertTriangle, XCircle, HelpCircle } from "lucide-react";

interface FitnessKpiCardsProps {
  vehicles: Vehicle[];
}

export function FitnessKpiCards({ vehicles }: FitnessKpiCardsProps) {
  const stats = vehicles.reduce((acc, vehicle) => {
    // Total Vehicles
    acc.total++;

    // Status metrics
    if (vehicle.fitness_status === 'ACTIVE') acc.active++;
    else if (vehicle.fitness_status === 'EXPIRING_SOON') acc.expiringSoon++;
    else if (vehicle.fitness_status === 'EXPIRED') acc.expired++;
    else if (vehicle.fitness_status === 'NOT_AVAILABLE' || !vehicle.fitness_status) acc.notAvailable++;

    return acc;
  }, { total: 0, active: 0, expiringSoon: 0, expired: 0, notAvailable: 0 });

  const cards = [
    {
      title: "Total Vehicles",
      value: stats.total,
      icon: Car,
      subtitle: "Total registered in system"
    },
    {
      title: "Fit / Active",
      value: stats.active,
      icon: CheckCircle2,
      subtitle: "Fitness up to date"
    },
    {
      title: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      subtitle: "Expires in < 30 days"
    },
    {
      title: "Expired",
      value: stats.expired,
      icon: XCircle,
      subtitle: "Validity period ended"
    },
    {
      title: "Not Available",
      value: stats.notAvailable,
      icon: HelpCircle,
      subtitle: "Missing fitness info"
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
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
