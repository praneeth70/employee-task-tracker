import { useEffect, useState } from 'react';
import api from '../api/axios';
import { UserPlus, Trash2 } from 'lucide-react';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', department: '', jobTitle: '' });

  // Load employees on page start
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return alert("Name and Email are required!");

    try {
      await api.post('/employees', form);
      setForm({ name: '', email: '', phone: '', department: '', jobTitle: '' }); // Clear form
      fetchEmployees(); // Refresh list
    } catch (err) {
      alert("Error adding employee (Email might be duplicate)");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <UserPlus className="w-6 h-6 text-blue-600" /> Employee Directory
      </h2>

      {/* --- ADD EMPLOYEE FORM --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Add New Employee</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input 
            type="text" placeholder="Full Name" required 
            className="border p-2 rounded focus:outline-blue-500"
            value={form.name} onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            type="email" placeholder="Email Address" required 
            className="border p-2 rounded focus:outline-blue-500"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            type="text" placeholder="Phone" 
            className="border p-2 rounded focus:outline-blue-500"
            value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
          />
          <input 
            type="text" placeholder="Department" required 
            className="border p-2 rounded focus:outline-blue-500"
            value={form.department} onChange={e => setForm({...form, department: e.target.value})}
          />
          <input 
            type="text" placeholder="Job Title" required 
            className="border p-2 rounded focus:outline-blue-500"
            value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})}
          />
          <button type="submit" className="bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition">
            + Add Employee
          </button>
        </form>
      </div>

      {/* --- EMPLOYEES LIST --- */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Contact</th>
              <th className="py-3 px-6">Role</th>
              <th className="py-3 px-6">Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No employees found.</td></tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-6 font-medium text-gray-800">{emp.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-500">
                    <div>{emp.email}</div>
                    <div className="text-xs text-gray-400">{emp.phone}</div>
                  </td>
                  <td className="py-3 px-6 text-sm">{emp.jobTitle}</td>
                  <td className="py-3 px-6">
                    <span className="bg-blue-50 text-blue-700 py-1 px-3 rounded-full text-xs font-medium">
                      {emp.department}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}