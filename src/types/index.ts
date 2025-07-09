export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  content: string;
  timestamp: string;
  agentId?: string;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  agents: Agent[];
  createdAt: string;
  updatedAt: string;
} 