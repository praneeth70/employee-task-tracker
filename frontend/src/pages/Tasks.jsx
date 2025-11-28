import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Filter, Calendar } from 'lucide-react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ status: '', employeeId: '' });
  
  const [newTask, setNewTask] = useState({
    title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', employeeId: ''
  });

  // Load Data
  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, [filters]); // Re-run when filters change

  const fetchTasks = async () => {
    try {
      // Build query string like /tasks?status=TODO&employeeId=123
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) { console.error("Failed to load employees"); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '', status: 'TODO', priority: 'MEDIUM', dueDate: '', employeeId: '' });
      fetchTasks();
    } catch (err) {
      alert("Error creating task");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) { alert("Error deleting task"); }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-blue-600" /> Task Board
      </h2>

      {/* --- CONTROLS SECTION (Add + Filter) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* ADD TASK FORM */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-semibold mb-4 text-gray-700">Create New Task</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input 
              className="w-full border p-2 rounded focus:outline-blue-500" placeholder="Task Title" required
              value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
            />
            <textarea 
              className="w-full border p-2 rounded focus:outline-blue-500" placeholder="Description" rows="2"
              value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2">
              <select className="border p-2 rounded focus:outline-blue-500" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High Priority</option>
              </select>
              <input type="date" className="border p-2 rounded focus:outline-blue-500" required value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
            </div>
            
            <select className="w-full border p-2 rounded focus:outline-blue-500" value={newTask.employeeId} onChange={e => setNewTask({...newTask, employeeId: e.target.value})}>
              <option value="">-- Assign to Employee --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition">
              + Create Task
            </button>
          </form>
        </div>

        {/* TASK LIST + FILTERS */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Filter By:</span>
            <select className="border p-2 rounded text-sm focus:outline-blue-500" value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <select className="border p-2 rounded text-sm focus:outline-blue-500" value={filters.employeeId} onChange={e => setFilters({...filters, employeeId: e.target.value})}>
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
                {tasks.length === 0 ? (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-400">No tasks found.</td></tr>
                ) : (
                  tasks.map(task => (
                    <tr key={task.id} className="hover:bg-gray-50 transition">
                      <td className="py-3 px-6">
                        <div className="font-medium text-gray-800">{task.title}</div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                          task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-600">
                        {task.assigneeName || <span className="text-orange-400 italic text-xs">Unassigned</span>}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-6">
                        <button onClick={() => handleDelete(task.id)} className="text-red-400 hover:text-red-600 transition p-2 rounded hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}