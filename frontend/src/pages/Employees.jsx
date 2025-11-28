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

  useEffect(()=> fetchEmployees(), []);

  const fetchEmployees = async () => {
    try { const res = await api.get('/employees'); setEmployees(res.data); } catch(e){ console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/employees', form); setForm({ name:'', email:'', phone:'', department:'', jobTitle:'' }); fetchEmployees(); }
    catch(e){ alert('Unable to add'); }
  };

  const handleViewHistory = async (emp) => {
    setSelectedEmp(emp);
    setHistory(null);
    setHistoryFilters({ priority:'ALL', status:'ALL' });
    try { const res = await api.get(`/employees/${emp.id}/history`); setHistory(res.data); } catch(e){ console.error(e); }
  };

  const filteredEmployees = useMemo(()=> {
    if(!q) return employees;
    return employees.filter(e => e.name.toLowerCase().includes(q.toLowerCase()));
  }, [employees, q]);

  const filteredTasks = useMemo(()=> {
    if(!history?.tasks) return [];
    return history.tasks.filter(t => {
      const p = historyFilters.priority === 'ALL' || t.priority === historyFilters.priority;
      const s = historyFilters.status === 'ALL' || t.status === historyFilters.status;
      return p && s;
    });
  }, [history, historyFilters]);

  return (
    <main className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3"><UserPlus className="w-6 h-6 text-blue-600" /> Employee Directory</h1>
          <div className="w-64"><SearchInput value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search by name..." /></div>
        </div>

        <Card className="mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input required placeholder="Full name" value={form.name} onChange={e=> setForm({...form, name:e.target.value})} className="border p-3 rounded focus:outline-none" />
            <input required placeholder="Email" value={form.email} onChange={e=> setForm({...form, email:e.target.value})} className="border p-3 rounded focus:outline-none" />
            <input placeholder="Phone" value={form.phone} onChange={e=> setForm({...form, phone:e.target.value})} className="border p-3 rounded focus:outline-none" />
            <input required placeholder="Department" value={form.department} onChange={e=> setForm({...form, department:e.target.value})} className="border p-3 rounded focus:outline-none" />
            <input required placeholder="Job title" value={form.jobTitle} onChange={e=> setForm({...form, jobTitle:e.target.value})} className="border p-3 rounded focus:outline-none" />
            <div className="flex items-center">
              <button className="ml-auto bg-blue-600 text-white px-5 py-3 rounded shadow hover:bg-blue-700 transition">+ Add Employee</button>
            </div>
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
                  <td className="py-4 px-6 small text-muted">{emp.email}<div className="text-xs text-gray-400">{emp.phone}</div></td>
                  <td className="py-4 px-6">{emp.jobTitle || '—'}</td>
                  <td className="py-4 px-6"><Badge variant="blue">{emp.department || '—'}</Badge></td>
                  <td className="py-4 px-6">
                    <button onClick={()=>handleViewHistory(emp)} className="text-blue-600 hover:text-blue-800 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> View History</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* History modal */}
        {selectedEmp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl modal-scroll card">
              <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{selectedEmp.name}</h3>
                  <div className="small text-muted">{selectedEmp.jobTitle} • {selectedEmp.department}</div>
                </div>
                <button onClick={()=>setSelectedEmp(null)} className="p-2 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>

              <div className="p-5">
                {!history ? (
                  <div className="text-center text-muted py-12">Loading history…</div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 rounded-xl bg-green-50 text-center"><div className="text-2xl font-bold text-green-700">{history.stats.completed}</div><div className="text-xs text-green-600">Completed</div></div>
                      <div className="p-4 rounded-xl bg-yellow-50 text-center"><div className="text-2xl font-bold text-yellow-700">{history.stats.pending}</div><div className="text-xs text-yellow-600">Pending</div></div>
                      <div className="p-4 rounded-xl bg-red-50 text-center"><div className="text-2xl font-bold text-red-700">{history.stats.failed}</div><div className="text-xs text-red-600">Failed</div></div>
                      <div className="p-4 rounded-xl bg-gray-50 text-center"><div className="text-2xl font-bold text-gray-700">{history.stats.total}</div><div className="text-xs text-gray-600">Total</div></div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Filter className="w-5 h-5 text-muted" />
                      <select value={historyFilters.priority} onChange={e=>setHistoryFilters({...historyFilters, priority:e.target.value})} className="border p-2 rounded">
                        <option value="ALL">All priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>
                      <select value={historyFilters.status} onChange={e=>setHistoryFilters({...historyFilters, status:e.target.value})} className="border p-2 rounded">
                        <option value="ALL">All statuses</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="TODO">Todo</option>
                      </select>
                      <div className="ml-auto text-sm text-muted">{filteredTasks.length} records</div>
                    </div>

                    <div className="space-y-3">
                      {filteredTasks.length === 0 ? <div className="text-center text-muted py-8">No tasks match filters.</div> :
                        filteredTasks.map(t => (
                          <div key={t.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{t.title}</div>
                              <div className="text-xs text-muted">Due {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className={`text-xs px-2 py-1 rounded-full font-medium ${t.status==='COMPLETED' ? 'bg-green-100 text-green-700' : t.status==='IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{t.status.replace('_',' ')}</div>
                              <div className={`text-[11px] px-2 py-0.5 rounded font-bold ${t.priority==='HIGH'?'bg-red-100 text-red-700':t.priority==='MEDIUM'?'bg-yellow-100 text-yellow-700':'bg-green-100 text-green-700'}`}>{t.priority}</div>
                            </div>
                          </div>
                        ))
                      }
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
