
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, SecurityThreat, OsTarget } from '../types';
import { analyzeThreatScenario, checkUrlAccess } from '../services/geminiService';
import { 
  Lock, 
  AlertOctagon, 
  Activity, 
  Shield,
  XCircle,
  Search,
  Play,
  CheckCircle2,
  Server,
  Zap
} from 'lucide-react';

// Pre-defined lists for simulation
const DEFAULT_PROCESSES = ['ProctorApp.exe', 'System', 'Registry', 'csrss.exe', 'dwm.exe', 'lsass.exe', 'winlogon.exe'];
const AVAILABLE_MOCK_APPS = [
  { name: 'Discord.exe', label: 'Discord', risk: 'HIGH' },
  { name: 'Chrome.exe', label: 'Google Chrome', risk: 'MEDIUM' },
  { name: 'CheatEngine.exe', label: 'Cheat Engine', risk: 'CRITICAL' },
  { name: 'Calc.exe', label: 'Calculator', risk: 'LOW' },
  { name: 'SnippingTool.exe', label: 'Screen Shot', risk: 'HIGH' }
];

const SimulationKiosk: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeProcesses, setActiveProcesses] = useState<string[]>([...DEFAULT_PROCESSES]);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSecure, setIsSecure] = useState(true);
  const [browserUrl, setBrowserUrl] = useState('codeforces.com');
  const [inputUrl, setInputUrl] = useState('codeforces.com');
  const [browserContent, setBrowserContent] = useState<'ALLOWED' | 'BLOCKED'>('ALLOWED');
  const [blockReason, setBlockReason] = useState('');
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (message: string, level: LogEntry['level'], source: string) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      source
    };
    setLogs(prev => [...prev.slice(-100), newLog]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Ambient traffic simulation
  useEffect(() => {
    if (!isSecure) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        addLog('Heartbeat: Kiosk Session Active (Integrity OK)', 'INFO', 'SERVICE');
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [isSecure]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    addLog(`OUTBOUND REQUEST: ${inputUrl}`, 'INFO', 'NET_FILTER');
    
    const check = checkUrlAccess(inputUrl);
    setBrowserUrl(inputUrl);
    
    if (check.allowed) {
      setBrowserContent('ALLOWED');
      addLog(`CONNECTION ESTABLISHED: ${inputUrl}`, 'SUCCESS', 'WFP_DRIVER');
    } else {
      setBrowserContent('BLOCKED');
      setBlockReason(check.reason);
      addLog(`PACKET DROP: ${inputUrl} - ${check.reason}`, 'WARN', 'FIREWALL');
    }
  };

  const handleInjectProcess = (procName: string) => {
    if (activeProcesses.includes(procName)) return;
    
    const newProcs = [...activeProcesses, procName];
    setActiveProcesses(newProcs);
    addLog(`PROCESS STARTED: ${procName} (PID: ${Math.floor(Math.random() * 9000) + 1000})`, 'INFO', 'KERNEL_CB');
    
    // Trigger auto-audit
    handleRunAudit(newProcs);
  };

  const handleRunAudit = async (procsToScan = activeProcesses) => {
    setIsScanning(true);
    addLog('INITIATING HEURISTIC SCAN...', 'INFO', 'SENTINEL_CORE');
    
    const results = await analyzeThreatScenario(procsToScan, OsTarget.WINDOWS);
    setThreats(results);
    
    if (results.length > 0) {
      setIsSecure(false);
      addLog(`VIOLATION DETECTED: ${results.length} Threats Found`, 'CRITICAL', 'SECURITY_V4');
      results.forEach(t => addLog(`THREAT: ${t.name} - ${t.description}`, 'CRITICAL', 'HEURISTIC'));
    } else {
      addLog('Scan Complete. System Integrity Verified.', 'SUCCESS', 'SENTINEL_CORE');
    }
    setIsScanning(false);
  };

  const handleReset = () => {
    setIsSecure(true);
    setThreats([]);
    setActiveProcesses([...DEFAULT_PROCESSES]);
    addLog('ADMIN OVERRIDE: Session Reset', 'WARN', 'ADMIN_CONSOLE');
    setBrowserContent('ALLOWED');
    setBrowserUrl('codeforces.com');
    setInputUrl('codeforces.com');
  };

  return (
    <div className="w-full h-full pt-2 pb-8 flex gap-6">
      
      {/* Left: Kiosk View */}
      <div className="flex-[2] flex flex-col gap-6">
         
         {/* Status Bar */}
         <div className="flex items-center justify-between bg-[#0B101B]/80 border border-white/5 shadow-xl rounded-2xl p-4 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${isSecure ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'} relative`}>
                 <div className={`absolute inset-0 rounded-full ${isSecure ? 'bg-emerald-500' : 'bg-red-500'} animate-ping opacity-30`}></div>
              </div>
              <div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment Status</div>
                 <div className={`text-sm font-bold ${isSecure ? 'text-white' : 'text-red-400'}`}>
                    {isSecure ? 'SECURE' : 'COMPROMISED'}
                 </div>
              </div>
            </div>
            
            {!isSecure && (
               <button onClick={handleReset} className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold border border-red-500/20 hover:bg-red-500/20 transition">
                 System Reset
               </button>
            )}
         </div>

         {/* Virtual Monitor */}
         <div className="flex-1 relative bg-[#0f172a] rounded-[1.5rem] border-8 border-[#1e293b] shadow-2xl overflow-hidden flex flex-col group ring-1 ring-black">
            {/* OS Header */}
            <div className="bg-[#020617] px-4 py-2 flex items-center justify-between border-b border-white/5">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono uppercase">
                 <Lock size={10} className={isSecure ? "text-emerald-500" : "text-red-500"} />
                 <span>Sentinel_Kernel_v4.2.0</span>
               </div>
               <div className="flex gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-slate-700"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-700"></div>
               </div>
            </div>

            {/* Browser Controls */}
            <div className="bg-[#1e293b] border-b border-black/20 p-2 flex items-center gap-3 z-10">
                <div className="flex gap-1.5 mr-2 opacity-30">
                   <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                   <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                </div>
                <form onSubmit={handleNavigate} className="flex-1 bg-[#0f172a] border border-white/5 hover:border-white/10 focus-within:border-emerald-500/50 transition-all rounded h-8 flex items-center px-3 text-sm text-slate-200 gap-2 shadow-inner">
                   <Lock size={12} className={browserContent === 'ALLOWED' ? "text-emerald-500" : "text-slate-500"} />
                   <input 
                     type="text" 
                     value={inputUrl}
                     onChange={(e) => setInputUrl(e.target.value)}
                     className="bg-transparent border-none outline-none w-full text-xs font-mono placeholder-slate-600 text-slate-300"
                     placeholder="https://..."
                     disabled={!isSecure}
                   />
                </form>
             </div>

            {/* Content Viewport */}
            <div className="flex-1 bg-white relative overflow-hidden">
              {!isSecure ? (
                <div className="absolute inset-0 bg-[#0f172a]/95 z-50 flex flex-col items-center justify-center text-white p-8 backdrop-blur-sm animate-in fade-in duration-300">
                    <AlertOctagon size={48} className="mb-6 text-red-500" />
                    <h1 className="text-2xl font-bold mb-2 tracking-tight">SECURITY LOCKDOWN</h1>
                    <p className="mb-8 text-slate-400 font-medium text-center max-w-md text-sm">Unauthorized process signatures detected in memory space.</p>
                    <div className="bg-black/30 rounded-xl border border-red-500/20 w-full max-w-sm overflow-hidden">
                       <div className="bg-red-500/10 px-4 py-2 text-[10px] font-bold text-red-400 uppercase tracking-wider border-b border-red-500/10">Threat Vector</div>
                       {threats.map((t, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border-b border-white/5 last:border-0">
                           <XCircle size={14} className="text-red-500 shrink-0" />
                           <div className="flex-1">
                              <div className="text-xs font-bold text-slate-200">{t.name}</div>
                              <div className="text-[10px] text-slate-500">{t.description}</div>
                           </div>
                        </div>
                      ))}
                    </div>
                </div>
              ) : browserContent === 'ALLOWED' ? (
                <div className="h-full w-full bg-white p-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
                    {/* Mock Codeforces UI */}
                    <div className="w-full max-w-3xl flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                        <div className="h-6 w-32 bg-slate-800 rounded"></div>
                        <div className="flex gap-4">
                           <div className="h-3 w-16 bg-slate-200 rounded"></div>
                           <div className="h-3 w-16 bg-slate-200 rounded"></div>
                        </div>
                    </div>
                    <div className="w-full max-w-3xl space-y-6">
                       <div className="h-6 w-2/3 bg-slate-200 rounded-lg"></div>
                       <div className="space-y-2">
                          <div className="h-3 w-full bg-slate-100 rounded"></div>
                          <div className="h-3 w-full bg-slate-100 rounded"></div>
                          <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                       </div>
                       <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 font-mono text-xs text-slate-600">
                          // Write your solution here<br/>
                          #include &lt;iostream&gt;
                       </div>
                    </div>
                </div>
              ) : (
                <div className="h-full w-full bg-[#0f172a] flex flex-col items-center justify-center text-center p-8 animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                       <Shield size={32} className="text-amber-500" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Connection Reset</h2>
                    <p className="text-slate-400 max-w-xs mb-6 text-sm">
                       Policy violation for <span className="font-mono text-amber-400">{browserUrl}</span>.
                    </p>
                    <div className="text-[10px] text-red-400 font-mono border border-red-900/50 bg-red-900/20 px-3 py-1 rounded">
                       {blockReason}
                    </div>
                </div>
              )}
            </div>
         </div>
      </div>

      {/* Right: Controls & Logs */}
      <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
        
        {/* Injector */}
        <div className="bg-[#0B101B]/80 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl p-5">
           <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap size={12} className="text-emerald-400" /> Chaos Monkey
           </h3>
           <div className="space-y-2">
              {AVAILABLE_MOCK_APPS.map((app) => (
                 <button 
                   key={app.name}
                   onClick={() => handleInjectProcess(app.name)}
                   disabled={activeProcesses.includes(app.name) || !isSecure}
                   className="w-full flex items-center justify-between p-3 rounded-lg border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed group bg-[#1e293b]/50"
                 >
                    <div className="flex items-center gap-3">
                       <div className={`w-1.5 h-1.5 rounded-full ${activeProcesses.includes(app.name) ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                       <span className="text-xs font-medium text-slate-300">{app.label}</span>
                    </div>
                    {!activeProcesses.includes(app.name) && (
                       <Play size={12} className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                 </button>
              ))}
           </div>
        </div>

        {/* Terminal Logs */}
        <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl rounded-2xl overflow-hidden flex flex-col font-mono">
           <div className="p-3 border-b border-white/5 bg-white/5 flex justify-between items-center">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <Server size={12} /> Kernel Events
              </h3>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar" ref={logContainerRef}>
              {logs.length === 0 && (
                 <div className="text-center text-slate-600 text-[10px] mt-10">Awaiting telemetry...</div>
              )}
              {logs.map((log) => (
                <div key={log.id} className="text-[10px] relative pl-2 border-l border-white/10 hover:border-emerald-500/50 transition-colors">
                   <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-slate-500">{log.timestamp}</span>
                      <span className={`font-bold ${
                         log.level === 'CRITICAL' ? 'text-red-400' : 
                         log.level === 'WARN' ? 'text-amber-400' : 
                         log.level === 'SUCCESS' ? 'text-emerald-400' : 'text-indigo-400'
                      }`}>{log.source}</span>
                   </div>
                   <div className="text-slate-400">{log.message}</div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default SimulationKiosk;
