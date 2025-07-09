import React from 'react';
import { Session, Agent, Message } from '../types/index';

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
    <div className="flex flex-col w-full">
      {/* スレッドヘッダー */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">{session.title}</h2>
          <div className="text-xs text-gray-400">
            {session.agents.length} agents • {session.messages.length} messages
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Created: {formatTimestamp(session.createdAt)}
        </div>
      </div>
      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gray-950">
        {session.messages.map((message: Message) => {
          const agent = message.agentId ? getAgentById(message.agentId) : null;
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end max-w-2xl w-full ${isUser ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {agent && (
                  <div className="flex flex-col items-center mr-3 ml-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow border-2 border-gray-700 bg-gray-800">
                      {agent.avatar || agent.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-400 mt-1 truncate max-w-[60px]">{agent.name}</span>
                  </div>
                )}
                {/* Message bubble */}
                <div
                  className={`rounded-xl px-5 py-4 shadow text-sm whitespace-pre-wrap break-words ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : message.role === 'assistant'
                      ? 'bg-gray-800 text-gray-100'
                      : 'bg-yellow-700 text-yellow-100'
                  }`}
                  style={{ minWidth: 0 }}
                >
                  {message.content}
                  <div className="text-xs text-gray-400 mt-2 text-right">
                    {formatTimestamp(message.timestamp)}
                  </div>
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