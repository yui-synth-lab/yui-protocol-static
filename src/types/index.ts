export interface Agent {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  color: string;
  // Yui Protocol 2.0 fields
  furigana?: string;
  style?: string;
  priority?: string;
  memoryScope?: string;
  personality?: string;
  preferences?: string[];
  tone?: string;
  communicationStyle?: string;
  isSummarizer?: boolean;
  references?: string[];
  reasoning?: string;
  assumptions?: string[];
  approach?: string;
  specificBehaviors?: string;
  thinkingPatterns?: string;
  interactionPatterns?: string;
  decisionProcess?: string;
  disagreementStyle?: string;
  agreementStyle?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent' | 'consensus';
  content: string;
  timestamp: string;
  agentId?: string;
  stage?: string;
  metadata?: any;
  // Yui Protocol 2.0 fields
  sequenceNumber?: number;
}

export interface Session {
  id: string;
  title: string;
  messages: Message[];
  agents: Agent[];
  createdAt: string;
  updatedAt: string;
  outputFileName?: string;
} 