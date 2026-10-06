import React from 'react';
import { act, renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePublishNote } from '@/widgets/notebook-meta-sidebar/notebook-meta-editor/model/usePublishNote';
import { useNoteEditorStore } from '@/features/note/write-note/model/useNoteEditorStore';
import { useAuthStore } from '@/entities/user/model/useAuthStore';
import { createNote, updateNote } from '@/entities/note/api/note.api';
import { ApiError } from '@/shared/api/base';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('@/entities/note/api/note.api', () => ({ createNote: jest.fn(), updateNote: jest.fn() }));
function wrapper({ children }: { children: React.ReactNode }) {
  const [client] = React.useState(() => new QueryClient());
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
beforeEach(() => {
  jest.clearAllMocks();
  useAuthStore.setState({ isLoggedIn: true, user: { id: 1 } as never });
  useNoteEditorStore.getState().reset();
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

test('publishing passes draft version and keeps content on conflict', async () => {
  useNoteEditorStore.getState().initDraft({ id: '10', version: 3, title: 'my title', content: '<p>my content</p>' });
  jest.mocked(createNote).mockRejectedValue(new ApiError('draft conflict', 409));
  const { result } = renderHook(() => usePublishNote(), { wrapper });
  await act(async () => { await result.current.handlePublish(); });
  expect(createNote).toHaveBeenCalledWith(expect.objectContaining({ draftId: 10, draftVersion: 3 }), expect.any(String));
  expect(useNoteEditorStore.getState()).toMatchObject({ title: 'my title', content: '<p>my content</p>', draftConflict: true, isPublishing: false });
});

test('reopened editing draft uses its original published version', async () => {
  useNoteEditorStore.getState().initDraft({ id: '10', version: 2, noteId: 20, baseNoteVersion: 3, title: 'edited', content: '<p>edited</p>' });
  jest.mocked(updateNote).mockRejectedValue(new ApiError('published conflict', 409));
  const { result } = renderHook(() => usePublishNote(), { wrapper });
  await act(async () => { await result.current.handlePublish(); });
  expect(updateNote).toHaveBeenCalledWith(20, expect.objectContaining({ draftId: 10, draftVersion: 2, noteVersion: 3 }));
  expect(useNoteEditorStore.getState().draftConflict).toBe(true);
});


test('lost response retries the exact same publication with the same key', async () => {
  useNoteEditorStore.getState().setTitle('my title');
  useNoteEditorStore.getState().setContent('<p>my content</p>');
  jest.mocked(createNote).mockRejectedValueOnce(new TypeError('Network failure'))
    .mockResolvedValueOnce({ id: 123 } as never);
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const { result } = renderHook(() => usePublishNote(), { wrapper });
  await act(async () => { await result.current.handlePublish(); });
  const first = jest.mocked(createNote).mock.calls[0];
  expect(useNoteEditorStore.getState().title).toBe('my title');
  await act(async () => { await result.current.handlePublish(); });
  expect(jest.mocked(createNote).mock.calls[1]).toEqual(first);
});
