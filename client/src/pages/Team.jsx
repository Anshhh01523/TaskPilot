import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Users, Mail, Shield, ShieldCheck, Search, MoreVertical, Calendar, Plus, X } from 'lucide-react';
import api from '../lib/axios';

const Team = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [addLoading, setAddLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const res = await api.get('/auth/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsersList();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setMsg({ type: '', text: '' });
    try {
      await api.post('/auth/users', newMember);
      setMsg({ type: 'success', text: 'Member added successfully!' });
      setShowAddModal(false);
      setNewMember({ name: '', email: '', password: '', role: 'Member' });
      fetchUsers();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add member' });
    } finally {
      setAddLoading(false);
    }
  };

  const avatarGradients = [
    'from-indigo-400 to-indigo-600',
    'from-emerald-400 to-emerald-600',
    'from-purple-400 to-purple-600',
    'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-600',
    'from-pink-400 to-rose-500',
    'from-teal-400 to-cyan-600',
    'from-red-400 to-red-600',
  ];

  const getGradient = (index) => avatarGradients[index % avatarGradients.length];

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const admins = filteredUsers.filter(u => u.role === 'Admin');
  const members = filteredUsers.filter(u => u.role === 'Member');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-[var(--color-border)] border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Team</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{users.length} member{users.length !== 1 ? 's' : ''} on the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-72 hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg py-2.5 pl-10 pr-4 text-sm text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all shadow-sm"
            />
          </div>
          {currentUser?.role === 'Admin' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] px-5 py-2.5 rounded-lg font-bold transition-all shadow-sm"
            >
              <Plus size={18} />
              New Member
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)]">
            <Users size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Members</p>
            <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{users.length}</h3>
          </div>
        </div>
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center text-amber-500">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Admins</p>
            <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{admins.length}</h3>
          </div>
        </div>
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-secondary)] flex items-center justify-center text-emerald-500">
            <Shield size={22} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Members</p>
            <h3 className="text-2xl font-bold text-[var(--color-foreground)]">{members.length}</h3>
          </div>
        </div>
      </div>

      {/* Members Table/Grid */}
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]">
          <div className="col-span-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member</div>
          <div className="col-span-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</div>
          <div className="col-span-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</div>
          <div className="col-span-1"></div>
        </div>

        {/* Rows */}
        {filteredUsers.length > 0 ? filteredUsers.map((member, index) => (
          <div 
            key={member._id} 
            className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[var(--color-secondary)] transition-colors ${
              index !== filteredUsers.length - 1 ? 'border-b border-[var(--color-border)]' : ''
            }`}
          >
            {/* Avatar + Info */}
            <div className="col-span-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${getGradient(index)} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0 overflow-hidden`}>
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  member.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-[var(--color-foreground)] truncate flex items-center gap-2">
                  {member.name}
                  {member._id === currentUser?._id && (
                    <span className="text-[10px] font-bold bg-[var(--color-secondary)] text-[var(--color-primary)] px-1.5 py-0.5 rounded uppercase tracking-wider">You</span>
                  )}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  <Mail size={12} />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>

            {/* Role Badge */}
            <div className="col-span-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                member.role === 'Admin' 
                  ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {member.role === 'Admin' ? <ShieldCheck size={13} /> : <Shield size={13} />}
                {member.role}
              </span>
            </div>

            {/* Joined */}
            <div className="col-span-3">
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <Calendar size={13} className="text-slate-400 dark:text-slate-500" />
                {member.createdAt 
                  ? new Date(member.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) 
                  : 'N/A'
                }
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 flex justify-end">
              <div className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Active"></div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12">
            <Users className="mx-auto text-slate-300 dark:text-slate-600 mb-3" size={40} />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No members found matching "{search}"</p>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[var(--color-foreground)]">Add New Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-[var(--color-secondary)] transition-colors">
                <X size={20} />
              </button>
            </div>
            {msg.text && (
              <div className={`mb-5 p-3 rounded-xl text-sm font-bold ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {msg.text}
              </div>
            )}
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-sm"
                  placeholder="Enter member's name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-sm"
                  placeholder="member@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Initial Password</label>
                <input 
                  type="password" 
                  value={newMember.password}
                  onChange={(e) => setNewMember({...newMember, password: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-sm"
                  placeholder="Create a temporary password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-xl px-4 py-3 text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all text-sm cursor-pointer"
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="px-5 py-2.5 rounded-xl text-slate-500 font-bold hover:bg-[var(--color-secondary)] transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm transition-colors disabled:opacity-50 text-sm"
                >
                  {addLoading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
