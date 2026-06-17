import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Plus, Trash2, MessageSquare, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { askGemini } from '@/lib/gemini';
import { useAuth } from '@/contexts/AuthContext';
import { useCarbon } from '@/hooks/useCarbon';
import { useChatStore } from '@/store/chatStore';
import { GUEST_MESSAGE_LIMIT } from '@/lib/constants';
import { Markdown } from '@/components/ui/Markdown';
import { cn } from '@/lib/utils';

const SUGGESTED_PROMPTS = [
  'What is my biggest source of emissions?',
  'Give me 3 quick wins to cut my footprint',
  'How does my score compare to a good target?'
];

export function Assistant() {
  const { user } = useAuth();
  const { result } = useCarbon();
  const { sessions, currentId, guestSentCount, newSession, selectSession, deleteSession, addMessage, incrementGuestCount } =
    useChatStore();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGuest = Boolean(user?.isGuest);
  const guestRemaining = Math.max(0, GUEST_MESSAGE_LIMIT - guestSentCount);
  const guestBlocked = isGuest && guestRemaining === 0;

  // Ensure there is always an active session.
  useEffect(() => {
    if (!currentId || !sessions.some((s) => s.id === currentId)) {
      newSession();
    }
  }, [currentId, sessions, newSession]);

  const session = sessions.find((s) => s.id === currentId) ?? null;
  const messages = useMemo(() => session?.messages ?? [], [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !currentId || guestBlocked) return;

    addMessage(currentId, { role: 'user', content: trimmed });
    if (isGuest) incrementGuestCount();
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await askGemini(trimmed, {
        displayName: user?.displayName,
        monthlyKgCO2e: Math.round(result.monthlyKgCO2e),
        annualKgCO2e: Math.round(result.annualKgCO2e),
        score: result.score,
        topCategory: result.topCategory?.category,
        categoryBreakdown: result.categories?.map((c) => ({ category: c.category, kgCO2e: Math.round(c.kgCO2e) }))
      });
      addMessage(currentId, { role: 'assistant', content: aiResponse });
    } catch (error) {
      console.error(error);
      addMessage(currentId, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendMessage(input);
  };

  return (
    <div className="grid h-[calc(100dvh-12rem)] gap-4 lg:h-[calc(100vh-8rem)] lg:grid-cols-[260px_1fr]">
      {/* History sidebar */}
      <aside className="hidden flex-col rounded-2xl border border-gray-200 bg-white/70 p-3 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/70 lg:flex">
        <button
          onClick={() => newSession()}
          className="mb-3 flex items-center justify-center gap-2 rounded-xl bg-forest-600 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500"
        >
          <Plus className="h-4 w-4" aria-hidden="true" /> New chat
        </button>
        <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-gray-400">History</p>
        <nav className="flex-1 space-y-1 overflow-y-auto" aria-label="Chat history">
          {sessions.length === 0 && <p className="px-2 text-sm text-gray-400">No conversations yet.</p>}
          {sessions.map((s) => (
            <div
              key={s.id}
              className={cn(
                'group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors',
                s.id === currentId
                  ? 'bg-forest-50 text-forest-700 dark:bg-forest-900/30 dark:text-forest-300'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
              )}
            >
              <button onClick={() => selectSession(s.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                <MessageSquare className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{s.title}</span>
              </button>
              <button
                onClick={() => deleteSession(s.id)}
                aria-label={`Delete chat: ${s.title}`}
                className="shrink-0 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </nav>
      </aside>

      {/* Chat panel */}
      <div className="flex min-h-0 flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-forest-100 p-3 text-forest-600 dark:bg-forest-900/30 dark:text-forest-400">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">AI Sustainability Assistant</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Google Gemini · context-aware</p>
            </div>
          </div>
          <button
            onClick={() => newSession()}
            className="flex items-center gap-1.5 rounded-xl border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 lg:hidden"
          >
            <Plus className="h-4 w-4" /> New
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white/50 shadow-xl backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/50">
          <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                <Bot className="mb-3 h-12 w-12 opacity-30" aria-hidden="true" />
                <p className="font-medium text-gray-600 dark:text-gray-300">
                  Hello {user?.displayName?.split(' ')[0] || 'there'}! Ask me anything about your footprint.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-500">
                    <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.role === 'user'
                      ? 'rounded-tr-sm bg-forest-600 text-white'
                      : 'rounded-tl-sm bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-200'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <Markdown content={msg.content} />
                  ) : (
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                  )}
                  <div className={`mt-2 text-xs ${msg.role === 'user' ? 'text-forest-200' : 'text-gray-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.role === 'user' && (
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-300" aria-hidden="true" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-4">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-500">
                  <Bot className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="flex gap-2 rounded-2xl rounded-tl-sm bg-gray-100 px-5 py-4 dark:bg-gray-700/50">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0.4s' }} />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 bg-white/80 p-4 backdrop-blur-md dark:border-gray-700 dark:bg-gray-800/80">
            {guestBlocked ? (
              <div className="flex flex-col items-center gap-2 rounded-xl bg-earth-50 p-4 text-center dark:bg-earth-900/20">
                <Lock className="h-5 w-5 text-earth-600 dark:text-earth-400" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  You've used all {GUEST_MESSAGE_LIMIT} free guest messages.
                </p>
                <Link to="/auth" className="text-sm font-semibold text-forest-600 hover:underline dark:text-forest-400">
                  Sign in with Google for unlimited chat →
                </Link>
              </div>
            ) : (
              <>
                {messages.length === 0 && (
                  <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Suggested questions">
                    {SUGGESTED_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        disabled={isLoading}
                        className="rounded-full border border-forest-200 bg-forest-50 px-3 py-1.5 text-xs text-forest-700 transition-colors hover:bg-forest-100 disabled:opacity-50 dark:border-forest-800 dark:bg-forest-900/30 dark:text-forest-300 sm:text-sm"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
                <form onSubmit={handleSend} className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about reducing your carbon footprint…"
                    aria-label="Message the AI assistant"
                    className="w-full rounded-xl border-transparent bg-gray-100 px-4 py-3 pr-12 text-gray-800 outline-none transition-all focus:border-forest-500 focus:bg-white dark:bg-gray-900 dark:text-gray-200 dark:focus:bg-gray-800"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 rounded-lg bg-forest-600 p-2 text-white transition-colors hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
                {isGuest && (
                  <p className="mt-2 text-center text-xs text-gray-400">
                    Guest mode · {guestRemaining} of {GUEST_MESSAGE_LIMIT} free messages left
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
