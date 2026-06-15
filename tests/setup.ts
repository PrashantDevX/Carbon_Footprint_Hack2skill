import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('@/lib/firebase', () => ({
  auth:      { currentUser: null, onAuthStateChanged: vi.fn() },
  db:        {},
  storage:   {},
  functions: {},
  analytics: Promise.resolve(null),
  perf:      null,
  remoteConfig: { defaultConfig: {}, settings: {} },
  messaging: Promise.resolve(null),
  default:   {},
}));

// Mock @google/generative-ai
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: { text: () => 'Mocked AI response' },
      }),
      startChat: vi.fn().mockReturnValue({
        sendMessageStream: vi.fn().mockResolvedValue({
          stream: (async function* () { yield { text: () => 'AI chunk' }; })(),
        }),
      }),
    }),
  })),
  HarmBlockThreshold: { BLOCK_MEDIUM_AND_ABOVE: 'BLOCK_MEDIUM_AND_ABOVE' },
  HarmCategory: { HARM_CATEGORY_HARASSMENT: 'HARM_CATEGORY_HARASSMENT' },
}));

// Silence console.warn/error in tests unless explicitly needed
global.console.warn = vi.fn();
global.console.error = vi.fn();
