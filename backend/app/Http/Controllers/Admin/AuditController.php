<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class AuditController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $query = AuditLog::with('user:id,name,email');

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('entity_name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('module', 'like', "%{$search}%");
            });
        }

        if ($request->has('user_id') && $request->user_id !== 'all') {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('module') && $request->module !== 'all') {
            $query->where('module', $request->module);
        }

        if ($request->has('action_type') && $request->action_type !== 'all') {
            $query->where('action', $request->action_type);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $query->orderBy('created_at', 'desc');

        $logs = $query->paginate($request->input('limit', 25));

        return $this->success('Audit logs retrieved successfully', $logs);
    }

    public function show($id)
    {
        $log = AuditLog::with('user:id,name,email')->findOrFail($id);
        return $this->success('Audit log retrieved successfully', $log);
    }
}
