import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, FolderKanban, Users, Settings, MessageSquare, Calendar, PieChart, Crown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const adminItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const memberItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Profile', path: '/settings', icon: Settings }, // Profile maps to settings
  ];

  const navItems = user?.role === 'Admin' ? adminItems : memberItems;

  return (
    <div className="w-64 bg-[var(--color-card)] border-r border-[var(--color-border)] h-screen flex flex-col transition-all duration-300">
      <Link to="/" className="p-6 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-secondary)] hover:bg-[var(--color-border)]/10 transition-colors">
        <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] flex items-center justify-center font-bold text-[var(--color-background)] shadow-md">
          <CheckSquare size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">TaskPilot</span>
      </Link>

      <div className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.filter(item => !item.adminOnly || user?.role === 'Admin').map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] font-bold shadow-sm' 
                  : 'text-slate-500 hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)] font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-[var(--color-primary-foreground)]' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300 transition-colors'} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4">

        <Link to="/settings" className="flex items-center justify-between px-2 py-2 hover:bg-[var(--color-secondary)] rounded-xl transition-colors group border border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-background)] font-bold shadow-sm overflow-hidden group-hover:shadow-md transition-all">
              {user?.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'G'
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight group-hover:text-[var(--color-primary)] transition-colors">{user?.name || 'Guest'}</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{user?.email || 'admin@tasksync.com'}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
