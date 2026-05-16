import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Target, Activity, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Analytics = () => {
  const { tasks } = useTaskStore();
  const { projects } = useProjectStore();

  const taskStats = useMemo(() => {
    const done = tasks.filter(t => t.status === 'DONE').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    
    return [
      { name: 'Completed', value: done, color: '#10b981' },
      { name: 'In Progress', value: inProgress, color: '#f59e0b' },
      { name: 'To Do', value: todo, color: '#6366f1' },
    ];
  }, [tasks]);

  const productivityData = [
    { day: 'Mon', completed: 4, average: 3 },
    { day: 'Tue', completed: 7, average: 3 },
    { day: 'Wed', completed: 5, average: 4 },
    { day: 'Thu', completed: 9, average: 4 },
    { day: 'Fri', completed: 12, average: 5 },
    { day: 'Sat', completed: 3, average: 2 },
    { day: 'Sun', completed: 2, average: 2 },
  ];

  const projectEfficiency = useMemo(() => {
    return projects.map(p => {
      const pTasks = tasks.filter(t => t.projectId === p._id);
      const completed = pTasks.filter(t => t.status === 'DONE').length;
      const efficiency = pTasks.length > 0 ? Math.round((completed / pTasks.length) * 100) : 0;
      return {
        name: p.title.length > 15 ? p.title.substring(0, 12) + '...' : p.title,
        efficiency
      };
    }).slice(0, 5);
  }, [projects, tasks]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] tracking-tight">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time performance metrics and insights.</p>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Zap size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> +12%
            </span>
          </div>
          <p className="text-indigo-100 text-sm font-medium">Team Velocity</p>
          <h3 className="text-3xl font-bold mt-1">24.5 <span className="text-sm font-normal opacity-80">tasks/wk</span></h3>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-200 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Target size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> +5%
            </span>
          </div>
          <p className="text-emerald-100 text-sm font-medium">Completion Rate</p>
          <h3 className="text-3xl font-bold mt-1">88% <span className="text-sm font-normal opacity-80">on target</span></h3>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl p-6 text-white shadow-lg shadow-purple-200 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Activity size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-md text-red-100">
              <ArrowDownRight size={14} /> -2%
            </span>
          </div>
          <p className="text-purple-100 text-sm font-medium">Overdue Tasks</p>
          <h3 className="text-3xl font-bold mt-1">{tasks.filter(t => t.status !== 'DONE' && t.dueDate && new Date(t.dueDate) < new Date()).length} <span className="text-sm font-normal opacity-80">critical</span></h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Productivity Line Chart */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-500" /> Task Velocity
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="completed" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
                <Line type="monotone" dataKey="average" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution Pie Chart */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
              <Activity size={20} className="text-emerald-500" /> Status Distribution
            </h2>
          </div>
          <div className="h-80 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-4 pr-12">
              {taskStats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }}></div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.name}</span>
                    <span className="text-xl font-bold text-[var(--color-foreground)]">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Project Efficiency Bar Chart */}
      <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold text-[var(--color-foreground)] flex items-center gap-2">
            <Users size={20} className="text-purple-500" /> Project Efficiency
          </h2>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">% Completed Tasks</span>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectEfficiency} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} tick={{fill: '#1e293b', fontWeight: 'bold', fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="efficiency" radius={[0, 4, 4, 0]} barSize={24}>
                {projectEfficiency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
