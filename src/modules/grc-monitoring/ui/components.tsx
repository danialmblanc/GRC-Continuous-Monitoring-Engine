import React from 'react';
import { Shield, Database, Server, Network, Users, Box, CheckCircle2, AlertCircle, XCircle, HelpCircle } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  "App Security": Shield,
  "Data Security": Database,
  "Infrastructure Security": Server,
  "Network Security": Network,
  "Organization Security": Users,
  "Product Security": Box,
};

const statusColors: Record<string, string> = {
  pass: "text-emerald-500 bg-emerald-50 border-emerald-200",
  warning: "text-amber-500 bg-amber-50 border-amber-200",
  fail: "text-rose-500 bg-rose-50 border-rose-200",
  unknown: "text-slate-400 bg-slate-50 border-slate-200",
};

const statusIcons: Record<string, any> = {
  pass: CheckCircle2,
  warning: AlertCircle,
  fail: XCircle,
  unknown: HelpCircle,
};

interface ControlCardProps {
  control: any;
  onClick: (control: any) => void;
}

export const ControlCard: React.FC<ControlCardProps> = ({ control, onClick }) => {
  const Icon = statusIcons[control.status];
  
  return (
    <div 
      onClick={() => onClick(control)}
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg border ${statusColors[control.status]}`}>
          <Icon size={20} />
        </div>
        <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
          {control.control_id}
        </div>
      </div>
      
      <h3 className="font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
        {control.control_name}
      </h3>
      
      <p className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[32px]">
        {control.evidence_summary}
      </p>
      
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${control.status === 'pass' ? 'bg-emerald-500' : control.status === 'warning' ? 'bg-amber-500' : control.status === 'fail' ? 'bg-rose-500' : 'bg-slate-300'}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            {control.status}
          </span>
        </div>
        <div className="text-[10px] text-slate-400">
          Score: <span className="font-bold text-slate-600">{control.risk_score}</span>
        </div>
      </div>
    </div>
  );
};

interface CategoryCardProps {
  summary: any;
  isActive: boolean;
  onClick: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ summary, isActive, onClick }) => {
  const Icon = categoryIcons[summary.category] || Box;
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
        isActive 
          ? "bg-indigo-600 border-indigo-700 text-white shadow-lg shadow-indigo-200 translate-y-[-2px]" 
          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${isActive ? "bg-white/20" : "bg-slate-100"}`}>
          <Icon size={20} className={isActive ? "text-white" : "text-indigo-600"} />
        </div>
        <h3 className="font-bold text-sm leading-tight">{summary.category}</h3>
      </div>
      
      <div className="grid grid-cols-4 gap-1 text-center">
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isActive ? "text-white" : "text-emerald-500"}`}>{summary.green}</span>
          <span className={`text-[8px] uppercase font-bold opacity-60`}>Pass</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isActive ? "text-white" : "text-amber-500"}`}>{summary.yellow}</span>
          <span className={`text-[8px] uppercase font-bold opacity-60`}>Warn</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isActive ? "text-white" : "text-rose-500"}`}>{summary.red}</span>
          <span className={`text-[8px] uppercase font-bold opacity-60`}>Fail</span>
        </div>
        <div className="flex flex-col">
          <span className={`text-xs font-bold ${isActive ? "text-white" : "text-slate-400"}`}>{summary.gray}</span>
          <span className={`text-[8px] uppercase font-bold opacity-60`}>N/A</span>
        </div>
      </div>
    </div>
  );
};
