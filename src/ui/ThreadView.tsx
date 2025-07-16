import React from 'react';
import ReactMarkdown from 'react-markdown';
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

  const handleDownloadOutput = async () => {
    if (!session.outputFileName) return;
    try {
      // outputs.jsonではなく、個別ファイルをfetch
      const response = await fetch(`/yui-protocol-static/data/outputs/${session.outputFileName}`);
      if (!response.ok) {
        throw new Error('Output file not found');
      }
      const fileContent = await response.text();
      // ファイル名から拡張子を取得
      const extension = session.outputFileName.split('.').pop() || 'txt';
      const mimeType = extension === 'md' ? 'text/markdown' : 
                      extension === 'json' ? 'application/json' : 
                      'text/plain';
      // Blobを作成してダウンロード
      const blob = new Blob([fileContent], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = session.outputFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('ダウンロードに失敗しました。ファイルが見つからない可能性があります。');
    }
  };

  const getAgentName = (agentId: string) => {
    const agent = session.agents.find(a => a.id === agentId);
    return agent?.name || agentId;
  };

  const getStageColor = (stage: string): string => {
    const colors: { [key: string]: string } = {
      'individual-thought': 'bg-blue-900 border border-blue-700',
      'mutual-reflection': 'bg-green-900 border border-green-700',
      'conflict-resolution': 'bg-yellow-900 border border-yellow-700',
      'synthesis-attempt': 'bg-purple-900 border border-purple-700',
      'output-generation': 'bg-indigo-900 border border-indigo-700',
      'finalize': 'bg-gray-800 border border-gray-600'
    };
    return colors[stage] || 'bg-gray-800 border border-gray-600';
  };

  const getStageLabel = (stage: string): string => {
    const labels: { [key: string]: string } = {
      'individual-thought': 'Individual Thought',
      'mutual-reflection': 'Mutual Reflection',
      'conflict-resolution': 'Conflict Resolution',
      'synthesis-attempt': 'Synthesis Attempt',
      'output-generation': 'Output Generation',
      'finalize': 'Finalize'
    };
    return labels[stage] || stage;
  };

  const replaceAgentIdsWithNames = (content: string): string => {
    if (!content) return content;
    let replaced = content;
    session.agents.forEach(agent => {
      const regex = new RegExp(agent.id, 'g');
      replaced = replaced.replace(regex, agent.name);
    });
    return replaced;
  };

  const renderMessageContent = (content: string) => {
    try {
      // Agent ID を名前に置換
      const replacedContent = replaceAgentIdsWithNames(content);
      // 基本的なMarkdownの安全性チェック
      if (!replacedContent || typeof replacedContent !== 'string') {
        return <span className="text-gray-400 italic">[Empty or invalid content]</span>;
      }

      // 安全なMarkdownのみを使用
      return (
        <ReactMarkdown
          remarkPlugins={[]}
          rehypePlugins={[]}
          components={{
            // 基本的なコンポーネントのみを許可
            p: ({ children }) => <p className="mb-3 text-gray-300">{children}</p>,
            h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-100 my-4 border-b border-gray-700 pb-2">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold text-gray-100 my-3 border-b border-gray-700 pb-1">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-bold text-gray-100 my-2">{children}</h3>,
            h4: ({ children }) => <h4 className="text-base font-bold text-gray-100 my-2">{children}</h4>,
            h5: ({ children }) => <h5 className="text-sm font-bold text-gray-100 my-1">{children}</h5>,
            h6: ({ children }) => <h6 className="text-xs font-bold text-gray-100 my-1">{children}</h6>,
            strong: ({ children }) => <strong className="font-bold text-gray-100">{children}</strong>,
            em: ({ children }) => <em className="italic text-gray-200">{children}</em>,
            code: ({ children }) => <code className="bg-gray-700 px-1 py-0.5 text-sm text-gray-100 rounded overflow-x-auto whitespace-pre-wrap break-words">{children}</code>,
            pre: ({ children }) => <pre className="bg-gray-900 p-4 overflow-x-auto text-sm text-gray-100 rounded mb-3 whitespace-pre-wrap break-words">{children}</pre>,
            blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-gray-800">{children}</blockquote>,
            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-4 text-gray-300">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-4 text-gray-300">{children}</ol>,
            li: ({ children }) => <li className="text-gray-300">{children}</li>,
            hr: () => <hr className="border-gray-700 my-4" />,
            br: () => <br />,
            // テーブル関連は無効化
            table: () => <div className="bg-gray-800 p-4 rounded mb-3 text-gray-300">[Table content]</div>,
            thead: () => null,
            tbody: () => null,
            tr: () => null,
            th: () => null,
            td: () => null,
            // その他の危険な要素も無効化
            a: () => <span className="text-blue-400">[Link]</span>,
            img: () => <span className="text-gray-400">[Image]</span>,
            // デフォルトの処理
            div: ({ children }) => <div className="text-gray-300">{children}</div>,
            span: ({ children }) => <span className="text-gray-300">{children}</span>
          }}
        >
          {replacedContent}
        </ReactMarkdown>
      );
    } catch (error) {
      console.error('[MessagesView] Error rendering markdown content:', error);
      // エラーが発生した場合はプレーンテキストとして表示
      const replacedContent = replaceAgentIdsWithNames(content);
      return (
        <div className="whitespace-pre-wrap text-gray-100">
          {replacedContent}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto bg-gray-950 rounded-lg shadow-lg h-full overflow-hidden">
      {/* スレッドヘッダー */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-900">
        <div>
          <h2 className="text-xl font-bold text-gray-100 mb-1">{session.title}</h2>
          <div className="text-xs text-gray-400">
            {session.agents.length} agents • {session.messages.length} messages
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {session.outputFileName && (
            <>
              <button
                onClick={handleDownloadOutput}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded border border-blue-500 transition-colors"
                title={`Download ${session.outputFileName}`}
              >
                📄 Download Output
              </button>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set('session', session.id);
                  url.searchParams.set('preview', '');
                  window.location.href = url.toString();
                }}
                className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white text-xs rounded border border-green-600 transition-colors"
                title="Markdownプレビューを表示"
              >
                🖹 Preview
              </button>
            </>
          )}
          <div className="text-xs text-gray-500">
            Created: {formatTimestamp(session.createdAt)}
          </div>
        </div>
      </div>
      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gray-950">
        {(() => {
          let prevStage: string | undefined = undefined;
          const elements: React.ReactNode[] = [];
          session.messages.forEach((message: Message, idx: number) => {
            const currentStage = message.stage;

            if (currentStage && currentStage !== prevStage) {
              elements.push(
                <div key={`stage-separator-${idx}`} className="my-4">
                  <div className={`p-3 ${getStageColor(currentStage)} rounded`}>
                    <h3 className="font-medium text-gray-200">{getStageLabel(currentStage)}</h3>
                  </div>
                </div>
              );
            }
            prevStage = currentStage;

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
            let bubbleClass = `bg-gray-800 p-4 rounded prose prose-invert max-w-none text-sm`;
            // アバター背景
            let avatarClass = `w-10 h-10 rounded-full flex items-center justify-center text-2xl shadow border-2 border-gray-700`;

            elements.push(
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
                  {renderMessageContent(message.content ?? '')}
                          {/* 投票情報 */}
                          {message.metadata?.voteFor && (
                            <div className="mt-2 space-y-1">
                              <div className="inline-block px-2 py-1 rounded bg-indigo-700 text-xs text-white font-semibold">
                                投票: {getAgentName(message.metadata.voteFor)}
                              </div>
                              {message.metadata.voteReasoning && (
                                <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                  <strong>理由:</strong> {message.metadata.voteReasoning}
                                </div>
                              )}
                              {message.metadata.voteSection && !message.metadata.voteReasoning && (
                                <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                  <strong>投票内容:</strong> {message.metadata.voteSection}
                                </div>
                              )}
                            </div>
                          )}
                  </div>
                </div>
              </div>
            );
          });
          return elements;
        })()}
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