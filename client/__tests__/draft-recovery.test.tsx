import { act, renderHook, waitFor } from '@testing-library/react';
import { useDraftRecovery, setDraftUrl } from '@/features/note/write-note/model/useDraftRecovery';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { draftApi } from '@/features/note/write-note/api/draftApi';

jest.mock('next/navigation', () => ({
  usePathname: () => window.location.pathname,
  useSearchParams: () => new URLSearchParams(window.location.search),
}));
jest.mock('@/features/note/write-note/api/draftApi', () => ({ draftApi: { getDraft: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
  useNoteEditorStore.getState().reset();
  window.history.replaceState(null, '', '/notebook/new?draftId=10');
});

test('reload restores the selected draft identity, content and version', async () => {
  jest.mocked(draftApi.getDraft).mockResolvedValue({ id: 10, version: 4, title: 'saved', content: '<p>body</p>', tags: ['tag'], savedAt: '' });
  const { result } = renderHook(() => useDraftRecovery());
  expect(result.current.isRestoring).toBe(true);
  await waitFor(() => expect(result.current.isRestoring).toBe(false));
  expect(draftApi.getDraft).toHaveBeenCalledWith(10);
  expect(useNoteEditorStore.getState()).toMatchObject({ activeDraftId: '10', draftVersion: 4, title: 'saved', content: '<p>body</p>', tag: ['tag'] });
});

test('failed recovery blocks writes and permits retry', async () => {
  jest.mocked(draftApi.getDraft).mockRejectedValueOnce(new Error('offline'));
  const { result } = renderHook(() => useDraftRecovery());
  await waitFor(() => expect(result.current.error).toBeTruthy());
  expect(result.current.isRestoring).toBe(true);
  jest.mocked(draftApi.getDraft).mockResolvedValue({ id: 10, version: 2, title: 'saved', content: 'body', savedAt: '' });
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.isRestoring).toBe(false));
});

test('URL identity is preserved alongside other parameters and removed on completion', () => {
  window.history.replaceState(null, '', '/notebook/new?source=list');
  setDraftUrl('10');
  expect(window.location.search).toBe('?source=list&draftId=10');
  setDraftUrl(null);
  expect(window.location.search).toBe('?source=list');
});
