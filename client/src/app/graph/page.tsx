'use client';

import React, { Suspense, useState, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { CategoryType } from '@/shared/types';
import { AppToggleGroup } from '@/shared/ui/toggle/app-toggle-group/AppToggleGroup';
import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import { useGraphQuery } from '@/entities/graph/api/useGraphQuery';
import { NodeGraphCanvas } from '@/features/graph/ui/NodeGraphCanvas';
import { RelatedNotesPanel } from '@/features/graph/ui/RelatedNotesPanel';
import { useGraphExploration } from '@/features/graph/model/useGraphExploration';
import * as S from './page.css';

// 카테고리 탭 레이블 매핑 (화면설계서와 1:1 일치)
const CATEGORY_TABS: { label: string; category: CategoryType }[] = [
  { label: '기획', category: 'PLANNING' },
  { label: '디자인', category: 'DESIGN' },
  { label: '프로그래밍', category: 'DEVELOPMENT' },
];

function NodeGraphContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. URL 쿼리 파라미터 파싱
  const currentCategory: CategoryType = useMemo(() => {
    const cat = searchParams.get('category') as CategoryType;
    const isValid = CATEGORY_TABS.some((t) => t.category === cat);
    return isValid ? cat : 'DEVELOPMENT';
  }, [searchParams]);

  const currentTag = useMemo(() => {
    return searchParams.get('tag')?.trim() || undefined;
  }, [searchParams]);

  // 우측 사이드바 노트 목록 페이지네이션 상태 (0-indexed)
  const [notePage, setNotePage] = useState(0);
  const [pageInfo, setPageInfo] = useState({
    totalPages: 1,
    isFirst: true,
    isLast: true,
  });

  // 2. 백엔드 그래프 데이터 조회
  const {
    data: graphData,
    isPending: isGraphPending,
    isError: isGraphError,
    refetch: refetchGraph,
  } = useGraphQuery(currentCategory);
  const {
    graphData: explorationData,
    expandTag,
    expandingTagNames,
    expandedTagNames,
    hasMoreTagNames,
    expansionError,
  } = useGraphExploration(currentCategory, graphData);

  // 3. URL 쿼리 업데이트 헬퍼 (스크롤 튐 방지)
  const updateUrl = useCallback(
    (cat: CategoryType, tag?: string) => {
      const params = new URLSearchParams();
      if (cat !== 'DEVELOPMENT') {
        params.set('category', cat);
      }
      if (tag && tag.trim()) {
        params.set('tag', tag.trim());
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname]
  );

  // 카테고리 탭 변경 핸들러
  const handleCategoryChange = useCallback(
    (label: string) => {
      const target = CATEGORY_TABS.find((t) => t.label === label);
      if (target) {
        setNotePage(0); // 페이지 리셋
        setPageInfo({ totalPages: 1, isFirst: true, isLast: true });
        updateUrl(target.category, undefined); // 카테고리 변경 시 이전 태그 선택 해제
      }
    },
    [updateUrl]
  );

  // 노드 클릭 핸들러
  const handleSelectTag = useCallback(
    (tagName: string) => {
      setNotePage(0); // 태그 변경 시 0페이지 리셋
      setPageInfo({ totalPages: 1, isFirst: true, isLast: true });

      // 1레벨 카테고리 노드 클릭 시 태그 선택 해제
      if (tagName === '개발' || tagName === '디자인' || tagName === '기획') {
        updateUrl(currentCategory, undefined);
        return;
      }

      if (currentTag !== tagName) updateUrl(currentCategory, tagName);
    },
    [currentCategory, currentTag, updateUrl]
  );

  // 현재 활성화된 카테고리 한글 레이블
  const activeTabLabel = useMemo(() => {
    return CATEGORY_TABS.find((t) => t.category === currentCategory)?.label || '프로그래밍';
  }, [currentCategory]);

  return (
    <div className={S.container}>
      {/* 1. 상단 헤더 행: 캔버스와 사이드바의 상단 컨트롤을 동일 수평 바닥선으로 정렬 */}
      <div className={S.headerRow}>
        {/* 캔버스 상단 (좌: 브레드크럼/타이틀, 우: 카테고리 탭) */}
        <div className={S.mainHeaderArea}>
          <div className={S.titleSection}>
            <nav className={S.breadcrumb} aria-label="Breadcrumb">
              <span>{activeTabLabel}</span>
              {currentTag && (
                <>
                  <span>/</span>
                  <span className={S.breadcrumbActive}>{currentTag}</span>
                </>
              )}
            </nav>
            <h1 className={S.title}>Node Graph</h1>
          </div>

          <AppToggleGroup
            type="page"
            value={activeTabLabel}
            onValueChange={(val) => val && handleCategoryChange(val as string)}
          >
            {CATEGORY_TABS.map((tab) => (
              <AppToggleGroup.Item key={tab.label} value={tab.label} />
            ))}
          </AppToggleGroup>
        </div>

        {/* 사이드바 상단 (우측 끝 정렬: << >> 페이지네이션) */}
        <div className={S.sidebarHeaderArea}>
          <div className={S.sidebarPaginationGroup}>
            <button
              type="button"
              className={S.sidebarPaginationBtn}
              onClick={() => setNotePage((prev) => Math.max(0, prev - 1))}
              disabled={pageInfo.isFirst}
              title="이전 노트 목록 (<<)"
              aria-label="이전 노트 목록"
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              className={S.sidebarPaginationBtn}
              onClick={() => setNotePage((prev) => prev + 1)}
              disabled={pageInfo.isLast}
              title="다음 노트 목록 (>>)"
              aria-label="다음 노트 목록"
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>

      {/* 2. 본문 행: 캔버스와 첫 번째 카드의 윗변(Top Border)이 정확히 동일한 수평선에서 시작 */}
      <div className={S.contentRow}>
        <div className={S.canvasWrapper}>
          {isGraphPending ? (
            <Skeleton width="100%" height="100%" borderRadius="16px" />
          ) : isGraphError ? (
            <div className={S.canvasState} role="alert">
              <p>그래프를 불러오지 못했습니다.</p>
              <button type="button" className={S.canvasRetryButton} onClick={() => void refetchGraph()}>다시 시도</button>
            </div>
          ) : (
            <NodeGraphCanvas
              data={explorationData ?? graphData}
              selectedTag={currentTag}
              onSelectTag={handleSelectTag}
              onExpandTag={expandTag}
              expandingTagNames={expandingTagNames}
              expandedTagNames={expandedTagNames}
              hasMoreTagNames={hasMoreTagNames}
              expansionError={expansionError}
            />
          )}
        </div>

        <div className={S.sidebarWrapper}>
          <RelatedNotesPanel
            category={currentCategory}
            selectedTag={currentTag}
            page={notePage}
            onPageInfoChange={setPageInfo}
          />
        </div>
      </div>
    </div>
  );
}

function NodeGraphSkeleton() {
  return (
    <div className={S.container}>
      <div className={S.headerRow}>
        <div className={S.mainHeaderArea}>
          <div className={S.titleSection}>
            <Skeleton width="120px" height="18px" borderRadius="4px" />
            <Skeleton width="200px" height="36px" borderRadius="8px" />
          </div>
          <Skeleton width="240px" height="40px" borderRadius="10px" />
        </div>
        <div className={S.sidebarHeaderArea}>
          <Skeleton width="60px" height="32px" borderRadius="6px" />
        </div>
      </div>
      <div className={S.contentRow}>
        <div className={S.canvasWrapper}>
          <Skeleton width="100%" height="100%" borderRadius="16px" />
        </div>
        <div className={S.sidebarWrapper}>
          <Skeleton width="100%" height="100%" borderRadius="16px" />
        </div>
      </div>
    </div>
  );
}

/**
 * Next.js 15 Suspense 경계로 감싸진 노드 그래프 메인 페이지
 */
export default function GraphPage() {
  return (
    <Suspense fallback={<NodeGraphSkeleton />}>
      <NodeGraphContent />
    </Suspense>
  );
}
