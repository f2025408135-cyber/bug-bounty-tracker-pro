export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Under Review' | 'Resolved' | 'Rejected' | 'NA';
export type Platform = 'HackerOne' | 'Bugcrowd' | 'Intigriti' | 'Synack' | 'YesWeHack' | 'Independent';
export type LLMModel = 'GPT-4o' | 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro' | 'Llama 3' | 'Mistral Large';

export interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}

export interface Reporter {
  name: string;
  email: string;
  username: string;
}

export interface Bug {
  id: string;
  title: string;
  description: string;
  stepsToReproduce: string;
  severity: Severity;
  cvssScore: number;
  target: string;
  platform: Platform;
  status: Status;
  bounty: number;
  createdAt: string;
  updatedAt: string;
  reporter: Reporter;
  comments: Comment[];
  activity: ActivityLog[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: 'NA Lesson' | 'Methodology' | 'Payloads' | 'Recon' | 'Other';
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  relatedBugId?: string;
}
