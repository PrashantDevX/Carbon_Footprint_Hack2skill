import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { uid } from '@/lib/utils';
import { MAX_CHAT_SESSIONS } from '@/lib/constants';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatState {
  sessions: ChatSession[];
  currentId: string | null;
  /** Lifetime count of user messages sent — used to rate-limit guests. */
  guestSentCount: number;
  newSession: () => string;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;
  addMessage: (sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  incrementGuestCount: () => void;
  resetGuestCount: () => void;
}

function createSession(): ChatSession {
  return { id: uid('chat'), title: 'New chat', messages: [], createdAt: new Date().toISOString() };
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessions: [],
      currentId: null,
      guestSentCount: 0,

      newSession: () => {
        const session = createSession();
        set((state) => ({
          sessions: [session, ...state.sessions].slice(0, MAX_CHAT_SESSIONS),
          currentId: session.id
        }));
        return session.id;
      },

      selectSession: (id) => set({ currentId: id }),

      deleteSession: (id) =>
        set((state) => {
          const sessions = state.sessions.filter((session) => session.id !== id);
          const currentId = state.currentId === id ? sessions[0]?.id ?? null : state.currentId;
          return { sessions, currentId };
        }),

      addMessage: (sessionId, message) =>
        set((state) => ({
          sessions: state.sessions.map((session) => {
            if (session.id !== sessionId) return session;
            const messages = [...session.messages, { ...message, id: uid('msg'), timestamp: new Date().toISOString() }];
            // Title the session from the first user message.
            const title =
              session.title === 'New chat' && message.role === 'user'
                ? message.content.slice(0, 40) + (message.content.length > 40 ? '…' : '')
                : session.title;
            return { ...session, messages, title };
          })
        })),

      incrementGuestCount: () => set((state) => ({ guestSentCount: state.guestSentCount + 1 })),
      resetGuestCount: () => set({ guestSentCount: 0 })
    }),
    { name: 'ecotrack-chat-store' }
  )
);
