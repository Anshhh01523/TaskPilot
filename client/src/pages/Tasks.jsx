import { useEffect, useState } from 'react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { 
  CheckCircle2, Clock, ListTodo, Search, 
  Calendar, User, AlertCircle, ChevronRight, 
  MoreVertical, ArrowUpRight, MessageSquare, X, Send
} from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [commentModal, setCommentModal] = useState({ isOpen: false, taskId: null, text: '' });
  const { user } = useAuthStore();

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
      setError('Could not load tasks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error('Failed to update task status', err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    const { taskId, text } = commentModal;
    if (text && text.trim()) {
      try {
        await api.post(`/tasks/${taskId}/comments`, { text: text.trim() });
        setCommentModal({ isOpen: false, taskId: null, text: '' });
        fetchTasks();
      } catch (err) {
        console.error('Failed to add comment', err);
        alert(err.response?.data?.message || 'Failed to add comment');
      }
    }
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [
    { id: 'TODO', label: 'To Do', icon: ListTodo, color: 'text-slate-400' },
    { id: 'IN_PROGRESS', label: 'In Progress', icon: Clock, color: 'text-amber-500' },
    { id: 'DONE', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-foreground)] tracking-tight">Tasks</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and track all team activities.</p>
        </div>
        
        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold animate-pulse">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
          <div className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search all tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl py-3 pl-12 pr-4 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {categories.map(category => (
          <div key={category.id} className="flex flex-col gap-5">
            {/* Column Header */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-[var(--color-secondary)] ${category.color}`}>
                  <category.icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-foreground)] tracking-tight">{category.label}</h3>
                <span className="bg-[var(--color-secondary)] text-[var(--color-foreground)] text-xs font-black px-2.5 py-1 rounded-lg">
                  {filteredTasks.filter(t => t.status === category.id).length}
                </span>
              </div>
            </div>

            {/* Task List */}
            <div className="space-y-4 min-h-[500px]">
              {filteredTasks.filter(t => t.status === category.id).map(task => (
                <div 
                  key={task.id} 
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-premium transition-all group cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                        task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="relative group/menu">
                      <button className="text-slate-400 hover:text-[var(--color-foreground)] p-1 rounded-lg hover:bg-[var(--color-secondary)] transition-colors">
                        <MoreVertical size={16} />
                      </button>
                      <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-premium opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-[var(--color-secondary)] border-b border-[var(--color-border)]">Move to</div>
                        {['TODO', 'IN_PROGRESS', 'DONE'].filter(s => s !== task.status).map(s => (
                          <button 
                            key={s}
                            onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, s); }}
                            className="w-full text-left px-3 py-2.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-[var(--color-primary)] hover:text-[var(--color-primary-foreground)] font-bold transition-colors"
                          >
                            {s === 'DONE' ? 'Completed' : s.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors mb-2 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {task.description || 'No description provided.'}
                  </p>

                  {(() => {
                    let commentsList = [];
                    if (typeof task.comments === 'string') {
                      try { commentsList = JSON.parse(task.comments); } catch (e) {}
                    } else if (Array.isArray(task.comments)) {
                      commentsList = task.comments;
                    }
                    return commentsList.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mb-4 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                          <MessageSquare size={12} /> {commentsList.length} Comments
                        </div>
                      </div>
                      <div className="space-y-2">
                        {commentsList.slice(-2).map(comment => (
                          <div key={comment._id || comment.id || Math.random()} className="text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 mr-1">{comment.author?.name}:</span>
                            <span className="text-slate-600 dark:text-slate-400">"{comment.text}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )})()}

                  <div className="flex items-center justify-between pt-5 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <Calendar size={14} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.assignedTo ? (
                        <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-[10px] font-black text-[var(--color-primary-foreground)]" title={task.assignedTo.name}>
                          {task.assignedTo.name.charAt(0).toUpperCase()}
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[var(--color-secondary)] border-dashed border border-[var(--color-border)] flex items-center justify-center text-slate-400">
                          <User size={12} />
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => setCommentModal({ isOpen: true, taskId: task.id, text: '' })} 
                    className="w-full mt-4 py-2 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-500 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 transition-all text-center"
                  >
                    + Add Comment
                  </button>
                </div>
              ))}
              
              {filteredTasks.filter(t => t.status === category.id).length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 bg-[var(--color-secondary)]/30 rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                  <category.icon size={32} className="text-slate-300 mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No tasks in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comment Modal */}
      {commentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setCommentModal({ isOpen: false, taskId: null, text: '' })} 
              className="absolute top-4 right-4 text-slate-400 hover:text-[var(--color-foreground)] transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6">Add Comment</h2>
            <form onSubmit={handleAddComment} className="space-y-4">
              <div>
                <textarea 
                  autoFocus
                  value={commentModal.text}
                  onChange={(e) => setCommentModal({...commentModal, text: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 min-h-[120px] resize-none"
                  placeholder="Type your message here..."
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={!commentModal.text.trim()}
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={16} />
                Post Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
