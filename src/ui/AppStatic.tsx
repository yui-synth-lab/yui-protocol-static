import React, { useState, useEffect } from 'react';
import ThreadView from './ThreadView';
import { Session, Agent } from '../types/index';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
// @ts-ignore
import imgUrl from './images/YuiProtocol.png';

// StaticMenu: originaluiのMenuに近いデザインで、セッション選択のみ（新規作成やエージェントタブは除外）
const StaticMenu: React.FC<{
  sessions: Session[];
  currentSession: Session | null;
  onSelectSession: (session: Session) => void;
  isOpen: boolean;
  onClose: () => void;
}> = ({ sessions, currentSession, onSelectSession, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 w-full h-full bg-gray-800 border-l border-gray-700 z-50 overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Sessions</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">No sessions available.</p>
              ) : (
                sessions.map((session) => {
                  const messageCount = session.messages?.length || 0;
                  const agentCount = session.agents?.length || 0;
                  return (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session);
                        onClose();
                      }}
                      className={`w-full text-left p-3 transition-colors rounded ${
                        currentSession?.id === session.id
                          ? 'bg-blue-950 border border-blue-800'
                          : 'hover:bg-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-100 text-sm truncate">{session.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {agentCount} agents • {messageCount} messages
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export function AppStaticRoutes() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sessionResponse = await fetch('/yui-protocol-static/data/sessions.json');
        const sessions = await sessionResponse.json();
        setSessions(sessions);
        // URLパラメータからセッションIDを取得
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session');
        if (sessionId) {
          const session = sessions.find((s: Session) => s.id === sessionId);
          if (session) setCurrentSession(session);
        }
      } catch (e) {
        setSessions([]);
      }
    };
    loadData();
  }, []);

  const selectSession = (session: Session) => {
    setCurrentSession(session);
    // URLを更新
    const url = new URL(window.location.href);
    url.searchParams.set('session', session.id);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="flex items-center justify-between p-4 max-w-5xl mx-auto">
          <div className="flex items-center space-x-4">
            <img src={imgUrl} alt="YUI Protocol" className="h-10 w-auto rounded shadow" />
            <h1 className="text-2xl font-bold tracking-tight">YUI Protocol</h1>
            <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">Static Demo</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full">
        {currentSession ? (
          <ThreadView
            session={currentSession}
            onSessionUpdate={() => {}}
            isReadOnly={true}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Welcome to YUI Protocol</h2>
              <p className="text-gray-400 mb-6">
                This is a static demonstration of the YUI Protocol system.<br />
                Select a session from the menu to view the conversation.
              </p>
              <button
                onClick={() => setIsMenuOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
              >
                Browse Sessions
              </button>
            </div>
          </div>
        )}
      </main>
      {/* Menu */}
      <StaticMenu
        sessions={sessions}
        currentSession={currentSession}
        onSelectSession={selectSession}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
    </div>
  );
}

export default function AppStatic() {
  return (
    <Router>
      <AppStaticRoutes />
    </Router>
  );
} 