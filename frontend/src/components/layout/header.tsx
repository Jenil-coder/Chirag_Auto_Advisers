"use client";

import { Bell, Menu, Search, User, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (e) {
      // Ignored, we logout locally anyway
    }
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  // Determine page title based on route
  const getPageTitle = () => {
    if (pathname === "/") return { title: "Dashboard", subtitle: "Fleet overview and compliance status" };
    if (pathname.startsWith("/vehicles")) return { title: "Motor Entry", subtitle: "Manage your vehicle fleet" };
    if (pathname.startsWith("/insurance")) return { title: "Insurance", subtitle: "Manage vehicle insurance policies" };
    if (pathname.startsWith("/documents")) return { title: "Documents", subtitle: "Manage vehicle documents" };
    if (pathname.startsWith("/reports")) return { title: "Reports", subtitle: "View system reports and analytics" };
    if (pathname.startsWith("/activity")) return { title: "Activity Log", subtitle: "Track system activities" };
    if (pathname.startsWith("/settings")) return { title: "Settings", subtitle: "System configuration and preferences" };
    return { title: "Chirag Auto Adviser", subtitle: "Vehicle Management System" };
  };

  const pageInfo = getPageTitle();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] w-full items-center justify-between border-b border-[#E5E5E5] bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#666666] hover:bg-[#F7F7F7] hover:text-[#111111] md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-[20px] font-semibold text-[#111111] leading-tight">
            {pageInfo.title}
          </h2>
          <p className="text-[13px] text-[#666666] mt-0.5">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <div className="hidden lg:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
          <input
            type="search"
            placeholder="Search vehicle, owner or registration number"
            className="flex h-9 w-[320px] rounded-md border border-[#E5E5E5] bg-[#F7F7F7] px-9 py-1 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] placeholder:text-[#A0A0A0]"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[#666666] hover:bg-[#F7F7F7] hover:text-[#111111] transition-colors"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2 h-1.5 w-1.5 rounded-full bg-[#111111]"></span>
          </button>
          
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F7F7F7] border border-[#E5E5E5] text-[#111111] hover:bg-[#E5E5E5] transition-colors overflow-hidden"
            >
              <span className="sr-only">Open user menu</span>
              <User className="h-4 w-4" aria-hidden="true" />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[#E5E5E5] bg-white text-[#111111] shadow-sm outline-none animate-in fade-in-80 zoom-in-95">
                <div className="p-1">
                  <button
                    onClick={handleLogout}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-md px-2 py-2 text-[13px] outline-none transition-colors hover:bg-[#F7F7F7] focus:bg-[#F7F7F7]"
                  >
                    <LogOut className="mr-2 h-4 w-4 text-[#666666]" />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
