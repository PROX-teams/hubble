'use client';

import React, { useState, useMemo } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Breadcrumb } from '@/shared/ui/breadcrumb/Breadcrumb';
import { noteQueries } from '@/entities/note/model/noteQueries';
import { getStoryDetail } from '@/entities/story/api/story.api';
import { useNotebookNotes } from '@/entities/note/model/useMyNotes';
import { BookmarkButton } from '@/features/note/bookmark-note/ui/BookmarkButton';
import { LikeButton } from '@/features/note/like-note/ui/LikeButton';
import { SidebarButton } from '@/features/sidebar/SidebarButton';
import { StoryCardModal } from '@/widgets/storycard-modal/StoryCardModal';
import * as S from './ArticleHeader.css';

/**
 * 에디터 및 단일 노트 상세 페이지 상단 브레드크럼 헤더 위젯
 */
export const ArticleHeader = () => {
  const params = useParams();
  const pathname = usePathname();
  const noteId = params.id ? Number(params.id) : null;
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  // 1. 노트 상세 정보 조회 (queryOptions 적용)
  const { data: note } = useQuery(noteQueries.detail(noteId));


  // 2. 노트가 속한 스토리 정보 조회
  const { data: story } = useQuery({
    queryKey: ['story', note?.storyId],
    queryFn: () => getStoryDetail(note!.storyId!),
    enabled: !!note?.storyId,
  });

  // 3. 해당 작성자의 노트 목록 조회 (스토리 모달 내부 노트 그리드 전달용)
  const { notes: authorNotes } = useNotebookNotes({
    userId: note?.authorId,
    size: 100,
  });

  // 스토리 모달에 넘겨줄 해당 스토리의 노트들
  const storyNotes = useMemo(() => {
    if (!story) return [];
    if (!authorNotes || authorNotes.length === 0) {
      return note ? [note] : [];
    }
    const matched = authorNotes.filter((n) => story.articleIds?.includes(n.id));
    return matched.length > 0 ? matched : (note ? [note] : []);
  }, [story, authorNotes, note]);

  // 경로 및 데이터에 따른 브레드크럼 아이템 구성
  const isWritePage = pathname?.includes('/new');
  const isEditOrWritePage = pathname?.includes('/new') || pathname?.endsWith('/edit');

  const renderBreadcrumbContent = () => {
    // 1. 노트 상세/수정 페이지일 경우: [스토리 제목] / [노트 제목]
    if (noteId) {
      const storyTitle = story?.title || (note?.storyId ? 'Loading...' : '기본 노트북');
      const noteTitle = note?.title || 'Loading...';
      const isStoryClickable = Boolean(note?.storyId && story);

      return (
        <>
          <Breadcrumb.Item>
            {isStoryClickable ? (
              <button
                type="button"
                className={S.storyButton}
                onClick={() => setIsStoryModalOpen(true)}
                title="스토리 모달 열기"
              >
                {storyTitle}
              </button>
            ) : (
              <span>{storyTitle}</span>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{noteTitle}</Breadcrumb.Item>
        </>
      );
    }

    // 2. 새 노트 작성 페이지일 경우: [기본 노트북] / [새 노트 작성]
    if (isWritePage) {
      return (
        <>
          <Breadcrumb.Item>기본 노트북</Breadcrumb.Item>
          <Breadcrumb.Item active>새 노트 작성</Breadcrumb.Item>
        </>
      );
    }

    // 3. 기타 기본값
    return (
      <>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Notebook</Breadcrumb.Item>
      </>
    );
  };

  return (
    <>
      <header className={S.header}>
        <Breadcrumb>
          <Breadcrumb.List>{renderBreadcrumbContent()}</Breadcrumb.List>
        </Breadcrumb>

        {/* 일반 노트 상세 조회 화면에서만 우측 좋아요 / 북마크 토글 버튼 노출 */}
        {noteId && note && !isEditOrWritePage && (
          <div className={S.actionsWrapper}>
            <LikeButton
              noteId={noteId}
              isLiked={note.isLiked}
              likeCount={note.likeCount}
            />
            <BookmarkButton
              noteId={noteId}
              isBookmarked={note.isBookmarked}
              bookmarkCount={note.bookmarkCount}
            />
          </div>
        )}
      </header>

      {/* 사이드바 열림/닫힘과 무관하게 항상 동일 좌표(top: 56px, right: 20px)에 떠 있는 단일 고정 버튼 */}
      <SidebarButton />

      {/* 브레드크럼 스토리 클릭 시 열리는 스토리 상세 모달 */}
      {isStoryModalOpen && story && (
        <StoryCardModal
          story={story}
          notes={storyNotes}
          onClose={() => setIsStoryModalOpen(false)}
        />
      )}
    </>
  );
};

export default ArticleHeader;
