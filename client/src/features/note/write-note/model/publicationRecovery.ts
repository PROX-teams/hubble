import type { NoteCreateRequest } from '@/entities/note/note.types';
import { ApiError } from '@/shared/api/base';
import { createNote } from '@/entities/note/api/note.api';
interface Pending { key: string; fingerprint: string }
const pending = new Map<number, Pending>();
const storageKey = (userId: number) => `hubble:publication:${userId}`;
export const publicationFingerprint = (payload: NoteCreateRequest) => JSON.stringify(JSON.parse(JSON.stringify(payload)));
export function readPendingPublication(userId: number): Pending | undefined {
  if (pending.has(userId)) return pending.get(userId);
  try {
    const raw = sessionStorage.getItem(storageKey(userId));
    if (!raw) return undefined;
    const value = JSON.parse(raw);
    // Upgrade the previous format without reusing or sending its stored body.
    if (typeof value.key !== 'string') return undefined;
    const record = { key: value.key, fingerprint: value.fingerprint ?? publicationFingerprint(value.payload) };
    pending.set(userId, record);
    return record;
  } catch { return undefined; }
}
export function beginPublication(userId: number, payload: NoteCreateRequest): Pending {
  const record = { key: crypto.randomUUID(), fingerprint: publicationFingerprint(payload) };
  pending.set(userId, record);
  try { sessionStorage.setItem(storageKey(userId), JSON.stringify(record)); } catch { /* Memory fallback. */ }
  return record;
}
export function clearPendingPublication(userId: number) {
  pending.delete(userId);
  try { sessionStorage.removeItem(storageKey(userId)); } catch { /* Memory fallback. */ }
}
export const isRetryablePublicationError = (error: unknown) =>
  error instanceof TypeError || (error instanceof ApiError &&
    (error.status >= 500 || error.status === 408 || error.status === 429));
export async function publishWithRetry(payload: NoteCreateRequest, key: string) {
  for (let attempt = 0; ; attempt++) {
    try { return await createNote(payload, key); }
    catch (error) {
      if (!isRetryablePublicationError(error) || attempt === 2) throw error;
      await new Promise(resolve => setTimeout(resolve, 300 * 2 ** attempt));
    }
  }
}
