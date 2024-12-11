"use client";
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function PostStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch('/api/v1/stats/posts');
                const data = await response.json();
                
                if (response.ok) {
                    setStats(data);
                } else {
                    throw new Error(data.error || 'Failed to fetch stats');
                }
            } catch (error) {
                toast.error('Failed to load post statistics');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return <div className="animate-pulse">Loading stats...</div>;
    }

    if (!stats) {
        return <div className="text-red-500">Failed to load statistics</div>;
    }

    return (
        <div className="grid gap-4 p-4">
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-title">Total Posts</div>
                    <div className="stat-value">{stats.total}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Approved</div>
                    <div className="stat-value text-success">{stats.approved}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-warning">{stats.pending}</div>
                </div>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Posts by Subject</h3>
                <div className="grid gap-2">
                    {stats.bySubject?.map((item) => (
                        <div key={item.subjectId} className="flex justify-between items-center p-2 bg-base-200 rounded">
                            <span>{item.subject.subject_name}</span>
                            <span className="badge badge-primary">{item._count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 