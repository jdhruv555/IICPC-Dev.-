
export enum OsTarget {
  WINDOWS = 'Windows (WFP/Win32)',
  MACOS = 'macOS (Network Extensions)',
  LINUX = 'Linux (eBPF/Namespaces)'
}

export enum AppMode {
  ARCHITECT = 'ARCHITECT',
  SIMULATION = 'SIMULATION'
}

export enum ArtifactType {
  SPECIFICATION = 'SPECIFICATION',
  CODEBASE = 'CODEBASE'
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRITICAL' | 'SUCCESS';
  message: string;
  source: string;
}

export interface SecurityThreat {
  name: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  mitigation: string;
}
