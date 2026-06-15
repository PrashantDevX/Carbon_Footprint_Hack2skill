import { describe, it, expect } from 'vitest';
import { getAuthErrorMessage } from '@/contexts/AuthContext';

describe('getAuthErrorMessage', () => {
  it('maps popup-closed to a friendly retry message', () => {
    expect(getAuthErrorMessage({ code: 'auth/popup-closed-by-user' })).toMatch(/cancelled/i);
  });

  it('maps operation-not-allowed to a configuration hint', () => {
    expect(getAuthErrorMessage({ code: 'auth/operation-not-allowed' })).toMatch(/not enabled/i);
  });

  it('maps network failures to a connection message', () => {
    expect(getAuthErrorMessage({ code: 'auth/network-request-failed' })).toMatch(/network/i);
  });

  it('maps unauthorized-domain to an actionable message', () => {
    expect(getAuthErrorMessage({ code: 'auth/unauthorized-domain' })).toMatch(/domain/i);
  });

  it('falls back to the error message for unknown codes', () => {
    expect(getAuthErrorMessage({ code: 'auth/weird', message: 'Boom' })).toBe('Boom');
  });

  it('returns a generic message when nothing is provided', () => {
    expect(getAuthErrorMessage({})).toMatch(/something went wrong/i);
  });
});
