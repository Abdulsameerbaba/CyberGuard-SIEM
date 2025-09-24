
export enum Page {
  Dashboard = 'Dashboard',
  OsintTools = 'OSINT Tools',
  ThreatIntelligence = 'Threat Intelligence',
  SecurityResources = 'Security Resources',
}

export interface AnalysisResult {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown' | 'Safe';
  summary: string;
  recommendations?: string;
}

export interface PasswordStrengthResult {
  score: number;
  explanation: string;
  suggestions: string[];
}

export interface AutomatedAction {
  id: number;
  timestamp: string;
  action: string;
  trigger: string;
  status: 'Completed' | 'Failed';
}