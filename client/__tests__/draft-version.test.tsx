import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNoteDraft } from '@/features/note/write-note/model/useNoteDraft';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { draftApi } from '@/features/note/write-note/api/draftApi';
import { ApiError } from '@/shared/api/base';

jest.mock('@/features/note/write-note/api/draftApi', () => ({ draftApi: { saveDraft: jest.fn() } }));
const save = jest.mocked(draftApi.saveDraft);

function wrapper({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient({ defaultOptions: { mutations: { retry: false } } }));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ isLoggedIn: true });
  useNoteEditorStore.getState().reset();
  useNoteEditorStore.getState().initDraft({ id: '10', version: 3, title: 'local title', content: 'local body' });
});

test('conflict preserves typed content and prevents further autosaves', async () => {
  save.mockRejectedValue(new ApiError('conflict', 409));
  const { result } = renderHook(() => useNoteDraft(), { wrapper });
  await act(async () => { expect(await result.current.saveDraft({ silent: true })).toBe(false); });
  expect(save).toHaveBeenCalledWith(expect.objectContaining({ id: 10, version: 3 }));
  expect(useNoteEditorStore.getState()).toMatchObject({ draftConflict: true, title: 'local title', content: 'local body', draftVersion: 3 });
  await act(async () => { await result.current.saveDraft({ silent: true }); });
  expect(save).toHaveBeenCalledTimes(1);
});

test('successful save uses the returned version on the next request', async () => {
  save.mockResolvedValue({ id: 10, version: 4, title: 'local title', content: 'local body', savedAt: '2026-10-05' });
  const { result } = renderHook(() => useNoteDraft(), { wrapper });
  await act(async () => { await result.current.saveDraft({ silent: true }); });
  expect(useNoteEditorStore.getState().draftVersion).toBe(4);
  await act(async () => { await result.current.saveDraft({ silent: true }); });
  expect(save).toHaveBeenLastCalledWith(expect.objectContaining({ id: 10, version: 4 }));
});
