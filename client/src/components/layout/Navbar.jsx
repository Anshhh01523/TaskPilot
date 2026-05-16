import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Moon, Sun, User, Settings, LogOut, CheckCircle2, MessageSquare, Clock, FolderKanban, CheckSquare, X, Users } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import api from '../../lib/axios';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const searchRef = useRef(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark', !isDarkMode);
  };

  useEffect(() => {
    // Fetch all users for search if logged in
    if (user) {
      api.get('/auth/users').then(res => setAllUsers(res.data)).catch(() => {});
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTasks = searchQuery ? tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];
  const filteredProjects = searchQuery ? projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];
  const filteredPeople = searchQuery ? allUsers.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3) : [];

  const notifications = [
    { id: 1, title: 'New task assigned', desc: 'You have been assigned to "Dashboard UI"', time: '2 min ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { id: 2, title: 'Project update', desc: 'Rahul moved "API Setup" to In Progress', time: '1 hour ago', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 3, title: 'New comment', desc: 'Priya replied to your comment', time: '3 hours ago', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="h-20 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-8">
      <div className="flex items-center gap-6 flex-1">
        <button className="lg:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
          <Menu size={20} />
        </button>
        <div ref={searchRef} className="relative w-96 hidden md:block animate-in fade-in slide-in-from-left-2 duration-300 z-50">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(true);
            }}
            onFocus={() => setShowSearchResults(true)}
            placeholder="Search tasks, projects, or people..." 
            className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-2.5 pl-10 pr-10 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all shadow-sm"
          />
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={14} />
            </button>
          )}

          {/* Search Results Dropdown */}
          {showSearchResults && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-premium overflow-hidden max-h-96 overflow-y-auto">
              {filteredTasks.length === 0 && filteredProjects.length === 0 && filteredPeople.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No results found for "{searchQuery}"
                </div>
              ) : (
                <>
                  {filteredProjects.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-[var(--color-secondary)]">Projects</div>
                      {filteredProjects.map(project => (
                        <Link 
                          key={`proj-${project._id}`}
                          to={`/projects/${project._id}`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-secondary)] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 flex items-center justify-center flex-shrink-0">
                            <FolderKanban size={14} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-[var(--color-foreground)] truncate group-hover:text-indigo-600 transition-colors">{project.title}</p>
                            <p className="text-xs text-slate-500 truncate">{project.members?.length || 0} members</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {filteredTasks.length > 0 && (
                    <div className="py-2 border-t border-[var(--color-border)]">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-[var(--color-secondary)]">Tasks</div>
                      {filteredTasks.map(task => (
                        <Link 
                          key={`task-${task._id}`}
                          to={`/tasks`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-secondary)] transition-colors group"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            task.status === 'DONE' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500' :
                            task.status === 'IN_PROGRESS' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500' :
                            'bg-slate-50 dark:bg-slate-800 text-slate-500'
                          }`}>
                            <CheckSquare size={14} />
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-[var(--color-foreground)] truncate group-hover:text-indigo-600 transition-colors">{task.title}</p>
                            <p className="text-xs text-slate-500 truncate">{task.status.replace('_', ' ')}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {filteredPeople.length > 0 && (
                    <div className="py-2 border-t border-[var(--color-border)]">
                      <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider bg-[var(--color-secondary)]">People</div>
                      {filteredPeople.map(person => (
                        <Link 
                          key={`person-${person._id}`}
                          to={user?.role === 'Admin' ? `/team` : `/settings`}
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--color-secondary)] transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                            {person.avatar ? (
                              <img src={person.avatar} alt={person.name} className="w-full h-full object-cover" />
                            ) : (
                              person.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-semibold text-[var(--color-foreground)] truncate group-hover:text-indigo-600 transition-colors">{person.name}</p>
                            <p className="text-xs text-slate-500 truncate">{person.role}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full ${showNotifications ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
              <div className="absolute right-0 mt-3 w-80 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-premium z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between bg-[var(--color-secondary)]">
                  <h3 className="text-sm font-bold text-[var(--color-foreground)]">Notifications</h3>
                  <span className="text-[10px] font-bold bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-2 py-0.5 rounded-full uppercase tracking-wider">3 New</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-700/50 last:border-0 group">
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-xl ${n.bg} ${n.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <n.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{n.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.desc}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/notifications" 
                  onClick={() => setShowNotifications(false)}
                  className="block w-full py-3 text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-colors border-t border-[var(--color-border)] text-center"
                >
                  View All Notifications
                </Link>
              </div>
            </>
          )}
        </div>

        <button 
          onClick={toggleTheme}
          className="relative text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="pl-4 ml-1 border-l border-[var(--color-border)] flex items-center">
          <div className="relative group cursor-pointer">
            <Link to="/settings" className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-background)] font-bold shadow-sm ring-2 ring-[var(--color-background)] dark:ring-[var(--color-card)] cursor-pointer hover:ring-[var(--color-primary)] transition-all overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name.charAt(0).toUpperCase() : 'G'
              )}
            </Link>
            
            <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-secondary)]">
                <p className="text-sm font-bold text-[var(--color-foreground)]">{user?.name || 'Guest'}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@tasksync.com'}</p>
              </div>
              <div className="p-1">
                <Link to="/settings" className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                  <Settings size={14} /> Profile Settings
                </Link>
                <button onClick={logout} className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors mt-1">
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
