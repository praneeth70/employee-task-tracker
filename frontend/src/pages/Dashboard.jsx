import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });

  // Connect to Backend on load
  useEffect(() => {
    api.get('/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Tasks */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-gray-500 font-medium">Total Tasks</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalTasks}</p>
        </div>

        {/* Card 2: Completed */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-gray-500 font-medium">Completed</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.completedTasks}</p>
        </div>

        {/* Card 3: Pending */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <p className="text-gray-500 font-medium">Pending</p>
          <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pendingTasks}</p>
        </div>
      </div>
    </div>
  );
}