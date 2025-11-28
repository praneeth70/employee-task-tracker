import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Filter, Calendar, Search } from 'lucide-react';

export default function Tasks(){
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ status:'', employeeId:'', q:'' });
  const [newTask, setNewTask] = useState({ title:'', description:'', status:'TODO', priority:'MEDIUM', dueDate:'', employeeId:'' });

  useEffect(()=> { fetchEmployees(); fetchTasks(); }, []);
  useEffect(()=> { const t = setTimeout(()=> fetchTasks(), 250); return ()=> clearTimeout(t); }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data);
    } catch(err){ console.error(err); }
  };

  const fetchEmployees = async () => {
    try { const res = await api.get('/employees'); setEmployees(res.data); } catch(err){ console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/tasks', newTask); setNewTask({ title:'', description:'', status:'TODO', priority:'MEDIUM', dueDate:'', employeeId:'' }); fetchTasks(); }
    catch(err){ alert('Error'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try { await api.delete(`/tasks/${id}`); fetchTasks(); } catch(err){ alert('Error deleting'); }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3"><Calendar className="w-6 h-6 text-blue-600" /> Task Board</h2>
        <div className="flex gap-3">
          <div className="relative">
            <input className="border p-2 rounded pl-10 focus:outline-blue-500" placeholder="Search tasks..." value={filters.q} onChange={e=> setFilters({...filters, q:e.target.value})} />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 rounded-xl h-fit">
          <h3 className="font-semibold mb-4">Create New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={newTask.title} onChange={e=> setNewTask({...newTask, title:e.target.value})} className="w-full border p-2 rounded" placeholder="Task title" required />
            <textarea value={newTask.description} onChange={e=> setNewTask({...newTask, description:e.target.value})} className="w-full border p-2 rounded" placeholder="Description" rows="2" />
            <div className="grid grid-cols-2 gap-2">
              <select value={newTask.priority} onChange={e=> setNewTask({...newTask, priority:e.target.value})} className="border p-2 rounded">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <input type="date" value={newTask.dueDate} onChange={e=> setNewTask({...newTask, dueDate:e.target.value})} className="border p-2 rounded" />
            </div>
            <select value={newTask.employeeId} onChange={e=> setNewTask({...newTask, employeeId:e.target.value})} className="w-full border p-2 rounded">
              <option value="">-- Assign to Employee --</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Create Task
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4 items-center card p-4 rounded-xl">
            <Filter className="w-5 h-5 text-muted" />
            <span className="text-sm font-medium text-muted">Filter:</span>

            <select className="border p-2 rounded text-sm" value={filters.status} onChange={e=> setFilters({...filters, status:e.target.value})}>
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select className="border p-2 rounded text-sm" value={filters.employeeId} onChange={e=> setFilters({...filters, employeeId:e.target.value})}>
              <option value="">All Employees</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
            </select>
          </div>

          <div className="card rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="py-3 px-6">Task</th>
                  <th className="py-3 px-6">Assignee</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Due</th>
                  <th className="py-3 px-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tasks.length===0 ? (
                  <tr><td colSpan="5" className="text-center py-12 text-gray-400">No tasks yet. Create your first task on the left.</td></tr>
                ) : tasks.map(task => (
                  <tr key={task.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6">
                      <div className="font-medium text-gray-800">{task.title}</div>
                      <div className="text-xs text-muted mt-1">{task.description?.slice(0,60)}</div>
                      <div className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded font-bold ${
                        task.priority==='HIGH' ? 'bg-red-100 text-red-700' :
                        task.priority==='MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}>{task.priority}</div>
                    </td>
                    <td className="py-3 px-6 text-sm text-muted">{task.assigneeName || <span className="italic text-xs text-orange-400">Unassigned</span>}</td>
                    <td className="py-3 px-6">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        task.status==='COMPLETED' ? 'bg-green-100 text-green-700' :
                        task.status==='IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>{task.status.replace('_',' ')}</span>
                    </td>
                    <td className="py-3 px-6 text-sm text-muted">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</td>
                    <td className="py-3 px-6">
                      <button onClick={()=> handleDelete(task.id)} className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
