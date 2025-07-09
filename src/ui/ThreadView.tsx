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

  const getUserAvatar = () => '🧑‍💻';

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
          const agent = message.agentId ? getAgentById(message.agentId) : undefined;
          const isUser = message.role === 'user';
          const isSystem = message.role === 'system';

          // originaluiの色ロジック
          let avatar, name, nameStyle, bubbleBorderStyle, avatarBgStyle;
          if (isSystem) {
            avatar = <span className="text-sm">⚙️</span>;
            name = 'System';
            nameStyle = { color: '#a78bfa' };
            bubbleBorderStyle = { borderLeft: '4px solid #a78bfa' };
            avatarBgStyle = { backgroundColor: '#a78bfa' };
          } else if ((message.role === 'agent' || message.role === 'assistant') && agent) {
            const color = agent.color || '#ccc';
            avatar = agent.avatar || agent.name.charAt(0).toUpperCase();
            name = agent.name;
            nameStyle = { color };
            bubbleBorderStyle = { borderLeft: `4px solid ${color}` };
            avatarBgStyle = { backgroundColor: color };
          } else if (isUser) {
            avatar = getUserAvatar();
            name = 'You';
            nameStyle = { color: '#60a5fa' };
            bubbleBorderStyle = { borderLeft: '4px solid #2563eb' };
            avatarBgStyle = { backgroundColor: '#2563eb' };
          }

          // バブルの色や枠線
          let bubbleClass = `bg-gray-800 p-4 rounded prose prose-invert prose-sm max-w-none`;
          // アバター背景
          let avatarClass = `w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow border-2 border-gray-700`;

          return (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse justify-end' : 'justify-start'}`}
            >
              <div className="flex-shrink-0">
                <div className={avatarClass} style={avatarBgStyle}>{avatar}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center mb-2 ${isUser ? 'flex-row-reverse justify-end space-x-reverse space-x-2' : 'space-x-2'}`}> 
                  <span className={`text-sm font-medium ${isUser ? 'text-right' : ''}`} style={nameStyle}>{name}</span>
                  <span className={`text-xs text-gray-500 ${isUser ? 'text-right' : ''}`}>{formatTimestamp(message.timestamp)}</span>
                </div>
                <div className={bubbleClass} style={bubbleBorderStyle}>
                  <div className="whitespace-pre-wrap break-words text-gray-100">{message.content}</div>
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