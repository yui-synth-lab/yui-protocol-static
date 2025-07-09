import React from 'react';
import { Session, Agent } from '../types/index';

interface ThreadViewProps {
  session: Session;
  onSessionUpdate: (session: Session) => void;
  isReadOnly?: boolean;
}

const ThreadView: React.FC<ThreadViewProps> = ({ session, onSessionUpdate, isReadOnly = false }) => {
  const getAgentById = (agentId: string): Agent | undefined => {
    return session.agents.find(agent => agent.id === agentId);
  };

  const formatTimestamp = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-100">{session.title}</h2>
            <p className="text-sm text-gray-400">
              {session.agents.length} agents • {session.messages.length} messages
            </p>
          </div>
          <div className="text-xs text-gray-500">
            Created: {formatTimestamp(session.createdAt)}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.messages.map((message) => {
          const agent = message.agentId ? getAgentById(message.agentId) : null;
          
          return (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.role === 'assistant'
                    ? 'bg-gray-700 text-gray-100'
                    : 'bg-yellow-600 text-yellow-100'
                }`}
              >
                {agent && (
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center text-xs font-medium mr-2">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-xs opacity-75 ml-2">({agent.role})</span>
                  </div>
                )}
                
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                <div className="text-xs opacity-75 mt-2">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Read-only indicator */}
      {isReadOnly && (
        <div className="bg-yellow-900 border-t border-yellow-700 p-3">
          <div className="flex items-center justify-center text-yellow-200 text-sm">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            This is a static demonstration. Interactive features are disabled.
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreadView; 