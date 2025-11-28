import { useEffect, useState, useMemo } from 'react';
import api from '../api/axios';
import { UserPlus, BarChart2, X, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', jobTitle: '' });
  const [selectedEmp, setSelectedEmp] = useState(null); 
  const [history, setHistory] = useState(null);
  const [historyFilters, setHistoryFilters] = useState({ priority: 'ALL', status: 'ALL' });

  // Load employees
  useEffect(() => { fetchEmployees(); }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) { console.error("Failed to load employees"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employees', form);
      setForm({ name: '', email: '', phone: '', department: '', jobTitle: '' });
      fetchEmployees();
    } catch (err) { alert("Error adding employee"); }
  };

  // Fetch history when user clicks "View History"
  const handleViewHistory = async (emp) => {
    setSelectedEmp(emp);
    setHistory(null);
    setHistoryFilters({ priority: 'ALL', status: 'ALL' }); // Reset filters on open
    try {
      const res = await api.get(`/employees/${emp.id}/history`);
      setHistory(res.data);
    } catch (err) { console.error("Failed to load history"); }
  };

  // NEW: Filtered Tasks List (Runs whenever history or filters change)
  const filteredTasks = useMemo(() => {
    if (!history || !history.tasks) return [];
    
    return history.tasks.filter(task => {
      // Filter by Priority
      const priorityMatch = historyFilters.priority === 'ALL' || task.priority === historyFilters.priority;
      
      // Filter by Status
      const statusMatch = historyFilters.status === 'ALL' || task.status === historyFilters.status;

      return priorityMatch && statusMatch;
    });
  }, [history, historyFilters]);

  // UI Helper for status badge
  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-xs font-bold ";
    if (status === 'COMPLETED') return base + 'bg-green-100 text-green-700';
    if (status === 'IN_PROGRESS') return base + 'bg-blue-100 text-blue-700';
    return base + 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="max-w-7xl mx-auto p-6 relative">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
        <UserPlus className="w-6 h-6 text-blue-600" /> Employee Directory
      </h2>

      {/* ADD EMPLOYEE FORM (Retains original UI/UX) */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Employee</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input className="border p-2 rounded focus:outline-blue-500" placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input className="border p-2 rounded focus:outline-blue-500" placeholder="Email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input className="border p-2 rounded focus:outline-blue-500" placeholder="Phone (10 digits)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input className="border p-2 rounded focus:outline-blue-500" placeholder="Department" required value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <input className="border p-2 rounded focus:outline-blue-500" placeholder="Job Title" required value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition shadow-md">+ Add Employee</button>
        </form>
      </div>

      {/* EMPLOYEES LIST */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Department</th>
              <th className="py-3 px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium text-gray-800">{emp.name}</td>
                <td className="py-3 px-6 text-sm">{emp.jobTitle}</td>
                <td className="py-3 px-6"><span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-medium">{emp.department}</span></td>
                <td className="py-3 px-6">
                  <button onClick={() => handleViewHistory(emp)} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium transition">
                    <BarChart2 className="w-4 h-4" /> View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* HISTORY MODAL (Popup) */}
      {selectedEmp && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10 rounded-t-2xl">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Task Performance: {selectedEmp.name}</h3>
                <p className="text-sm text-gray-500">{selectedEmp.jobTitle} • {selectedEmp.department}</p>
              </div>
              <button onClick={() => setSelectedEmp(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6">
              {!history ? (
                <p className="text-center text-gray-500 py-10">Loading history...</p>
              ) : (
                <>
                  {/* Stats Cards: Completed Breakdown */}
                  <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
                      <div className="flex justify-center mb-2"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                      <div className="text-2xl font-bold text-green-700">{history.stats.completed}</div>
                      <div className="text-xs text-green-600 uppercase font-bold">Completed</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-center">
                      <div className="flex justify-center mb-2"><Clock className="w-6 h-6 text-yellow-600" /></div>
                      <div className="text-2xl font-bold text-yellow-700">{history.stats.pending}</div>
                      <div className="text-xs text-yellow-600 uppercase font-bold">Pending</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                      <div className="flex justify-center mb-2"><AlertCircle className="w-6 h-6 text-red-600" /></div>
                      <div className="text-2xl font-bold text-red-700">{history.stats.highPriorityCompleted}</div>
                      <div className="text-xs text-red-600 uppercase font-bold">High Priority Done</div>
                    </div>
                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200 text-center">
                      <div className="flex justify-center mb-2"><BarChart2 className="w-6 h-6 text-gray-600" /></div>
                      <div className="text-2xl font-bold text-gray-700">{history.stats.total}</div>
                      <div className="text-xs text-gray-600 uppercase font-bold">Total Assigned</div>
                    </div>
                  </div>
                  
                  {/* HISTORY FILTERS */}
                  <div className="flex gap-4 items-center mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filter History:</span>
                    
                    {/* Filter by Priority (Easy/Medium/Hard) */}
                    <select 
                      value={historyFilters.priority} 
                      onChange={(e) => setHistoryFilters({...historyFilters, priority: e.target.value})}
                      className="border p-2 rounded text-sm focus:outline-blue-500"
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="LOW">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">Hard</option>
                    </select>

                    {/* Filter by Status (Finished/Skipped/Unfinished) */}
                    <select 
                      value={historyFilters.status} 
                      onChange={(e) => setHistoryFilters({...historyFilters, status: e.target.value})}
                      className="border p-2 rounded text-sm focus:outline-blue-500"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="COMPLETED">Finished</option>
                      <option value="IN_PROGRESS">Unfinished</option>
                      <option value="TODO">Skipped/Todo</option>
                    </select>
                  </div>

                  {/* Task History List */}
                  <h4 className="font-bold text-gray-700 mb-3">Filtered Log ({filteredTasks.length} entries)</h4>
                  {filteredTasks.length === 0 ? (
                    <p className="text-gray-400 text-sm py-5 text-center">No tasks match the current filters.</p>
                  ) : (
                    <div className="space-y-3">
                      {filteredTasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition">
                          <div>
                            <div className="font-medium text-gray-800">{task.title}</div>
                            <div className="text-xs text-gray-500">Priority: {task.priority}</div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <span className={getStatusBadge(task.status)}>
                              {task.status.replace('_', ' ')}
                            </span>
                            {/* Checkmark/X for visual history */}
                            {task.status === 'COMPLETED' ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : (
                                <X className="w-5 h-5 text-red-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}