import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { User } from "@/types/admin";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiClient.get("/auth/me").then(res => res.data.data.user as User),
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const hasPermission = (permissionName: string) => {
    if (!user || !user.role) return false;
    
    // Administrator role gets all permissions automatically
    if (user.role.name === 'Administrator' || user.role_id === 1) return true;
    
    if (!user.role.permissions) return false;
    
    return user.role.permissions.some(p => p.name === permissionName);
  };

  return { user, isLoading, error, hasPermission };
}
