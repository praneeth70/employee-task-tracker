import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { UserPlus, BarChart2, X, CheckCircle, Clock, AlertCircle, Filter, Search } from 'lucide-react';

export default function Employees(){
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', phone:'', department:'', jobTitle:'' });
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [history, setHistory] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({ priority:'ALL', status:'ALL' });
  const [q, setQ] = useState('');

  useEffect(()=> { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try { const res = await api.get('/employees'); setEmployees(res.data); } catch(err){ console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/employees', form); setForm({ name:'', email:'', phone:'', department:'', jobTitle:'' }); fetchEmployees(); }
    catch (err){ alert("Error adding employee"); }
  };

  const handleViewHistory = async (emp) => {
    setSelectedEmp(emp);
    setHistory(null);
    setHistoryFilters({ priority:'ALL', status:'ALL' });
    try { const res = await api.get(`/employees/${emp.id}/history`); setHistory(res.data); } catch(err){ console.error(err); }
  };

  const filteredEmployees = useMemo(()=> {
    if (!q) return employees;
    return employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  }, [employees, q]);

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-bold ";
    if (status === 'COMPLETED') return base + 'bg-green-100 text-green-700';
    if (status === 'IN_PROGRESS') return base + 'bg-blue-100 text-blue-700';
    return base + 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3"><UserPlus className="w-6 h-6 text-blue-600" /> Employee Directory</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name..." className="border p-2 rounded pl-10 focus:outline-blue-500" />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl card mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input placeholder="Full Name" required value={form.name} onChange={e=> setForm({...form, name:e.target.value})} className="border p-2 rounded focus:outline-blue-500" />
          <input placeholder="Email" required value={form.email} onChange={e=> setForm({...form, email:e.target.value})} className="border p-2 rounded focus:outline-blue-500" />
          <input placeholder="Phone" value={form.phone} onChange={e=> setForm({...form, phone:e.target.value})} className="border p-2 rounded focus:outline-blue-500" />
          <input placeholder="Department" required value={form.department} onChange={e=> setForm({...form, department:e.target.value})} className="border p-2 rounded focus:outline-blue-500" />
          <input placeholder="Job Title" required value={form.jobTitle} onChange={e=> setForm({...form, jobTitle:e.target.value})} className="border p-2 rounded focus:outline-blue-500" />
          <button className="bg-blue-600 text-white py-2 rounded shadow-md hover:bg-blue-700 transition">+ Add Employee</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden card border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Contact</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Department</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEmployees.map(emp => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium">{emp.name}</td>
                <td className="py-3 px-6 text-sm text-muted">
                  <div>{emp.email}</div>
                  <div className="text-xs text-gray-400">{emp.phone}</div>
                </td>
                <td className="py-3 px-6 text-sm">{emp.jobTitle || '—'}</td>
                <td className="py-3 px-6"><span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-medium">{emp.department || '—'}</span></td>
                <td className="py-3 px-6">
                  <button onClick={()=> handleViewHistory(emp)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2">
                    <BarChart2 className="w-4 h-4" /> View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedEmp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto card">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{selectedEmp.name}</h3>
                <div className="text-sm text-muted">{selectedEmp.jobTitle} • {selectedEmp.department}</div>
              </div>
              <button onClick={()=> setSelectedEmp(null)} className="p-2 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6">
              {!history ? <div className="text-center text-muted py-8">Loading...</div> : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-green-50 text-center">
                      <div className="text-2xl font-bold text-green-700">{history.stats.completed}</div>
                      <div className="text-xs text-green-600 uppercase">Completed</div>
                    </div>
                    <div className="p-4 rounded-xl bg-yellow-50 text-center">
                      <div className="text-2xl font-bold text-yellow-700">{history.stats.pending}</div>
                      <div className="text-xs text-yellow-600 uppercase">Pending</div>
                    </div>
                    <div className="p-4 rounded-xl bg-red-50 text-center">
                      <div className="text-2xl font-bold text-red-700">{history.stats.failed}</div>
                      <div className="text-xs text-red-600 uppercase">Failed</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 text-center">
                      <div className="text-2xl font-bold text-gray-700">{history.stats.total}</div>
                      <div className="text-xs text-gray-600 uppercase">Total</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Filter className="w-5 h-5 text-muted" />
                    <select value={historyFilters.priority} onChange={e => setHistoryFilters({...historyFilters, priority:e.target.value})} className="border p-2 rounded text-sm">
                      <option value="ALL">All priorities</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                    <select value={historyFilters.status} onChange={e => setHistoryFilters({...historyFilters, status:e.target.value})} className="border p-2 rounded text-sm">
                      <option value="ALL">All statuses</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="TODO">Todo</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {filteredTasks.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium">{t.title}</div>
                          <div className="text-xs text-muted">Due: {new Date(t.dueDate).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-xs px-2 py-1 rounded-full font-medium ${t.status==='COMPLETED'?'bg-green-100 text-green-700':t.status==='IN_PROGRESS'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-700'}`}>{t.status.replace('_',' ')}</div>
                          <div className={`text-[11px] px-2 py-0.5 rounded font-bold ${t.priority==='HIGH'?'bg-red-100 text-red-700':t.priority==='MEDIUM'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{t.priority}</div>
                        </div>
                      </div>
                    ))}
                    {filteredTasks.length===0 && <div className="text-center text-muted py-4">No records found.</div>}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
