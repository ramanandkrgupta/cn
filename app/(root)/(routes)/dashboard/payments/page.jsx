"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, RefreshCw, CheckCircle, Smartphone } from "lucide-react";

export default function AdminPaymentsPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState(null);

    useEffect(() => {
        if (session?.user?.role !== "ADMIN") {
            router.push("/");
            return;
        }
        fetchPayments();
    }, [session]);

    const fetchPayments = async () => {
        try {
            const res = await fetch("/api/v1/admin/payments");
            if (res.ok) {
                const data = await res.json();
                setPayments(data);
            } else {
                toast.error("Failed to load payments");
            }
        } catch (error) {
            console.error("Error fetching payments:", error);
            toast.error("Error loading payments");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (paymentId) => {
        setVerifyingId(paymentId);
        try {
            const res = await fetch("/api/v1/admin/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId })
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message);
                // Refresh list
                fetchPayments();
            } else {
                toast.error(data.message || "Verification failed");
            }
        } catch (error) {
            console.error("Error verifying payment:", error);
            toast.error("Error verifying payment");
        } finally {
            setVerifyingId(null);
        }
    };

    const [syncing, setSyncing] = useState(false);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await fetch("/api/v1/admin/payments/sync", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({})
            });
            const data = await res.json();
            if (data.success) {
                const stats = data.stats;
                if (stats) {
                    const msg = `Synced: ${stats.synced}
Skipped (Filter): ${stats.skipped_filter_mismatch}
Skipped (No User): ${stats.skipped_user_not_found}
Skipped (Exists): ${stats.skipped_already_exists}`;
                    toast.success(msg, { duration: 6000, style: { whiteSpace: 'pre-line' } });
                } else {
                    toast.success(data.message);
                }
                fetchPayments();
            } else {
                toast.error(data.details || "Sync failed");
            }
        } catch (error) {
            toast.error("Error syncing payments");
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payments & Reconciliation</h1>
                <div className="flex gap-2">
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className="btn btn-primary btn-sm"
                    >
                        {syncing ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Smartphone className="w-4 h-4 mr-2" />
                        )}
                        {syncing ? "Syncing..." : "Sync from Razorpay"}
                    </button>
                    <button onClick={fetchPayments} className="btn btn-ghost btn-sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="bg-base-200 rounded-lg p-6 overflow-x-auto">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th>Payment Date</th>
                            <th>User</th>
                            <th>Order ID</th>
                            <th>Mobile</th>
                            <th>UTR</th>
                            <th>Amount</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment.id}>
                                <td className="text-sm">
                                    {payment.startDate ? new Date(payment.startDate).toLocaleString() : new Date(payment.createdAt).toLocaleString()}
                                </td>
                                <td>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{payment.user?.name || "Unknown"}</span>
                                        <span className="text-xs text-base-content/60">{payment.user?.email}</span>
                                    </div>
                                </td>
                                <td className="font-mono text-xs">{payment.razorpayOrderId}</td>
                                <td className="font-mono text-xs">{payment.mobile || "-"}</td>
                                <td className="font-mono text-xs">{payment.utr || "-"}</td>
                                <td>{payment.currency} {payment.amount}</td>
                                <td><span className="badge badge-outline uppercase text-xs">{payment.planId}</span></td>
                                <td>
                                    <span className={`badge ${payment.status === 'paid' ? 'badge-success' :
                                        payment.status === 'created' ? 'badge-warning' : 'badge-ghost'}`}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td>
                                    {payment.status !== 'paid' && (
                                        <button
                                            onClick={() => handleVerify(payment.id)}
                                            disabled={verifyingId === payment.id}
                                            className="btn btn-xs btn-primary"
                                        >
                                            {verifyingId === payment.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                "Verify Status"
                                            )}
                                        </button>
                                    )}
                                    {payment.status === 'paid' && (
                                        <CheckCircle className="w-4 h-4 text-success" />
                                    )}
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4">No payments found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
