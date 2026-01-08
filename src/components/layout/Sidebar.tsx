import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  ChefHat,
  UtensilsCrossed,
  FolderTree,
  Table2,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Orders', path: '/orders', icon: ShoppingCart },
  { name: 'Kitchen', path: '/kitchen', icon: ChefHat },
  { name: 'Menu', path: '/menu', icon: UtensilsCrossed },
  { name: 'Categories', path: '/categories', icon: FolderTree },
  { name: 'Tables', path: '/tables', icon: Table2 },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
            <h1 className="text-xl font-bold text-blue-600">Patlinks Admin</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs text-gray-500 text-center">
              Patlinks v1.0.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
