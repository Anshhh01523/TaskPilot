import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Plus, MoreHorizontal, Calendar, ArrowLeft, MessageSquare, X, Send } from 'lucide-react';

const KanbanColumn = ({ title, status, tasks, colorClass, onStatusChange, onAddComment }) => {
  const { user } = useAuthStore();
  return (
    <div className="flex-1 min-w-[320px] max-w-[400px] flex flex-col bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-4 border border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
          <h3 className="font-bold text-slate-800 dark:text-slate-200">{title}</h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-full shadow-sm">
            {tasks.length}
          </span>
        </div>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => onStatusChange(null, status)} 
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all shadow-sm shadow-transparent hover:shadow-slate-200/50"
            title="Add task in this column"
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide pb-4">
        {tasks.map(task => (
          <div 
            key={task._id} 
            className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 p-4 rounded-xl shadow-sm hover:shadow-premium transition-all cursor-grab active:cursor-grabbing group relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                task.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' :
                task.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' :
                'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
              }`}>
                {task.priority || 'Medium'}
              </div>
              <div className="relative group/menu">
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-premium opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-20 overflow-hidden">
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">Move to</div>
                  {['TODO', 'IN_PROGRESS', 'DONE'].filter(s => s !== status).map(s => (
                    <button 
                      key={s}
                      onClick={() => onStatusChange(task._id, s)}
                      className="w-full text-left px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
                    >
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <h4 className="text-slate-800 dark:text-slate-100 font-bold text-sm mb-1.5 leading-snug">{task.title}</h4>
            {task.description && (
              <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 mb-3 leading-relaxed">{task.description}</p>
            )}

            {task.comments && task.comments.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg mb-3">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold mb-1"><MessageSquare size={10} /> {task.comments.length} Comments</div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic">"{task.comments[task.comments.length - 1].text}"</p>
              </div>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
              <div className="flex -space-x-1.5">
                {task.assignedTo && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold shadow-sm" title={task.assignedTo.name}>
                    {task.assignedTo.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {task.dueDate && (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-medium bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded-md border border-slate-100 dark:border-slate-700">
                  <Calendar size={12} className="text-slate-400 dark:text-slate-500" />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
            </div>
            
            <button onClick={() => setCommentModal({ isOpen: true, taskId: task._id, text: '' })} className="w-full mt-3 py-1.5 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all text-center">
              + Add Comment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectBoard = () => {
  const { projectId } = useParams();
  const { tasks, fetchTasks, updateTaskStatus, addComment, createTask, loading: tasksLoading } = useTaskStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { user } = useAuthStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState('TODO');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    assignedTo: '',
    dueDate: ''
  });
  const [commentModal, setCommentModal] = useState({ isOpen: false, taskId: null, text: '' });
  
  useEffect(() => {
    fetchTasks(projectId);
    if (projects.length === 0) fetchProjects();
  }, [fetchTasks, fetchProjects, projectId, projects.length]);

  const project = projects.find(p => p._id === projectId);

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-200 dark:border-indigo-900/30 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!project) return <div className="text-slate-600 dark:text-slate-400 font-medium">Project not found.</div>;

  const handleAddComment = async (e) => {
    e.preventDefault();
    const { taskId, text } = commentModal;
    if (text && text.trim()) {
      await addComment(taskId, text.trim());
      setCommentModal({ isOpen: false, taskId: null, text: '' });
    }
  };

  const handleOpenModal = (status = 'TODO') => {
    setDefaultStatus(status);
    setNewTaskData({ title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: '' });
    setIsModalOpen(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim()) return;
    
    const success = await createTask({
      ...newTaskData,
      status: defaultStatus,
      projectId
    });
    
    if (success) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-[1600px] mx-auto">
      <div className="mb-8">
        <Link to="/projects" className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-3 text-sm font-medium w-fit transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
              {project.title}
              <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/30 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">Active</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 mr-2">
              {project.members.map((member, i) => (
                <div key={member._id} className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-[var(--color-background)] flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ zIndex: 10 - i }} title={member.name}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
            {user?.role === 'Admin' && (
              <button 
                onClick={() => handleOpenModal('TODO')}
                className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-indigo-200"
              >
                <Plus size={18} />
                New Task
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
        <KanbanColumn 
          title="To Do" 
          status="TODO" 
          tasks={todoTasks} 
          colorClass="bg-slate-400" 
          onStatusChange={(taskId, status) => taskId ? updateTaskStatus(taskId, status) : handleOpenModal(status)}
          onAddComment={handleAddComment}
        />
        <KanbanColumn 
          title="In Progress" 
          status="IN_PROGRESS" 
          tasks={inProgressTasks} 
          colorClass="bg-amber-400" 
          onStatusChange={(taskId, status) => taskId ? updateTaskStatus(taskId, status) : handleOpenModal(status)}
          onAddComment={handleAddComment}
        />
        <KanbanColumn 
          title="Done" 
          status="DONE" 
          tasks={doneTasks} 
          colorClass="bg-emerald-400" 
          onStatusChange={(taskId, status) => taskId ? updateTaskStatus(taskId, status) : handleOpenModal(status)}
          onAddComment={handleAddComment}
        />
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

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-[var(--color-foreground)] transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-6">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Title</label>
                <input 
                  type="text" 
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Task title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Description</label>
                <textarea 
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)] min-h-[80px]"
                  placeholder="Task description (optional)"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Priority</label>
                  <select 
                    value={newTaskData.priority}
                    onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})}
                    className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskData.dueDate}
                    onChange={(e) => setNewTaskData({...newTaskData, dueDate: e.target.value})}
                    className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 mb-1">Assignee</label>
                <select 
                  value={newTaskData.assignedTo}
                  onChange={(e) => setNewTaskData({...newTaskData, assignedTo: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl py-2 px-3 text-sm text-[var(--color-foreground)] focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Unassigned</option>
                  {project.members.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <button 
                type="submit"
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-2.5 rounded-xl transition-colors mt-6"
              >
                Create Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectBoard;
