import { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity,
  RefreshCw,
  Search,
  LayoutGrid,
  List,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { CategoryCard, ControlCard } from './modules/grc-monitoring/ui/components';
import { ControlDetailModal } from './modules/grc-monitoring/ui/ControlDetailModal';

export default function App() {
  const [data, setData] = useState<{ results: any[], summary: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedControl, setSelectedControl] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/grc/dashboard');
      if (!response.ok) throw new Error('Failed to fetch dashboard');
      const result = await response.json();
      setData(result);
      if (!selectedCategory && result.summary.length > 0) {
        // setSelectedCategory(result.summary[0].category);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const filteredControls = data?.results.filter(c => {
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    const matchesSearch = c.control_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.control_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }) || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar / Navigation */}
      <aside className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-slate-200 flex flex-col items-center py-8 z-30">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-100 mb-12">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <nav className="flex flex-col gap-8">
          <button className="p-3 text-indigo-600 bg-indigo-50 rounded-xl transition-all">
            <LayoutGrid className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
            <Activity className="w-6 h-6" />
          </button>
          <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
            <Clock className="w-6 h-6" />
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="pl-20">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
          <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">Continuous Monitoring</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time GCP Compliance Engine</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="relative group">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search controls, IDs, or findings..." 
                  className="pl-11 pr-6 py-2.5 bg-slate-100 border-2 border-transparent focus:bg-white focus:border-indigo-500 rounded-2xl text-sm w-80 transition-all outline-none font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={fetchDashboard}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
              >
                <RefreshCw className={loading ? "animate-spin w-4 h-4" : "w-4 h-4"} />
                Refresh Engine
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-[1600px] mx-auto px-8 py-10">
          {/* Summary Section */}
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Compliance Posture</h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
                  <CheckCircle size={12} /> {data?.results.filter(r => r.status === 'pass').length} PASSING
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black border border-amber-100">
                  <AlertTriangle size={12} /> {data?.results.filter(r => r.status === 'warning').length} WARNINGS
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black border border-rose-100">
                  <XCircle size={12} /> {data?.results.filter(r => r.status === 'fail').length} FAILING
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                ))
              ) : (
                data?.summary.map((s) => (
                  <CategoryCard 
                    key={s.category} 
                    summary={s} 
                    isActive={selectedCategory === s.category}
                    onClick={() => setSelectedCategory(selectedCategory === s.category ? null : s.category)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Controls Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">
                  {selectedCategory || "All Monitoring Controls"}
                </h2>
                <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                  {filteredControls.length}
                </span>
              </div>
              <div className="flex bg-white border border-slate-200 rounded-xl p-1">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
                ))}
              </div>
            ) : filteredControls.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-20 text-center">
                <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-1">No controls found</h3>
                <p className="text-slate-500 text-sm">Try adjusting your search or category filters.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredControls.map((control) => (
                  <ControlCard 
                    key={control.control_id} 
                    control={control} 
                    onClick={setSelectedControl}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">ID</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Control Name</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Risk</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Checked</th>
                      <th className="px-6 py-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.map((control) => (
                      <tr 
                        key={control.control_id}
                        onClick={() => setSelectedControl(control)}
                        className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                      >
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-mono font-bold text-slate-400">{control.control_id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{control.control_name}</div>
                          <div className="text-[10px] text-slate-400">{control.category}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              control.status === 'pass' ? 'bg-emerald-500' : 
                              control.status === 'warning' ? 'bg-amber-500' : 
                              control.status === 'fail' ? 'bg-rose-500' : 'bg-slate-300'
                            }`} />
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{control.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold ${control.risk_score > 50 ? 'text-rose-500' : 'text-slate-600'}`}>{control.risk_score}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] text-slate-400">{new Date(control.last_checked).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all inline-block" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Detail Modal */}
      {selectedControl && (
        <ControlDetailModal 
          control={selectedControl} 
          onClose={() => setSelectedControl(null)} 
        />
      )}
    </div>
  );
}
