import React, { useEffect, useState } from "react";
import { Droplet, Plus, Minus, Check, X, AlertCircle, RefreshCw, Activity } from "lucide-react";
import { BACKEND_URL } from "../../../services";

// Helper for status colors
const getStatusStyles = (status) => {
    switch (status) {
        case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
        case "approved": return "bg-blue-100 text-blue-700 border-blue-200";
        case "fulfilled": return "bg-emerald-100 text-emerald-700 border-emerald-200";
        case "rejected": return "bg-red-100 text-red-700 border-red-200";
        default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
};

export default function AdminBloodRequstsPage() {
    const [requests, setRequests] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loadingReq, setLoadingReq] = useState(true);
    const [loadingInv, setLoadingInv] = useState(true);
    
    // Track loading states for specific items to prevent double-clicks
    const [processingId, setProcessingId] = useState(null); 

    const API = BACKEND_URL;

    // --- FETCH DATA ---
    const loadRequests = async () => {
        setLoadingReq(true);
        try {
            const res = await fetch(`${API}/requests`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if(res.ok) setRequests(data);
        } catch (error) {
            console.error("Error loading requests:", error);
        } finally {
            setLoadingReq(false);
        }
    };

    const loadInventory = async () => {
        setLoadingInv(true);
        try {
            const res = await fetch(`${API}/admin/inventory`, { method: "GET", credentials: "include" });
            const data = await res.json();
            if(res.ok) setInventory(data);
        } catch (error) {
            console.error("Error loading inventory:", error);
        } finally {
            setLoadingInv(false);
        }
    };

    useEffect(() => {
        loadRequests();
        loadInventory();
    }, []);

    // --- ACTIONS ---

    // 1. Update Inventory (Optimistic UI Update)
    const handleInventoryAdjust = async (bloodGroup, amount) => {
        // Prevent interaction if currently processing this item
        if (processingId === `inv-${bloodGroup}`) return;

        // Find current item
        const item = inventory.find(i => i.bloodGroup === bloodGroup);
        if (!item) return;

        // Optimistic check: don't allow negative inventory in UI
        if (item.units + amount < 0) return;

        setProcessingId(`inv-${bloodGroup}`);

        try {
            const res = await fetch(`${API}/admin/inventory/${bloodGroup}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ units: amount })
            });

            if (res.ok) {
                // SUCCESS: Update local state immediately based on action
                setInventory(prev => prev.map(inv => 
                    inv.bloodGroup === bloodGroup 
                        ? { ...inv, units: inv.units + amount } 
                        : inv
                ));
            }
        } catch (error) {
            console.error("Inventory update failed", error);
            // Optionally revert state here if you did a true optimistic update
        } finally {
            setProcessingId(null);
        }
    };

    // 2. Update Request Status
    const handleRequestStatus = async (id, newStatus) => {
        if (processingId === `req-${id}`) return;
        setProcessingId(`req-${id}`);

        try {
            const res = await fetch(`${API}/admin/requests/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                // Update local list
                setRequests(prev => prev.map(req => 
                    req._id === id ? { ...req, status: newStatus } : req
                ));
                
                // If fulfilled, we likely need to refresh inventory too
                if (newStatus === 'fulfilled') {
                    loadInventory(); 
                }
            }
        } catch (error) {
            console.error("Request update failed", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-8">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Droplet className="w-8 h-8 text-red-600 fill-red-600" />
                        Blood Bank Management
                    </h1>
                    <p className="text-slate-500 mt-1">Monitor inventory levels and process donation requests.</p>
                </div>
                <button 
                    onClick={() => { loadRequests(); loadInventory(); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    <RefreshCw className={`w-4 h-4 ${loadingInv ? 'animate-spin' : ''}`} />
                    Refresh Data
                </button>
            </div>

            {/* Inventory Grid */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-slate-400" />
                    <h2 className="text-lg font-semibold text-slate-800">Live Inventory</h2>
                </div>

                {loadingInv ? (
                    <div className="h-40 flex items-center justify-center bg-white rounded-xl border border-slate-200">
                        <span className="text-slate-400 flex items-center gap-2">
                            <RefreshCw className="animate-spin w-5 h-5" /> Loading Inventory...
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {inventory.map((item) => {
                            const isLow = item.units <= 2;
                            const isCritical = item.units === 0;
                            
                            return (
                                <div 
                                    key={item.bloodGroup} 
                                    className={`
                                        relative overflow-hidden rounded-xl border p-5 bg-white shadow-sm transition-all hover:shadow-md
                                        ${isCritical ? 'border-red-200 ring-1 ring-red-100' : 'border-slate-200'}
                                    `}
                                >
                                    {/* Status Indicator Line */}
                                    <div className={`absolute top-0 left-0 w-full h-1 ${isCritical ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500'}`} />

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className="text-3xl font-black text-slate-800">{item.bloodGroup}</span>
                                            {isCritical && <span className="block text-xs text-red-600 font-bold mt-1">CRITICAL</span>}
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-2xl font-bold ${isCritical ? 'text-red-600' : 'text-slate-700'}`}>
                                                {item.units}
                                            </span>
                                            <span className="block text-xs text-slate-400 uppercase font-medium">Units</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-auto">
                                        <button 
                                            onClick={() => handleInventoryAdjust(item.bloodGroup, -1)}
                                            disabled={item.units <= 0 || processingId === `inv-${item.bloodGroup}`}
                                            className="flex-1 flex items-center justify-center py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleInventoryAdjust(item.bloodGroup, 1)}
                                            disabled={processingId === `inv-${item.bloodGroup}`}
                                            className="flex-1 flex items-center justify-center py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Requests Table */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-slate-400" />
                        <h2 className="text-lg font-semibold text-slate-800">Pending Requests</h2>
                    </div>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-500 border border-slate-200 shadow-sm">
                        {requests.filter(r => r.status === 'pending').length} Pending
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">Patient Name</th>
                                <th className="px-6 py-4">CNIC</th>
                                <th className="px-6 py-4 text-center">Group</th>
                                <th className="px-6 py-4 text-center">Units</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loadingReq ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Loading requests...</td>
                                </tr>
                            ) : requests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400">No requests found.</td>
                                </tr>
                            ) : (
                                requests.map((req) => (
                                    <tr key={req._id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">
                                            {req.patientName || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-mono">
                                            {req.cnic || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block px-2 py-1 rounded bg-slate-100 font-bold text-slate-700">
                                                {req.bloodGroup}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center font-medium text-slate-700">
                                            {req.units}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(req.status)} capitalize`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {req.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={() => handleRequestStatus(req._id, 'rejected')}
                                                        disabled={processingId === `req-${req._id}`}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleRequestStatus(req._id, 'fulfilled')}
                                                        disabled={processingId === `req-${req._id}`}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg shadow-sm transition-all disabled:opacity-50 text-xs font-medium"
                                                    >
                                                        <Check className="w-3.5 h-3.5" />
                                                        Approve
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}