import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AdminAuthContext';
import Button from '../ui/Button';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left section - Mobile menu button + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          <h2 className="hidden sm:block text-lg font-semibold text-gray-800">
            Patlinks Admin
          </h2>
        </div>

        {/* Right section - Admin info + Logout */}
        <div className="flex items-center gap-4">
          {admin && (
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-700">
                {admin.username}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {admin.role}
              </span>
            </div>
          )}

          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
