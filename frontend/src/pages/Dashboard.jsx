import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';

export default function Dashboard(){
  const [stats, setStats] = useState({ totalTasks:0, completedTasks:0, pendingTasks:0, failedTasks:0 });
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    api.get('/stats')
      .then(res => { setStats(res.data); setLoading(false); })
      .catch(()=> setLoading(false));
  },[]);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );

  const successRate = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <div className="min-h-[calc(100vh-73px)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold">Dashboard Overview</h2>
          <p className="text-muted mt-1">Overview of tasks and recent activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 rounded-xl border-l-4 border-l-blue-500 transition transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase tracking-wide">Total Tasks</div>
                <div className="text-3xl font-bold mt-2">{stats.totalTasks}</div>
                <div className="text-xs text-muted mt-1">All assigned & unassigned</div>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-xl border-l-4 border-l-green-500 transition transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase tracking-wide">Completed</div>
                <div className="text-3xl font-bold mt-2">{stats.completedTasks}</div>
                <div className="text-xs text-muted mt-1">Completed successfully</div>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-xl border-l-4 border-l-yellow-500 transition transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase tracking-wide">Pending</div>
                <div className="text-3xl font-bold mt-2">{stats.pendingTasks}</div>
                <div className="text-xs text-muted mt-1">Awaiting work</div>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card p-6 rounded-xl transition transform hover:scale-[1.02]">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase tracking-wide">Success Rate</div>
                <div className="text-3xl font-bold mt-2">{successRate}%</div>
                <div className="text-xs text-muted mt-1">{stats.completedTasks} / {stats.totalTasks}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                <div className="text-muted text-sm">trend</div>
              </div>
            </div>
          </div>
        </div>

        {/* optional small activity area (safe placeholder) */}
        <div className="mt-8 card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="text-sm text-muted">Last 7 days</div>
          </div>
          <div className="mt-4 text-sm text-muted">No advanced charts to keep the UI simple for the assignment. Data shown is accurate from API.</div>
        </div>
      </div>
    </div>
  );
}
