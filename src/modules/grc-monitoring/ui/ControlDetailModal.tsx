import React from 'react';
import { X, Shield, AlertCircle, CheckCircle2, Info, ExternalLink, ArrowRight } from 'lucide-react';

interface ControlDetailModalProps {
  control: any;
  onClose: () => void;
}

export const ControlDetailModal: React.FC<ControlDetailModalProps> = ({ control, onClose }) => {
  if (!control) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl border ${
              control.status === 'pass' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
              control.status === 'fail' ? 'bg-rose-50 border-rose-100 text-rose-600' :
              'bg-amber-50 border-amber-100 text-amber-600'
            }`}>
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {control.control_id}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {control.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{control.control_name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Summary & Evidence */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Info size={16} className="text-indigo-500" />
                  Evidence Summary
                </h3>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed">{control.evidence_summary}</p>
                  <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Confidence</span>
                      <span className="text-sm font-bold text-slate-700">High</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Measurable</span>
                      <span className="text-sm font-bold text-slate-700">{control.is_directly_measurable ? "Yes (GCP Native)" : "No (Inferred)"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Services</span>
                      <div className="flex gap-1 mt-1">
                        {control.gcp_services_used.map((s: string) => (
                          <span key={s} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Collected Evidence ({control.evidence.length})
                </h3>
                <div className="space-y-3">
                  {control.evidence.map((ev: any, i: number) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-700">{ev.resource_name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ev.resource_type}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mb-2">{ev.notes}</p>
                      <details className="text-[10px]">
                        <summary className="cursor-pointer text-indigo-600 font-bold hover:underline">View Raw Data</summary>
                        <pre className="mt-2 p-3 bg-slate-900 text-slate-300 rounded-lg overflow-x-auto">
                          {JSON.stringify(ev.raw_reference, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Findings & Remediation */}
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle size={16} className="text-rose-500" />
                  Findings ({control.findings.length})
                </h3>
                {control.findings.length === 0 ? (
                  <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 text-xs font-medium">
                    No active findings detected.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {control.findings.map((f: any, i: number) => (
                      <div key={i} className="bg-rose-50 border border-rose-100 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            f.severity === 'critical' ? 'bg-rose-600 text-white' : 'bg-rose-200 text-rose-700'
                          }`}>
                            {f.severity}
                          </span>
                          <h4 className="text-xs font-bold text-rose-900">{f.title}</h4>
                        </div>
                        <p className="text-[10px] text-rose-700 mb-2">{f.description}</p>
                        <div className="text-[9px] text-rose-500 font-medium">
                          First seen: {new Date(f.first_seen).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ArrowRight size={16} className="text-indigo-500" />
                  Remediation
                </h3>
                <div className="space-y-3">
                  {control.recommended_remediation.map((r: string, i: number) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="mt-1 w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-indigo-600">{i + 1}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{r}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Framework Mapping</h3>
                <div className="space-y-2">
                  {Object.entries(control.framework_mappings).map(([fw, codes]: [string, any]) => (
                    <div key={fw} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{fw}</span>
                      <div className="flex gap-1">
                        {codes.length > 0 ? codes.map((c: string) => (
                          <span key={c} className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-mono">{c}</span>
                        )) : <span className="text-[9px] text-slate-400 italic">No mapping</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[10px] text-slate-400">Last checked: {new Date(control.last_checked).toLocaleString()}</span>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <ExternalLink size={14} />
              Export Evidence
            </button>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
              Run Re-Evaluation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
