import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare } from 'lucide-react';

export default function Navbar(){
  const location = useLocation();
  const active = (p) => location.pathname === p ? 'text-blue-600 bg-white shadow' : 'text-gray-600 hover:text-blue-600';

  return (
    <header className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-sm">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">TaskTracker</div>
            <div className="text-xs text-muted">Employee Task Management</div>
          </div>
        </div>

        <nav className="flex items-center gap-2 bg-white/50 p-1 rounded-md">
          <Link to="/" className={`flex items-center gap-2 px-3 py-2 rounded-md ${active('/')}`}>
            <LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/employees" className={`flex items-center gap-2 px-3 py-2 rounded-md ${active('/employees')}`}>
            <Users className="w-4 h-4" /> <span className="hidden md:inline">Employees</span>
          </Link>
          <Link to="/tasks" className={`flex items-center gap-2 px-3 py-2 rounded-md ${active('/tasks')}`}>
            <CheckSquare className="w-4 h-4" /> <span className="hidden md:inline">Tasks</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
