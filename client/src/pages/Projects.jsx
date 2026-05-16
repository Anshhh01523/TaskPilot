import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjectStore } from '../store/projectStore';
import { useAuthStore } from '../store/authStore';
import { Plus, MoreVertical, FolderKanban, Trash2, Edit3, Eye, Calendar, Users, X, Search } from 'lucide-react';
import api from '../lib/axios';

const Projects = () => {
  const { projects, fetchProjects, createProject, deleteProject, loading } = useProjectStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [search, setSearch] = useState('');
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    members: [],
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchProjects();
    // Fetch all users for the member picker
    api.get('/auth/users').then(res => setAllUsers(res.data)).catch(() => {});
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    if (!newProject.title.trim()) return;
    const success = await createProject({
      title: newProject.title,
      description: newProject.description,
      members: newProject.members,
    });
    if (success) {
      setShowModal(false);
      setNewProject({ title: '', description: '', members: [], startDate: '', endDate: '' });
      fetchProjects();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will remain.')) {
      await deleteProject(id);
      setOpenMenuId(null);
    }
  };

  const toggleMember = (userId) => {
    setNewProject(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId],
    }));
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Projects</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your team's projects.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm shadow-indigo-200 w-fit"
            >
              <Plus size={18} />
              New Project
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div key={project._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 shadow-sm hover:shadow-premium transition-all group flex flex-col h-full relative">
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FolderKanban size={24} />
              </div>
              
              {/* 3-dot menu */}
              <div className="relative">
                <button 
                  onClick={() => setOpenMenuId(openMenuId === project._id ? null : project._id)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                
                {openMenuId === project._id && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-lg z-30 overflow-hidden">
                    <Link 
                      to={`/projects/${project._id}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      <Eye size={15} className="text-slate-400" /> View Board
                    </Link>
                    {user?.role === 'Admin' && (
                      <button 
                        onClick={() => handleDelete(project._id)}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={15} /> Delete Project
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-[var(--color-foreground)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">{project.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex-1 mb-8 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
            
            <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-700 mt-auto">
              <div className="flex -space-x-2">
                {(project.members || []).slice(0, 3).map((member, i) => (
                  <div key={member._id} className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 border-2 border-white dark:border-slate-800 flex items-center justify-center text-white text-[10px] font-bold shadow-sm z-10 overflow-hidden" style={{ zIndex: 10 - i }} title={member.name}>
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      member.name.charAt(0).toUpperCase()
                    )}
                  </div>
                ))}
                {(project.members || []).length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 text-[10px] font-bold z-0">
                    +{project.members.length - 3}
                  </div>
                )}
                {(project.members || []).length === 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 italic">No members</span>
                )}
              </div>
              
              <Link 
                to={`/projects/${project._id}`}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-lg transition-colors border border-indigo-100/50 dark:border-indigo-800/30"
              >
                View Board
              </Link>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
              <FolderKanban className="text-slate-400 dark:text-slate-500" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">No projects yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Get started by creating your first project and collaborating with your team.</p>
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(false); setNewProject({ title: '', description: '', members: [], startDate: '', endDate: '' }); }}>
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Project</h2>
              <button onClick={() => { setShowModal(false); setNewProject({ title: '', description: '', members: [], startDate: '', endDate: '' }); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-5">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Project Name *</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" 
                  placeholder="E.g. Website Redesign" 
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea 
                  rows={3} 
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400" 
                  placeholder="Briefly describe the project goals..."
                ></textarea>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> Start Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> End Date</span>
                  </label>
                  <input 
                    type="date" 
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Members */}
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5"><Users size={14} /> Team Members</span>
                </label>
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1">
                  {allUsers.length > 0 ? allUsers.map(u => (
                    <label key={u._id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={newProject.members.includes(u._id)} 
                        onChange={() => toggleMember(u._id)} 
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500/20"
                      />
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        ) : (
                          u.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{u.name}</span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">{u.email}</span>
                      </div>
                    </label>
                  )) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-2 italic">No users available</p>
                  )}
                </div>
                {newProject.members.length > 0 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{newProject.members.length} member{newProject.members.length > 1 ? 's' : ''} selected</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button onClick={() => { setShowModal(false); setNewProject({ title: '', description: '', members: [], startDate: '', endDate: '' }); }} className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold transition-colors">Cancel</button>
                <button onClick={handleCreateProject} disabled={loading || !newProject.title.trim()} className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50">{loading ? 'Creating...' : 'Create Project'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
