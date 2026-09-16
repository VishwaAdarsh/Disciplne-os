import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, PlusCircle, Trash2, RotateCcw, AlertCircle, Clock, Sparkles } from 'lucide-react';
import { useAICoachStore } from '../../store/aiCoachStore';

export const AIChatWidget: React.FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const [slowNotice, setSlowNotice] = useState(false);

  const {
    chatMessages,
    conversations,
    activeConversationId,
    isThinking,
    error,
    sendChatMessage,
    retryLastMessage,
    startNewConversation,
    selectConversation,
    clearChatHistory,
    loadConversations,
  } = useAICoachStore();

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Suggested Prompts specified in SPR-314 Scope
  const suggestedPrompts = [
    'How was my day?',
    'Why did my performance change?',
    'What should I focus on today?',
    'How am I doing with my goals?',
    'Analyze my recent discipline.',
    'Help me plan tomorrow.',
  ];

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isThinking]);

  // Slow response detector (shows encouraging note if model takes > 3.5s)
  useEffect(() => {
    let timer: any;
    if (isThinking) {
      timer = setTimeout(() => setSlowNotice(true), 3500);
    } else {
      setSlowNotice(false);
    }
    return () => clearTimeout(timer);
  }, [isThinking]);

  const handleSend = (query?: string) => {
    const q = query || inputQuery;
    if (!q.trim() || isThinking) return;
    sendChatMessage(q);
    setInputQuery('');
  };

  return (
    <div
      style={{
        background: 'var(--card-bg, #111827)',
        borderRadius: '16px',
        border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
        padding: '20px',
        color: 'var(--text-main, #FFFFFF)',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        height: '560px',
        maxWidth: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* HEADER BAR */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '14px',
          borderBottom: '1px solid var(--card-border, rgba(255, 255, 255, 0.06))',
          paddingBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              flexShrink: 0,
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-sekuya" style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-main, #FFFFFF)' }}>
              AI Performance Coach
            </h3>
            <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted, #94A3B8)' }}>
              Context-grounded assistant with zero metric hallucination
            </p>
          </div>
        </div>

        {/* CONVERSATION CONTROLS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {conversations.length > 1 && (
            <select
              value={activeConversationId || ''}
              onChange={(e) => selectConversation(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
                borderRadius: '8px',
                color: 'var(--text-muted, #94A3B8)',
                padding: '5px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                maxWidth: '160px',
                outline: 'none',
              }}
            >
              {conversations.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#111827', color: '#FFF' }}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => startNewConversation()}
            disabled={isThinking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 12px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#818CF8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: isThinking ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <PlusCircle size={13} />
            <span>New Chat</span>
          </button>

          <button
            onClick={() => clearChatHistory()}
            disabled={isThinking}
            title="Clear conversation"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px 8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
              color: 'var(--text-muted, #94A3B8)',
              fontSize: '11px',
              cursor: isThinking ? 'not-allowed' : 'pointer',
            }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* SUGGESTED PROMPTS ROW */}
      <div
        className="no-scrollbar"
        style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '10px',
          flexShrink: 0,
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            disabled={isThinking}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              background: 'rgba(99, 102, 241, 0.08)',
              color: '#A5B4FC',
              fontSize: '11px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
              cursor: isThinking ? 'not-allowed' : 'pointer',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={11} color="#818CF8" />
            <span>{prompt}</span>
          </button>
        ))}
      </div>

      {/* ERROR BANNER WITH RETRY */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: '10px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} color="#EF4444" />
            <span style={{ fontSize: '12px', color: '#FCA5A5' }}>{error}</span>
          </div>
          <button
            onClick={() => retryLastMessage()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={12} />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* MESSAGES SCROLL AREA */}
      <div
        className="no-scrollbar"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          paddingRight: '4px',
          marginBottom: '12px',
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
                  maxWidth: '85%',
                  borderRadius: isCoach ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                  background: isCoach
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)',
                  border: isCoach ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  padding: '12px 16px',
                  color: isCoach ? 'var(--text-main, #FFFFFF)' : '#FFFFFF',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  overflowWrap: 'anywhere',
                  wordBreak: 'break-word',
                  boxShadow: isCoach ? '0 2px 6px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(99, 102, 241, 0.3)',
                }}
              >
                {msg.text}

                <div
                  style={{
                    fontSize: '10px',
                    color: isCoach ? 'var(--text-muted, #94A3B8)' : 'rgba(255, 255, 255, 0.7)',
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

        {/* THINKING & SLOW NOTICE INDICATOR */}
        {isThinking && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              background: 'rgba(99, 102, 241, 0.06)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              maxWidth: '80%',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#818CF8', fontSize: '12px' }}>
              <Bot size={15} className="animate-spin" />
              <span>Analyzing live telemetry across Performance, Discipline, and Body...</span>
            </div>
            {slowNotice && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#94A3B8' }}>
                <Clock size={12} />
                <span>Synthesizing multi-module context for deep guidance...</span>
              </div>
            )}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT BOX */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexShrink: 0,
          background: 'var(--input-bg, rgba(255, 255, 255, 0.03))',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid var(--input-border, rgba(255, 255, 255, 0.1))',
        }}
      >
        <input
          type="text"
          placeholder="Ask AI Coach (e.g. How was my day?, Why did my score drop?)..."
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isThinking}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-main, #FFFFFF)',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isThinking || !inputQuery.trim()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '10px',
            background:
              isThinking || !inputQuery.trim()
                ? 'rgba(99, 102, 241, 0.3)'
                : 'linear-gradient(135deg, #6366F1 0%, #7C3AED 100%)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '12px',
            cursor: isThinking || !inputQuery.trim() ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Send</span>
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};
