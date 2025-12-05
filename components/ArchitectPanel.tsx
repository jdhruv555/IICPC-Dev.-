
import React, { useState, useEffect } from 'react';
import { OsTarget, ArtifactType } from '../types';
import { generateArchitectArtifact } from '../services/geminiService';
import { 
  Cpu, 
  Sparkles, 
  Code2, 
  FileText, 
  ShieldAlert,
  Download,
  Copy,
  CheckCircle2,
  Terminal,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const LOADING_STEPS = [
  "Initializing Neural Architect...",
  "Analyzing Kernel Constraints...",
  "Synthesizing Security Modules...",
  "Compiling Threat Models...",
  "Optimizing Output Artifacts..."
];

const ArchitectPanel: React.FC = () => {
  const [selectedOs, setSelectedOs] = useState<OsTarget>(OsTarget.WINDOWS);
  const [artifactType, setArtifactType] = useState<ArtifactType>(ArtifactType.SPECIFICATION);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // Cycle through loading messages
  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStep(prev => (prev + 1) % LOADING_STEPS.length);
    }, 800);
    return () => clearInterval(interval);
  }, [loading]);

  const handleGenerate = async () => {
    setLoading(true);
    setContent('');
    try {
      const result = await generateArchitectArtifact(selectedOs, artifactType);
      setContent(result);
    } catch (e) {
      setContent("## Error\nFailed to contact architect service. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifactType === ArtifactType.SPECIFICATION 
      ? `secure_exam_spec_${selectedOs.split(' ')[0]}.md`
      : `secure_exam_impl_${selectedOs.split(' ')[0]}.md`;
    a.click();
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      
      {/* Left Panel: Config Controls */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6 shrink-0">
        
        {/* Generator Card */}
        <div className="group relative">
          {/* Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-emerald-500/20 to-blue-500/0 rounded-[2rem] blur-md opacity-0 group-hover:opacity-100 transition duration-700" />
          
          <div className="relative bg-[#0B101B]/60 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] rounded-3xl p-6 overflow-hidden">
            {/* Glass Shine */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            
            <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2 tracking-tight relative z-10">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Cpu className="text-emerald-400" size={18} />
              </div>
              Configuration
            </h2>
            <p className="text-slate-400 text-xs mb-6 font-medium relative z-10 pl-11 -mt-4">
              Define target parameters for the architect engine.
            </p>

            <div className="space-y-6 relative z-10">
              {/* OS Selection */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-emerald-500" /> Platform Target
                </label>
                <div className="flex flex-col gap-2">
                  {Object.values(OsTarget).map((os) => (
                    <button
                      key={os}
                      onClick={() => setSelectedOs(os)}
                      className={`
                        group/btn relative w-full text-left px-4 py-3 rounded-xl border transition-all duration-300 flex items-center justify-between overflow-hidden
                        ${selectedOs === os
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                          : 'bg-white/[0.03] border-white/5 text-slate-400 hover:bg-white/[0.07] hover:border-white/10'
                        }
                      `}
                    >
                      <span className="font-medium text-xs relative z-10">{os}</span>
                      {selectedOs === os && (
                        <CheckCircle2 size={14} className="text-emerald-400 relative z-10" />
                      )}
                      {/* Button shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Artifact Type */}
               <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-2">
                   <span className="w-1 h-1 rounded-full bg-blue-500" /> Generation Mode
                </label>
                <div className="grid grid-cols-2 gap-2 bg-black/20 p-1.5 rounded-xl border border-white/5">
                  {[
                    { type: ArtifactType.SPECIFICATION, icon: FileText, label: 'SPEC' },
                    { type: ArtifactType.CODEBASE, icon: Code2, label: 'CODE' }
                  ].map((item) => (
                    <button 
                      key={item.type}
                      onClick={() => setArtifactType(item.type)}
                      className={`py-2.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-2 relative overflow-hidden
                        ${artifactType === item.type 
                          ? 'bg-white/10 text-white shadow-lg border border-white/10' 
                          : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }
                      `}
                    >
                      <item.icon size={12} className={artifactType === item.type ? 'text-emerald-400' : ''} /> 
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="
                  w-full py-4 rounded-xl font-bold text-[#020617]
                  bg-gradient-to-r from-emerald-400 to-emerald-500
                  hover:from-emerald-300 hover:to-emerald-400
                  shadow-[0_0_30px_-5px_rgba(16,185,129,0.4)]
                  active:scale-[0.98] transition-all duration-300
                  flex items-center justify-center gap-2
                  disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none
                  text-sm mt-4 border border-emerald-300/20 relative overflow-hidden group/gen
                "
              >
                {/* Sheen effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/gen:translate-x-full transition-transform duration-700" />
                
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    <span className="relative z-10">Processing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-emerald-950 relative z-10" />
                    <span className="relative z-10">Generate Solution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Context Card */}
        <div className="bg-[#0B101B]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1 relative overflow-hidden group hover:border-white/20 transition-colors duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
          
          <h3 className="text-[10px] font-bold text-slate-400 mb-4 flex items-center gap-2 uppercase tracking-wider relative z-10">
            <ShieldAlert className="text-indigo-400" size={14} />
            Threat Model Scope
          </h3>
          <div className="flex flex-wrap gap-2 mb-4 relative z-10">
            {['DMA Attacks', 'Process Injection', 'Hypervisors', 'Tunneling'].map((item, i) => (
              <div key={i} className="text-[10px] font-semibold text-slate-300 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/[0.08] transition-colors cursor-default shadow-sm">
                {item}
              </div>
            ))}
          </div>
          <div className="text-[11px] text-slate-500 leading-relaxed relative z-10 pl-1 border-l-2 border-indigo-500/20">
            Output will include specific kernel-level mitigations for the selected threat vectors.
          </div>
        </div>
      </div>

      {/* Right Panel: Output */}
      <div className="flex-1 min-h-[500px] bg-[#0B101B]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] rounded-[2rem] flex flex-col overflow-hidden relative group transition-all duration-500">
        {/* Top sheen */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
        
        {/* Window Header */}
        <div className="h-14 border-b border-white/5 bg-white/[0.02] flex items-center justify-between px-6 backdrop-blur-sm relative z-20">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30" />
             <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/30" />
             <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
           </div>
           
           <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-black/20 border border-white/5">
             <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : content ? 'bg-emerald-400' : 'bg-slate-500'}`} />
             <div className="text-[10px] font-mono text-slate-300 tracking-wider uppercase">
               {loading ? 'architect_engine_active' : content ? 'render_complete' : 'awaiting_input'}
             </div>
           </div>

           <div className="flex items-center gap-2">
             <button 
              onClick={() => navigator.clipboard.writeText(content)} 
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all active:scale-90"
              title="Copy to Clipboard"
             >
               <Copy size={16} />
             </button>
             <button 
               onClick={handleDownload} 
               className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-all active:scale-90"
               title="Download MD"
             >
               <Download size={16} />
             </button>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-[#0B101B] to-[#020617] relative">
           {/* Background Pattern for Output */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none" />

          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-8 z-10 relative">
               {/* Animated Spinner Container */}
               <div className="relative w-32 h-32 flex items-center justify-center">
                 <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full animate-pulse" />
                 
                 {/* Outer Ring */}
                 <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
                 
                 {/* Spinning Ring */}
                 <div className="absolute inset-0 border-2 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                 
                 {/* Reverse Spinning Inner Ring */}
                 <div className="absolute inset-4 border-2 border-t-transparent border-r-white/20 border-b-transparent border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]" />
                 
                 {/* Center Icon */}
                 <div className="relative z-10 w-16 h-16 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-xl">
                   <Cpu size={24} className="text-emerald-400" />
                 </div>
               </div>

               {/* Status Text */}
               <div className="space-y-3 text-center max-w-xs">
                 <p className="text-xs font-bold text-white tracking-[0.2em] uppercase">
                   System Architect Engine
                 </p>
                 <div className="h-6 flex items-center justify-center overflow-hidden">
                   <p key={loadingStep} className="text-xs font-mono text-emerald-400/80 animate-in fade-in slide-in-from-bottom-2 duration-300">
                     {'>'} {LOADING_STEPS[loadingStep]}
                   </p>
                 </div>
                 <div className="flex gap-1.5 justify-center pt-2">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                 </div>
               </div>
            </div>
          ) : content ? (
            <div className="prose prose-invert prose-headings:font-bold prose-h1:text-transparent prose-h1:bg-clip-text prose-h1:bg-gradient-to-br prose-h1:from-white prose-h1:to-slate-400 prose-p:text-slate-400 prose-strong:text-emerald-200 prose-code:text-emerald-300 max-w-none relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-6 z-10 relative opacity-50">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-center border border-white/5 shadow-inner relative">
                 <div className="absolute inset-0 bg-emerald-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                 <Terminal size={32} className="opacity-40 relative z-10" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-70 text-slate-400">System Ready</p>
                <p className="text-[10px] text-slate-600">Select parameters to begin generation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchitectPanel;
