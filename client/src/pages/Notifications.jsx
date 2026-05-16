import { Bell, CheckCircle2, Clock, MessageSquare, Filter, Trash2, MoreVertical, Calendar } from 'lucide-react';

const Notifications = () => {
  const notifications = [
    { id: 1, title: 'New task assigned', desc: 'You have been assigned to "Dashboard UI" in TaskSync project.', time: '2 min ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', read: false },
    { id: 2, title: 'Project update', desc: 'Rahul moved "API Setup" to In Progress in Backend project.', time: '1 hour ago', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', read: false },
    { id: 3, title: 'New comment', desc: 'Priya replied to your comment on "Task Creation Flow".', time: '3 hours ago', icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', read: true },
    { id: 4, title: 'System Alert', desc: 'Maintenance scheduled for tonight at 12:00 AM.', time: '5 hours ago', icon: Bell, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/20', read: true },
    { id: 5, title: 'Task completed', desc: 'Suresh marked "Authentication" as completed.', time: '1 day ago', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', read: true },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-foreground)] tracking-tight">Notifications</h1>
          <p className="text-slate-500 mt-1 font-medium">Keep track of your latest team activities.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 hover:text-[var(--color-foreground)] hover:bg-[var(--color-secondary)] rounded-xl transition-all border border-transparent hover:border-[var(--color-border)]">
            <Trash2 size={16} /> Mark all as read
          </button>
          <button className="p-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-slate-500 hover:text-[var(--color-foreground)] transition-colors">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-sm">
        {notifications.map((n, index) => (
          <div 
            key={n.id} 
            className={`p-6 flex gap-6 hover:bg-[var(--color-secondary)] transition-all cursor-pointer relative group ${
              index !== notifications.length - 1 ? 'border-b border-[var(--color-border)]' : ''
            } ${!n.read ? 'bg-[var(--color-secondary)]/30' : ''}`}
          >
            {/* Read indicator */}
            {!n.read && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[var(--color-primary)] rounded-r-full"></div>
            )}

            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl ${n.bg} ${n.color} flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
              <n.icon size={24} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`text-lg font-bold tracking-tight ${!n.read ? 'text-[var(--color-foreground)]' : 'text-slate-700 dark:text-slate-300'}`}>
                  {n.title}
                </h3>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={12} />
                  {n.time}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                {n.desc}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center">
              <button className="p-2 text-slate-300 hover:text-slate-500 rounded-lg hover:bg-[var(--color-card)] transition-all opacity-0 group-hover:opacity-100">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={40} />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-foreground)]">All caught up!</h3>
            <p className="text-slate-500">No new notifications at the moment.</p>
          </div>
        )}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <button className="px-8 py-3 bg-[var(--color-secondary)] hover:bg-[var(--color-secondary-hover)] text-[var(--color-foreground)] font-black rounded-2xl transition-all shadow-sm">
          Load Older Notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
