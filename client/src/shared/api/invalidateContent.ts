import type { QueryClient } from '@tanstack/react-query';
const CONTENT_KEYS = new Set([
  'notes', 'drafts', 'myStories', 'userStories', 'stories', 'story', 'storyDetail', 'storyNotes',
  'recentUpdatesInfinite', 'mostLovedNotes', 'discoverNotes', 'trendingCreators', 'trendingStories',
  'search', 'integratedSearch', 'node-graph', 'graph-related-notes', 'graph', 'popularStories', 'thread-notes', 'thread-stories', 'myTags', 'tags', 'threadNotes', 'threadStories',
]);
export function invalidateContent(client: QueryClient) {
  return client.invalidateQueries({ predicate: query => CONTENT_KEYS.has(String(query.queryKey[0])) });
}
