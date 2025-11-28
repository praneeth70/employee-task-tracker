import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <CheckSquare className="w-6 h-6" />
          TaskTracker
        </h1>
        <div className="flex gap-6">
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/employees" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
            <Users className="w-4 h-4" /> Employees
          </Link>
          <Link to="/tasks" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium">
            <CheckSquare className="w-4 h-4" /> Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}