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
        background: 'var(--card-bg, #ffffff)',
        borderRadius: '16px',
        border: '1px solid var(--card-border, #e5e7eb)',
        padding: '24px',
        color: 'var(--text-main, #0f172a)',
        boxShadow: 'var(--card-shadow)',
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
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            💬
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
              AI Performance Coach
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #94a3b8)' }}>Context-aware execution assistant</p>
          </div>
        </div>

        <button
          onClick={clearChatHistory}
          style={{
            padding: '4px 10px',
            borderRadius: '8px',
            background: 'var(--surface-secondary, #f8fafc)',
            border: '1px solid var(--card-border, #e5e7eb)',
            color: 'var(--text-muted, #94a3b8)',
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
              background: 'rgba(99, 102, 241, 0.08)',
              color: '#6366f1',
              fontSize: '0.78rem',
              fontWeight: 500,
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
                  background: isCoach ? 'var(--surface-secondary, #f8fafc)' : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                  border: isCoach ? '1px solid var(--soft-border, #eef2f7)' : 'none',
                  padding: '12px 16px',
                  color: isCoach ? 'var(--text-main, #0f172a)' : '#ffffff',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                  whiteSpace: 'pre-wrap',
                  boxShadow: isCoach ? 'var(--shadow-sm)' : 'none',
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
                          color: '#ffffff',
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
                    color: isCoach ? 'var(--text-muted, #94a3b8)' : 'rgba(255,255,255,0.8)',
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
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#6366f1', fontSize: '0.82rem' }}>
            <span>🤖</span>
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
            background: 'var(--surface-primary, #ffffff)',
            border: '1px solid var(--input-border, #e5e7eb)',
            color: 'var(--text-main, #0f172a)',
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
            background: isThinking || !inputQuery.trim() ? 'rgba(99, 102, 241, 0.3)' : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
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
