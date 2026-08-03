import React, { useState, useRef, useEffect } from 'react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const AIChatWidget: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const { chatMessages, isThinking, sendChatMessage, clearChatHistory } = useAICoachStore();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Why did my score drop?',
    'How can I improve my discipline score?',
    'Create a study plan for Python',
    'Analyze my sleep & focus correlation',
    'Goal completion forecast',
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  const handleSend = (query?: string) => {
    const q = query || inputQuery;
    if (!q.trim() || isThinking) return;
    sendChatMessage(q);
    setInputQuery('');
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #1e293b)',
        borderRadius: '16px',
        border: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))',
        padding: '24px',
        color: '#f8fafc',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        display: 'flex',
        flexDirection: 'column',
        height: '520px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              fontSize: '1.3rem',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)',
            }}
          >
            💬
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>AI Performance Coach</h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>Context-aware execution assistant</p>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#94a3b8',
            fontSize: '0.78rem',
            cursor: 'pointer',
          }}
        >
          Clear Chat
        </button>
      </div>

      {/* Quick Prompts */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '12px' }}>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              fontSize: '0.78rem',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '6px',
          marginBottom: '14px',
        }}
      >
        {chatMessages.map((msg) => {
          const isCoach = msg.sender === 'coach';

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isCoach ? 'flex-start' : 'flex-end',
              }}
            >
              <div
                style={{
                  maxWidth: '82%',
                  borderRadius: isCoach ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                  background: isCoach ? 'rgba(15, 23, 42, 0.7)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  border: isCoach ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  padding: '12px 16px',
                  color: '#f8fafc',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => alert(`Executed action: ${act.label}`)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#10b981',
                          border: 'none',
                          color: '#022c22',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                <div
                  style={{
                    fontSize: '0.7rem',
                    color: isCoach ? '#64748b' : 'rgba(255,255,255,0.7)',
                    marginTop: '6px',
                    textAlign: 'right',
                  }}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#818cf8', fontSize: '0.82rem' }}>
            <span style={{ animation: 'spin 1s linear infinite' }}>🤖</span>
            <span>AI Coach is analyzing live context & formulating advice...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          placeholder="Ask AI Coach (e.g. Why did my score drop?, How close am I to Python goal?)..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '10px',
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fff',
            fontSize: '0.88rem',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isThinking || !inputQuery.trim()}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: isThinking || !inputQuery.trim() ? 'rgba(99, 102, 241, 0.3)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            border: 'none',
            color: '#fff',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: isThinking || !inputQuery.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
