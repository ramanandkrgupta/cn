import PostStats from '@/components/stats/PostStats';

export default function AdminDashboard() {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <PostStats />
            {/* Other dashboard components */}
        </div>
    );
} 