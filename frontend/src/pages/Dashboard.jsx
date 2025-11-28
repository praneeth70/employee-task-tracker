import { useEffect, useState } from 'react';
import api from '../api/axios';
import { ClipboardList, CheckCircle, Clock } from 'lucide-react';
import Card from '../components/ui/Card';

export default function Dashboard(){
  const [stats, setStats] = useState({ totalTasks:0, completedTasks:0, pendingTasks:0, failedTasks:0 });
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    api.get('/stats').then(r => { setStats(r.data); setLoading(false); }).catch(()=>setLoading(false));
  },[]);

  if (loading) return <div className="flex items-center justify-center h-[60vh]"><div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  const successRate = stats.totalTasks ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0;

  return (
    <main className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted mt-1">A quick look at current workload and success rate.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase">Total Tasks</div>
                <div className="text-3xl font-bold mt-2">{stats.totalTasks}</div>
                <div className="text-xs text-muted mt-1">Assigned & Unassigned</div>
              </div>
              <div className="p-2 rounded bg-blue-50">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase">Completed</div>
                <div className="text-3xl font-bold mt-2">{stats.completedTasks}</div>
                <div className="text-xs text-muted mt-1">Finished successfully</div>
              </div>
              <div className="p-2 rounded bg-green-50">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-yellow-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase">Pending</div>
                <div className="text-3xl font-bold mt-2">{stats.pendingTasks}</div>
                <div className="text-xs text-muted mt-1">Awaiting work</div>
              </div>
              <div className="p-2 rounded bg-yellow-50">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-muted uppercase">Success Rate</div>
                <div className="text-3xl font-bold mt-2">{successRate}%</div>
                <div className="text-xs text-muted mt-1">{stats.completedTasks} / {stats.totalTasks}</div>
              </div>
              <div className="p-2 rounded bg-gray-50 text-muted text-sm">trend</div>
            </div>
          </Card>
        </div>

        <div className="mt-8 card p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Recent Activity</h3>
            <div className="text-sm text-muted">Last 7 days</div>
          </div>
          <div className="text-muted mt-4 small">Activity summary is based on tasks from the API. Charts are intentionally lightweight to keep performance great for the assignment.</div>
        </div>
      </div>
    </main>
  );
}
