import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, CheckSquare } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('ansh@taskpilot.com');
  const [password, setPassword] = useState('123456');
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const fillDemo = () => {
    setEmail('ansh@taskpilot.com');
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 relative overflow-hidden p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="w-full max-w-4xl z-10 flex flex-col md:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side: Brand Info */}
        <div className="hidden md:flex flex-col flex-1">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 rotate-3">
              <CheckSquare size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">
                Task<span className="text-indigo-600">Pilot</span>
              </h1>
              <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">v1.0.0 Stable</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              Manage your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Mission-Critical</span> <br/>
              Operations.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-md leading-relaxed font-medium">
              TaskPilot provides high-fidelity orchestration for your engineering and creative teams. 
              Built on SQLite and served with precision.
            </p>
            
            <div className="pt-4 flex items-center gap-8">
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Uptime SLA</p>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">Zero</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Overhead</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-md">
          {/* Logo Section (Mobile Only) */}
          <div className="md:hidden flex flex-col items-center mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 mb-4">
              <CheckSquare size={28} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
              Task<span className="text-indigo-600">Pilot</span>
            </h1>
          </div>

          <div className="bg-white/70 dark:bg-slate-800/50 backdrop-blur-2xl border border-white dark:border-slate-700/50 rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.25)] relative overflow-hidden">
            {/* Demo Badge */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={fillDemo}
                className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full border border-indigo-500/20 transition-all"
              >
                Demo Access
              </button>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to manage your mission-critical tasks.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  {error}
                </div>
              )}
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium text-sm"
                      placeholder="ansh@taskpilot.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Secret Key</label>
                    <button type="button" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">Forgot?</button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 font-medium text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 text-xs"
              >
                {loading ? 'Authenticating...' : 'Establish Connection'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700/50 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                New to the platform?{' '}
                <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors font-bold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
