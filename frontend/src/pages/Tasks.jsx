import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Filter, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Badge from '../components/ui/Badge';

export default function Tasks(){
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ status:'', employeeId:'', q:'' });
  const [newTask, setNewTask] = useState({ title:'', description:'', status:'TODO', priority:'MEDIUM', dueDate:'', employeeId:'' });

  useEffect(()=> { fetchEmployees(); fetchTasks(); }, []);
  useEffect(()=> { const t = setTimeout(()=> fetchTasks(), 220); return ()=> clearTimeout(t); }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data);
    } catch(e){ console.error(e); }
  };

  const fetchEmployees = async () => {
    try { const res = await api.get('/employees'); setEmployees(res.data); } catch(e){ console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/tasks', newTask); setNewTask({ title:'', description:'', status:'TODO', priority:'MEDIUM', dueDate:'', employeeId:'' }); fetchTasks(); }
    catch(e){ alert('Error'); }
  };

  const handleDelete = async (id) => {
    if(!confirm('Are you sure?')) return;
    try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch(e){ alert('Error'); }
  };

  return (
    <main className="min-h-[calc(100vh-80px)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3"><Calendar className="w-6 h-6 text-blue-600" /> Task Board</h1>
          <div className="w-64"><SearchInput value={filters.q} onChange={(e)=>setFilters({...filters, q:e.target.value})} placeholder="Search tasks..." /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <h3 className="font-semibold mb-3">Create New Task</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required value={newTask.title} onChange={e=>setNewTask({...newTask, title:e.target.value})} placeholder="Task title" className="w-full border p-3 rounded" />
              <textarea value={newTask.description} onChange={e=>setNewTask({...newTask, description:e.target.value})} rows="3" className="w-full border p-3 rounded" placeholder="Description (optional)"></textarea>

              <div className="grid grid-cols-2 gap-2">
                <select value={newTask.priority} onChange={e=>setNewTask({...newTask, priority:e.target.value})} className="border p-3 rounded">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <input type="date" value={newTask.dueDate} onChange={e=>setNewTask({...newTask, dueDate:e.target.value})} className="border p-3 rounded" />
              </div>

              <select value={newTask.employeeId} onChange={e=>setNewTask({...newTask, employeeId:e.target.value})} className="w-full border p-3 rounded">
                <option value="">-- Assign to Employee --</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>

              <button className="w-full bg-blue-600 text-white py-3 rounded flex items-center justify-center gap-2"><Plus className="w-4 h-4" /> Create Task</button>
            </form>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <div className="card p-4 rounded-xl flex items-center gap-3">
              <Filter className="w-5 h-5 text-muted" />
              <div className="text-sm text-muted font-medium">Filter</div>
              <select value={filters.status} onChange={e=>setFilters({...filters, status:e.target.value})} className="border p-2 rounded">
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>

              <select value={filters.employeeId} onChange={e=>setFilters({...filters, employeeId:e.target.value})} className="border p-2 rounded">
                <option value="">All Employees</option>
                {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>

              <div className="ml-auto text-sm text-muted">{tasks.length} results</div>
            </div>

            <div className="card overflow-hidden rounded-xl">
              <table className="w-full">
                <thead className="table-head">
                  <tr>
                    <th className="py-3 px-6 text-left">Task</th>
                    <th className="py-3 px-6 text-left">Assignee</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Due</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length===0 ? (
                    <tr><td colSpan="5" className="text-center py-12 text-muted">No tasks yet — create one on the left.</td></tr>
                  ) : tasks.map(t => (
                    <tr key={t.id} className="table-row">
                      <td className="py-4 px-6">
                        <div className="font-medium">{t.title}</div>
                        <div className="text-xs text-muted mt-1">{t.description?.slice(0,60)}</div>
                        <div className="mt-2"><Badge variant={t.priority==='HIGH'?'red':t.priority==='MEDIUM'?'yellow':'green'}>{t.priority}</Badge></div>
                      </td>
                      <td className="py-4 px-6 small text-muted">{t.assigneeName || <span className="italic text-orange-400">Unassigned</span>}</td>
                      <td className="py-4 px-6">
                        <div className={`text-xs px-2 py-1 rounded-full font-medium ${t.status==='COMPLETED'?'bg-green-100 text-green-700':t.status==='IN_PROGRESS'?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-700'}`}>{t.status.replace('_',' ')}</div>
                      </td>
                      <td className="py-4 px-6 small text-muted">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
                      <td className="py-4 px-6"><button onClick={()=>handleDelete(t.id)} className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
