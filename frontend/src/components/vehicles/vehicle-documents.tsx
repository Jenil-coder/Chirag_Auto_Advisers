"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileText, Trash2, Download } from "lucide-react";

interface Document {
  id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

interface VehicleDocumentsProps {
  vehicleId: string;
  documents: Document[];
}

export function VehicleDocuments({ vehicleId, documents = [] }: VehicleDocumentsProps) {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState("RC");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post(`/vehicles/${vehicleId}/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      setFile(null);
      setErrorMsg(null);
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      (document.getElementById('file-upload') as HTMLInputElement).value = '';
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.message || "Failed to upload document.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await apiClient.delete(`/vehicles/${vehicleId}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleId] });
      setIsDeletingId(null);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to delete document.");
      setIsDeletingId(null);
    },
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("document_type", docType);

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setIsDeletingId(id);
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Upload New Document</h3>
        <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="space-y-2 w-full sm:w-1/3">
            <label className="text-sm font-medium">Document Type</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="RC">RC Copy</option>
              <option value="Insurance">Insurance Policy</option>
              <option value="Fitness">Fitness Certificate</option>
              <option value="Permit">Permit</option>
              <option value="Tax">Tax Receipt</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2 w-full sm:w-1/2">
            <label className="text-sm font-medium">File (Max 5MB)</label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            />
          </div>
          <Button type="submit" disabled={!file || uploadMutation.isPending} className="w-full sm:w-auto h-10">
            {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            Upload
          </Button>
        </form>
        {errorMsg && (
          <p className="mt-2 text-sm text-destructive">{errorMsg}</p>
        )}
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="p-6">
          <h3 className="font-semibold text-lg mb-4">Uploaded Documents ({documents.length})</h3>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
              <p>No documents uploaded yet.</p>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-muted p-2 rounded">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.file_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.document_type} &bull; Uploaded {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') + doc.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </a>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDeletingId === doc.id}
                    >
                      {isDeletingId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
