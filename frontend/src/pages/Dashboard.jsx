import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react'; // Premium Icons

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0 });
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    api.get('/stats')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  // Loading Spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    // Background Gradient
    <div className="min-h-[calc(100vh-73px)] bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Dashboard Overview</h2>
          <p className="text-gray-500 mt-1">Welcome back, Admin. Here is your daily summary.</p>
          <hr className="mt-4 border-gray-200" />
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* CARD 1: TOTAL TASKS (Blue) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500 hover:shadow-md transition-all transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Tasks</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.totalTasks}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD 2: COMPLETED (Green) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 hover:shadow-md transition-all transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Completed</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.completedTasks}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* CARD 3: PENDING (Yellow) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500 hover:shadow-md transition-all transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Pending</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stats.pendingTasks}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}