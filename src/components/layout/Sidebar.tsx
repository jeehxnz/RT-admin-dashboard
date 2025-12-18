import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  Mail, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/bonus-codes', icon: Ticket, label: 'Bonus Codes' },
  { to: '/send-club', icon: Mail, label: 'Send to Club' },
  { to: '/send-telegram', icon: Mail, label: 'Send Telegram' },
];

export function Sidebar() {
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-[--color-surface] text-[--color-text] hover:bg-[--color-surface-hover] transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-[--color-surface] border-r border-[--color-border]
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[--color-border]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[--color-accent] flex items-center justify-center">
              <span className="font-bold text-[--color-background]">RT</span>
            </div>
            <span className="font-semibold text-lg">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[--color-accent]/10 text-[--color-accent]'
                    : 'text-[--color-text-muted] hover:bg-[--color-surface-hover] hover:text-[--color-text]'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-6 border-t border-[--color-border]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-[--color-text-muted] hover:bg-[--color-danger]/10 hover:text-[--color-danger] transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

