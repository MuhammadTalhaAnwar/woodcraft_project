import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  UserSquare, 
  ClipboardList, 
  Receipt,
  LogOut,
  Hammer
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);

  const adminLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/inventory', label: 'Inventory', icon: Package },
    { to: '/employees', label: 'Employees', icon: UserSquare },
    { to: '/orders', label: 'Orders', icon: ClipboardList },
    { to: '/invoices', label: 'Invoices', icon: Receipt },
  ];

  const employeeLinks = [
    { to: '/my-tasks', label: 'My Tasks', icon: ClipboardList },
  ];

  const links = user?.role === 'admin' ? adminLinks : employeeLinks;

  return (
    <div className="w-64 bg-surface border-r border-border h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 flex items-center gap-3 border-b border-border">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Hammer className="text-primary" size={24} />
        </div>
        <h1 className="text-xl font-bold text-primary">The Woodcraft</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-text hover:bg-primary/5 hover:text-primary'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-danger hover:bg-danger/10 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
