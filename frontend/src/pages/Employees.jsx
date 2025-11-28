import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { UserPlus, BarChart2, X, Filter } from 'lucide-react';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Badge from '../components/ui/Badge';

export default function Employees(){
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', phone:'', department:'', jobTitle:'' });
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [history, setHistory] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({ priority:'ALL', status:'ALL' });
  const [q, setQ] = useState('');

  useEffect(()=> {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', form);
      setForm({ name:'', email:'', phone:'', department:'', jobTitle:'' });
      fetchEmployees();
    } catch (err) {
      alert("Error adding employee");
    }
  };

  const handleViewHistory = async (emp) => {
    setSelectedEmp(emp);
    setHistory(null);
    setHistoryFilters({ priority:'ALL', status:'ALL' });

    try {
      const res = await api.get(`/employees/${emp.id}/history`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!q) return employees;
    return employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  }, [employees, q]);

  const filteredTasks = useMemo(() => {
    if (!history?.tasks) return [];
    return history.tasks.filter(task => {
      const matchPriority = historyFilters.priority === 'ALL' || task.priority === historyFilters.priority;
      const matchStatus = historyFilters.status === 'ALL' || task.status === historyFilters.status;
      return matchPriority && matchStatus;
    });
  }, [history, historyFilters]);

  return (
    <main className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-blue-600" /> Employee Directory
          </h1>
          <div className="w-64">
            <SearchInput value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search employees..." />
          </div>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Full Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} className="border p-3 rounded" />
            <input required placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} className="border p-3 rounded" />
            <input placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} className="border p-3 rounded" />
            <input required placeholder="Department" value={form.department} onChange={(e)=>setForm({...form, department:e.target.value})} className="border p-3 rounded" />
            <input required placeholder="Job Title" value={form.jobTitle} onChange={(e)=>setForm({...form, jobTitle:e.target.value})} className="border p-3 rounded" />
            <button className="bg-blue-600 text-white px-5 py-3 rounded shadow hover:bg-blue-700 transition w-full">+ Add Employee</button>
          </form>
        </Card>

        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="table-head">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Department</th>
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="table-row">
                  <td className="py-4 px-6 font-medium">{emp.name}</td>
                  <td className="py-4 px-6 small text-gray-500">
                    {emp.email}
                    <div className="text-xs text-gray-400">{emp.phone}</div>
                  </td>
                  <td className="py-4 px-6">{emp.jobTitle}</td>
                  <td className="py-4 px-6"><Badge variant="blue">{emp.department}</Badge></td>
                  <td className="py-4 px-6">
                    <button onClick={()=>handleViewHistory(emp)} className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                      <BarChart2 className="w-4 h-4" /> View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEmp && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white card rounded-2xl max-w-3xl w-full modal-scroll">
              <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmp.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEmp.jobTitle} • {selectedEmp.department}</p>
                </div>
                <button onClick={()=>setSelectedEmp(null)} className="p-2 rounded hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {!history ? (
                  <p className="text-center text-gray-400 py-10">Loading...</p>
                ) : (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-4 rounded-lg bg-green-50 text-center">
                        <div className="text-2xl font-bold text-green-700">{history.stats.completed}</div>
                        <div className="text-xs text-green-600">Completed</div>
                      </div>
                      <div className="p-4 rounded-lg bg-yellow-50 text-center">
                        <div className="text-2xl font-bold text-yellow-700">{history.stats.pending}</div>
                        <div className="text-xs text-yellow-600">Pending</div>
                      </div>
                      <div className="p-4 rounded-lg bg-gray-100 text-center">
                        <div className="text-2xl font-bold text-gray-700">{history.stats.total}</div>
                        <div className="text-xs text-gray-600">Total</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <Filter className="w-5 h-5 text-gray-500" />
                      <select value={historyFilters.priority} onChange={(e)=>setHistoryFilters({...historyFilters, priority:e.target.value})} className="border p-2 rounded">
                        <option value="ALL">All Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>

                      <select value={historyFilters.status} onChange={(e)=>setHistoryFilters({...historyFilters, status:e.target.value})} className="border p-2 rounded">
                        <option value="ALL">All Status</option>
                        <option value="TODO">Todo</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-xs text-gray-500">{task.priority}</p>
                          </div>
                          <div className="text-sm px-3 py-1 rounded-full bg-gray-100">{task.status}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
