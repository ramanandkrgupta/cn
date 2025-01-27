const StatItem = ({ label, value, color }) => (
  <div className="text-center">
    <div className={`text-2xl md:text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-xs md:text-sm text-gray-500">{label}</div>
  </div>
)
