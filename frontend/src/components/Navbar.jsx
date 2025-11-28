import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare } from 'lucide-react';

export default function Navbar(){
  const location = useLocation();
  const getLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-150 ${
      location.pathname === path
        ? "text-blue-600 bg-blue-50 shadow-sm"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="bg-white sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-lg font-semibold">TaskTracker</div>
            <div className="text-xs text-muted">Employee Task Management</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link to="/" className={getLinkClass('/')}>
            <LayoutDashboard className="w-4 h-4" /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/employees" className={getLinkClass('/employees')}>
            <Users className="w-4 h-4" /> <span className="hidden md:inline">Employees</span>
          </Link>
          <Link to="/tasks" className={getLinkClass('/tasks')}>
            <CheckSquare className="w-4 h-4" /> <span className="hidden md:inline">Tasks</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
