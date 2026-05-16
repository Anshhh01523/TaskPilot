import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { 
  User, Shield, ShieldCheck, Lock, Trash2, Save, CheckCircle2, 
  AlertTriangle, Mail, Users, ChevronRight, Settings as SettingsIcon, Plus, X, Camera
} from 'lucide-react';
import api from '../lib/axios';

const Settings = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile state
  const [profile, setProfile] = useState({ name: '', email: '', avatar: '' });
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');

  // Password state
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Team management state (admin only)
  const [allUsers, setAllUsers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamMsg, setTeamMsg] = useState({ type: '', text: '' });

  // Add Member state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', password: '', role: 'Member' });
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, avatar: user.avatar || '' });
      setAvatarPreview(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'team' && user?.role === 'Admin') {
      fetchUsers();
    }
  }, [activeTab, user]);

  const fetchUsers = async () => {
    setTeamLoading(true);
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data);
    } catch { /* ignore */ }
    finally { setTeamLoading(false); }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64 storage
        setProfileMsg({ type: 'error', text: 'Image too large. Please select an image under 1MB.' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Handlers ---

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ type: '', text: '' });
    try {
      const res = await api.put('/auth/profile', profile);
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setPasswordLoading(true);
    try {
      await api.put('/auth/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswordMsg({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.response?.data?.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setTeamMsg({ type: '', text: '' });
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      setAllUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      setTeamMsg({ type: 'success', text: 'Role updated!' });
      setTimeout(() => setTeamMsg({ type: '', text: '' }), 2000);
    } catch (err) {
      setTeamMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update role' });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Remove "${userName}" from the platform? This action cannot be undone.`)) return;
    setTeamMsg({ type: '', text: '' });
    try {
      await api.delete(`/auth/users/${userId}`);
      setAllUsers(prev => prev.filter(u => u._id !== userId));
      setTeamMsg({ type: 'success', text: `${userName} has been removed.` });
      setTimeout(() => setTeamMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setTeamMsg({ type: 'error', text: err.response?.data?.message || 'Failed to remove user' });
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    setTeamMsg({ type: '', text: '' });
    try {
      const res = await api.post('/auth/users', newMember);
      setAllUsers(prev => [...prev, res.data]);
      setShowAddModal(false);
      setNewMember({ name: '', email: '', password: '', role: 'Member' });
      setTeamMsg({ type: 'success', text: 'New member added successfully!' });
      setTimeout(() => setTeamMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setTeamMsg({ type: 'error', text: err.response?.data?.message || 'Failed to add member' });
    } finally {
      setAddLoading(false);
    }
  };

  const avatarGradients = [
    'from-indigo-400 to-indigo-600', 'from-emerald-400 to-emerald-600',
    'from-purple-400 to-purple-600', 'from-amber-400 to-orange-500',
    'from-sky-400 to-blue-600', 'from-pink-400 to-rose-500',
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    ...(user?.role === 'Admin' ? [{ id: 'team', label: 'Team Management', icon: Users }] : []),
  ];

  const inputClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-sm";

  const StatusMessage = ({ msg }) => {
    if (!msg.text) return null;
    return (
      <div className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium ${
        msg.type === 'success' 
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
          : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30'
      }`}>
        {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
        {msg.text}
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight flex items-center gap-3">
          <SettingsIcon size={28} className="text-slate-400 dark:text-slate-500" /> Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account, security, and team.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <nav className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[var(--color-secondary)] text-[var(--color-primary)] border-l-[3px] border-[var(--color-primary)] font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-[var(--color-secondary)] hover:text-[var(--color-foreground)] border-l-[3px] border-transparent'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
                <ChevronRight size={14} className="ml-auto opacity-40" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* ===== PROFILE TAB ===== */}
          {activeTab === 'profile' && (
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-sm p-8">
              <h2 className="text-lg font-bold text-[var(--color-foreground)] mb-1">Profile Information</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Update your personal details here.</p>

              <StatusMessage msg={profileMsg} />

              <form onSubmit={handleProfileUpdate} className="space-y-5 mt-4">
                {/* Avatar Preview */}
                <div className="flex items-center gap-6 mb-4">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg overflow-hidden border-2 border-white dark:border-slate-700">
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile.name ? profile.name.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-indigo-600 dark:text-indigo-400">
                      <Camera size={16} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Profile Photo</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Click the camera icon to change.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={inputClass}
                      placeholder="you@company.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <ShieldCheck size={16} className="text-indigo-500" />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{user?.role}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto">Role cannot be self-changed</span>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                  >
                    <Save size={16} />
                    {profileLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== SECURITY TAB ===== */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm p-8">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">Change Password</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ensure your account stays secure by updating your password.</p>

                <StatusMessage msg={passwordMsg} />

                <form onSubmit={handlePasswordChange} className="space-y-5 mt-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      className={inputClass}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className={inputClass}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className={inputClass}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50"
                    >
                      <Lock size={16} />
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm p-8">
                <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                  <AlertTriangle size={20} /> Danger Zone
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Irreversible and destructive actions.</p>
                <div className="flex items-center justify-between p-4 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Sign out of all devices</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">This will log you out immediately.</p>
                  </div>
                  <button
                    onClick={logout}
                    className="px-4 py-2 text-sm font-bold text-red-600 dark:text-red-400 bg-white dark:bg-slate-800 border border-red-200 dark:border-red-900/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== TEAM MANAGEMENT TAB (Admin only) ===== */}
          {activeTab === 'team' && user?.role === 'Admin' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
              <div className="p-8 pb-4">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Team Management</h2>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shadow-indigo-200"
                  >
                    <Plus size={16} /> Add Member
                  </button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage roles and remove members from the platform.</p>
                <StatusMessage msg={teamMsg} />
              </div>

              {teamLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div>
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-8 py-3 border-y border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="col-span-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Member</div>
                    <div className="col-span-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</div>
                    <div className="col-span-3 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role</div>
                    <div className="col-span-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</div>
                  </div>

                  {/* Rows */}
                  {allUsers.map((member, index) => (
                    <div
                      key={member._id}
                      className={`grid grid-cols-12 gap-4 px-8 py-4 items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors ${
                        index !== allUsers.length - 1 ? 'border-b border-slate-50 dark:border-slate-700/30' : ''
                      }`}
                    >
                      {/* Name + Avatar */}
                      <div className="col-span-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${avatarGradients[index % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0`}>
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {member.name}
                          {member._id === user._id && (
                            <span className="ml-2 text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded uppercase">You</span>
                          )}
                        </span>
                      </div>

                      {/* Email */}
                      <div className="col-span-3">
                        <span className="text-sm text-slate-500 dark:text-slate-400 truncate block">{member.email}</span>
                      </div>

                      {/* Role Selector */}
                      <div className="col-span-3">
                        {member._id === user._id ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400">
                            <ShieldCheck size={13} /> Admin
                          </span>
                        ) : (
                          <select
                            value={member.role}
                            onChange={(e) => handleRoleChange(member._id, e.target.value)}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                          >
                            <option value="Member">Member</option>
                            <option value="Admin">Admin</option>
                          </select>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex justify-end">
                        {member._id !== user._id ? (
                          <button
                            onClick={() => handleDeleteUser(member._id, member.name)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 dark:text-slate-500 italic">—</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {allUsers.length === 0 && (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">No members found.</div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Add New Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  className={inputClass}
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
                  className={inputClass}
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
                  className={inputClass}
                  placeholder="Create a temporary password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                  className={inputClass}
                >
                  <option value="Member">Member</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)} 
                  className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 font-bold transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addLoading}
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] font-bold shadow-sm shadow-indigo-200 transition-colors disabled:opacity-50 text-sm"
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

export default Settings;
