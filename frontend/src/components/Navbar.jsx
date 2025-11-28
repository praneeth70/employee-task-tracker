import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare } from 'lucide-react';

export default function Navbar() {
  const location = useLocation(); // Hook to get current page

  // Helper to style active links (Fix #9)
  const getLinkClass = (path) => 
    `flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
      location.pathname === path
        ? "text-blue-600 bg-blue-50 shadow-sm" // Active State
        : "text-gray-500 hover:text-blue-600 hover:bg-gray-50" // Inactive State
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50"> {/* Fix #7: Sticky & Clean */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 tracking-tight">TaskTracker</span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-2">
          <Link to="/" className={getLinkClass('/')}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </Link>
          <Link to="/employees" className={getLinkClass('/employees')}>
            <Users className="w-4 h-4" /> Employees
          </Link>
          <Link to="/tasks" className={getLinkClass('/tasks')}>
            <CheckSquare className="w-4 h-4" /> Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}