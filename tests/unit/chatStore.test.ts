import { describe, it, expect, beforeEach } from 'vitest';
import { useChatStore } from '@/store/chatStore';
import { MAX_CHAT_SESSIONS } from '@/lib/constants';

describe('chatStore', () => {
  beforeEach(() => {
    useChatStore.setState({ sessions: [], currentId: null, guestSentCount: 0 });
  });

  it('creates a new session and makes it current', () => {
    const id = useChatStore.getState().newSession();
    const { sessions, currentId } = useChatStore.getState();
    expect(sessions).toHaveLength(1);
    expect(currentId).toBe(id);
    expect(sessions[0].title).toBe('New chat');
  });

  it('titles a session from the first user message and truncates long ones', () => {
    const id = useChatStore.getState().newSession();
    const long = 'a'.repeat(80);
    useChatStore.getState().addMessage(id, { role: 'user', content: long });

    const session = useChatStore.getState().sessions.find((s) => s.id === id)!;
    expect(session.messages).toHaveLength(1);
    expect(session.title.endsWith('…')).toBe(true);
    expect(session.title.length).toBeLessThanOrEqual(41);
  });

  it('does not retitle the session from an assistant message', () => {
    const id = useChatStore.getState().newSession();
    useChatStore.getState().addMessage(id, { role: 'assistant', content: 'Hello there' });
    const session = useChatStore.getState().sessions.find((s) => s.id === id)!;
    expect(session.title).toBe('New chat');
  });

  it('deletes a session and falls back to another current id', () => {
    const first = useChatStore.getState().newSession();
    const second = useChatStore.getState().newSession();
    expect(useChatStore.getState().currentId).toBe(second);

    useChatStore.getState().deleteSession(second);
    const { sessions, currentId } = useChatStore.getState();
    expect(sessions).toHaveLength(1);
    expect(currentId).toBe(first);
  });

  it('tracks and resets the guest message count', () => {
    const { incrementGuestCount, resetGuestCount } = useChatStore.getState();
    incrementGuestCount();
    incrementGuestCount();
    expect(useChatStore.getState().guestSentCount).toBe(2);
    resetGuestCount();
    expect(useChatStore.getState().guestSentCount).toBe(0);
  });

  it('prunes history to the maximum number of sessions', () => {
    for (let i = 0; i < MAX_CHAT_SESSIONS + 5; i++) {
      useChatStore.getState().newSession();
    }
    expect(useChatStore.getState().sessions.length).toBe(MAX_CHAT_SESSIONS);
  });
});
