import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import { getAITutorResponse } from '../../lib/ai';

const SUGGESTED_QUESTIONS = [
  'What is the Oral Law?',
  'Quiz me!',
  'Explain the chain of transmission',
];

export default function AITutor() {
  const {
    aiTutorMessages,
    aiTutorLoading,
    showAITutor,
    toggleAITutor,
    sendAITutorMessage,
  } = useAppStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiTutorMessages, aiTutorLoading]);

  // Focus input when panel opens
  useEffect(() => {
    if (showAITutor) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [showAITutor]);

  const handleSend = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || aiTutorLoading) return;

      setInput('');
      sendAITutorMessage(text);

      // Build the messages array for the API call
      const allMessages = [
        ...aiTutorMessages,
        { role: 'user' as const, content: text },
      ];

      try {
        const response = await getAITutorResponse(
          allMessages,
          'General Kinneret study context'
        );

        // Update store with assistant response
        useAppStore.setState((state) => ({
          aiTutorMessages: [
            ...state.aiTutorMessages,
            { role: 'assistant' as const, content: response },
          ],
          aiTutorLoading: false,
        }));
      } catch {
        useAppStore.setState((state) => ({
          aiTutorMessages: [
            ...state.aiTutorMessages,
            {
              role: 'assistant' as const,
              content:
                'Sorry, I had trouble processing that. Please try again.',
            },
          ],
          aiTutorLoading: false,
        }));
      }
    },
    [input, aiTutorLoading, aiTutorMessages, sendAITutorMessage]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {showAITutor && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={toggleAITutor}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 z-50 flex flex-col"
            style={{
              width: '400px',
              maxWidth: '100vw',
              height: '100vh',
              backgroundColor: 'var(--bg-base)',
              borderLeft: '1px solid var(--bg-border)',
              boxShadow: '-8px 0 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between shrink-0"
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--bg-border)',
              }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '10px',
                    background:
                      'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                  }}
                >
                  <Sparkles size={16} color="#fff" />
                </div>
                <div>
                  <h2
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    AI Tutor
                  </h2>
                  <p
                    className="text-xs"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Ask me anything about your studies
                  </p>
                </div>
              </div>

              <button
                onClick={toggleAITutor}
                className="flex items-center justify-center transition-opacity hover:opacity-70"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--bg-border)',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                }}
                aria-label="Close AI Tutor"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages area */}
            <div
              className="flex-1 overflow-y-auto"
              style={{ padding: '16px 16px 8px' }}
            >
              {/* Welcome message if empty */}
              {aiTutorMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-8">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '16px',
                      background:
                        'linear-gradient(135deg, rgba(191,90,242,0.15), rgba(79,142,247,0.15))',
                    }}
                  >
                    <Sparkles
                      size={28}
                      style={{ color: 'var(--accent-purple)' }}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Welcome to your AI Tutor
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      I can help explain concepts, quiz you, and support your
                      study sessions.
                    </p>
                  </div>
                </div>
              )}

              {/* Message bubbles */}
              {aiTutorMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex mb-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className="text-sm leading-relaxed"
                    style={{
                      maxWidth: '85%',
                      padding: '10px 14px',
                      borderRadius:
                        msg.role === 'user'
                          ? '14px 14px 4px 14px'
                          : '14px 14px 14px 4px',
                      backgroundColor:
                        msg.role === 'user'
                          ? 'var(--accent-blue)'
                          : 'var(--bg-elevated)',
                      color:
                        msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                      border:
                        msg.role === 'user'
                          ? 'none'
                          : '1px solid var(--bg-border)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator */}
              {aiTutorLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-3"
                >
                  <div
                    className="flex items-center gap-1.5"
                    style={{
                      padding: '12px 18px',
                      borderRadius: '14px 14px 14px 4px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--bg-border)',
                    }}
                  >
                    {[0, 1, 2].map((dot) => (
                      <motion.div
                        key={dot}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: dot * 0.2,
                        }}
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--accent-purple)',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {aiTutorMessages.length === 0 && (
              <div
                className="flex flex-wrap gap-2 shrink-0"
                style={{ padding: '0 16px 12px' }}
              >
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-xs font-medium transition-colors duration-150"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '20px',
                      backgroundColor: 'rgba(191,90,242,0.1)',
                      color: 'var(--accent-purple)',
                      border: '1px solid rgba(191,90,242,0.2)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div
              className="shrink-0"
              style={{
                padding: '12px 16px 16px',
                borderTop: '1px solid var(--bg-border)',
              }}
            >
              <div
                className="flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  borderRadius: '14px',
                  border: '1px solid var(--bg-border-strong)',
                  padding: '4px 4px 4px 14px',
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  disabled={aiTutorLoading}
                  className="flex-1 text-sm bg-transparent outline-none"
                  style={{
                    color: 'var(--text-primary)',
                    border: 'none',
                    fontFamily: 'var(--font-ui)',
                  }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || aiTutorLoading}
                  className="flex items-center justify-center shrink-0 transition-opacity"
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background:
                      input.trim() && !aiTutorLoading
                        ? 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))'
                        : 'var(--bg-overlay)',
                    border: 'none',
                    cursor:
                      input.trim() && !aiTutorLoading
                        ? 'pointer'
                        : 'not-allowed',
                    opacity: input.trim() && !aiTutorLoading ? 1 : 0.4,
                    color: '#fff',
                  }}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
