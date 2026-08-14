"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Loader2, Trash2, ArrowLeft, Edit, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function InsuranceDetails({ policyId }: { policyId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: policy, isLoading, isError } = useQuery({
    queryKey: ["insurance-policy", policyId],
    queryFn: async () => {
      const response = await apiClient.get(`/insurance-policies/${policyId}`);
      return response.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/insurance-policies/${policyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurance-policies"] });
      router.push("/insurance");
    },
  });

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this insurance policy?")) {
      setIsDeleting(true);
      deleteMutation.mutate(undefined, {
        onError: () => setIsDeleting(false),
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (isError || !policy) {
    return (
      <div className="rounded-md bg-destructive/10 p-4 text-destructive text-center">
        Error loading policy details. The policy may not exist or has been deleted.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/insurance"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{policy.policy_number}</h2>
            <p className="text-muted-foreground">
              Status: {policy.is_active ? <span className="text-green-600 font-medium">Active</span> : <span className="text-red-600 font-medium">Inactive</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/insurance/${policy.id}/renew`}>
            <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700">
              <RefreshCcw className="mr-2 h-4 w-4" />
              Renew
            </Button>
          </Link>
          <Link href={`/insurance/${policy.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Policy Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Policy Number</dt>
              <dd className="text-sm font-semibold mt-1">{policy.policy_number}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Insurance Company</dt>
              <dd className="text-sm font-semibold mt-1">{policy.insurance_company?.name || "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
              <dd className="text-sm font-semibold mt-1">{policy.start_date ? new Date(policy.start_date).toLocaleDateString() : "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Expiry Date</dt>
              <dd className="text-sm font-semibold mt-1">{policy.expiry_date ? new Date(policy.expiry_date).toLocaleDateString() : "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Premium Amount</dt>
              <dd className="text-sm font-semibold mt-1">{policy.premium_amount ? `₹${policy.premium_amount}` : "N/A"}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Created At</dt>
              <dd className="text-sm font-semibold mt-1">{new Date(policy.created_at).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow p-6 space-y-4">
          <h3 className="font-semibold text-lg">Linked Vehicle Details</h3>
          {policy.vehicle ? (
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Vehicle Number</dt>
                <dd className="text-sm font-semibold mt-1 text-primary">
                  <Link href={`/vehicles/${policy.vehicle.id}`} className="hover:underline">
                    {policy.vehicle.vehicle_number}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Owner Name</dt>
                <dd className="text-sm font-semibold mt-1">{policy.vehicle.owner_name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Phone Number</dt>
                <dd className="text-sm font-semibold mt-1">{policy.vehicle.phone || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Chassis Number</dt>
                <dd className="text-sm font-semibold mt-1">{policy.vehicle.chassis_number || "N/A"}</dd>
              </div>
            </dl>
          ) : (
            <div className="text-sm text-muted-foreground">No vehicle linked to this policy.</div>
          )}
        </div>
      </div>
    </div>
  );
}
