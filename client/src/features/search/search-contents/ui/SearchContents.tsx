"use client";

import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Tag from "@/shared/ui/tag/Tag";
import RemoveIcon from "@/shared/assets/icons/common/remove-tag.svg";
import { StoryCardModal } from "@/widgets/storycard-modal/StoryCardModal";
import type { Story } from "@/entities/story/story.types";
import { SearchListItem } from "./SearchListItem";
import { SearchResultSection } from "./SearchResultSection";
import { useSearchQuery } from "../model/useSearchQuery";
import { useSearchModalStore } from "../model/useSearchModalStore";
import { PATHS } from "@/shared/constants/paths";
import * as S from "./SearchContents.css";

export function SearchContents() {
  const [keyword, setKeyword] = useState("");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const router = useRouter();
  const { closeSearch } = useSearchModalStore();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const observerTargetRef = useRef<HTMLDivElement | null>(null);

  const {
    tags,
    storyData,
    noteData,
    isLoading,
    isError,
    isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetchSearch,
  } = useSearchQuery(keyword);

  // 무한 스크롤 Observer 설정 (스크롤 하단 도달 시 다음 페이지 자동 로드)
  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refetchSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setKeyword("");
    inputRef.current?.focus();
  };

  const handleNoteClick = (id: number) => {
    closeSearch();
    router.push(PATHS.NOTEBOOK_DETAIL(id));
  };

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
  };

  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={S.container}>
      {/* 1. 디자인 시스템 기반 검색 입력부 및 커스텀 X 버튼 */}
      <div className={S.searchBarWrapper}>
        <input
          ref={inputRef}
          type="search"
          placeholder="태그, 스토리, 노트를 검색해보세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className={S.searchInput}
        />
        {keyword.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className={S.clearButton}
            aria-label="검색어 지우기"
          >
            <RemoveIcon width={16} height={16} />
          </button>
        )}
      </div>

      {isError ? (
        /* 2. 에러 상태 */
        <div>
          <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>데이터를 불러오지 못했습니다.</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>잠시 후 다시 시도하거나 다른 키워드로 검색해주세요.</p>
        </div>
      ) : (
        /* 3. 결과/인기 콘텐츠 영역 */
        <div style={{ opacity: isLoading ? 0.6 : 1 }}>
          {/* 태그 섹션 (서버에서 가져온 실제 인기/연관 태그) */}
          <SearchResultSection
            title={isSearching ? "검색된 태그" : "추천 태그"}
            isEmpty={tags.length === 0}
            emptyMessage="태그가 없습니다."
            isLoading={isLoading}
          >
            <div className={S.tagList}>
              {tags.map((tag) => (
                <Tag
                  key={tag}
                  label={tag}
                  onClick={() => handleTagClick(tag)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
          </SearchResultSection>
          <div className={S.divider} />

          {/* 스토리 섹션 */}
          <SearchResultSection
            title={isSearching ? "스토리 검색 결과" : "많이 조회한 스토리"}
            isEmpty={!storyData || storyData.length === 0}
            emptyMessage="검색된 스토리가 없습니다."
            isLoading={isLoading}
          >
            {storyData?.map((story) => (
              <SearchListItem
                key={story.id}
                title={story.title}
                author={story.author || "익명"}
                meta={`노트 ${story.articleIds?.length || 0}개`}
                isMetaHighlighted={true}
                onClick={() => handleStoryClick(story)}
              />
            ))}
          </SearchResultSection>
          <div className={S.divider} />

          {/* 노트 섹션 */}
          <SearchResultSection
            title={isSearching ? "노트 검색 결과" : "많이 조회한 노트"}
            isEmpty={!noteData || noteData.length === 0}
            emptyMessage="검색된 노트를 찾지 못했습니다."
            isLoading={isLoading}
          >
            {noteData?.map((note) => (
              <SearchListItem
                key={note.id}
                title={note.title}
                author={note.author || "익명"}
                meta={formatDate(note.date)}
                onClick={() => handleNoteClick(note.id)}
              />
            ))}
          </SearchResultSection>

          {/* 4. 무한 스크롤 트리거 영역 */}
          <div ref={observerTargetRef} style={{ height: "20px", marginTop: "12px" }}>
            {isFetchingNextPage && (
              <p style={{ textAlign: "center", fontSize: "0.85rem", opacity: 0.6 }}>
                추가 결과를 불러오는 중...
              </p>
            )}
          </div>
        </div>
      )}

      {/* 5. 스토리 클릭 시 검색창 위에 열리는 스토리 상세 모달 (방식 2) */}
      {selectedStory && (
        <StoryCardModal
          story={selectedStory}
          notes={noteData.filter((n) => selectedStory.articleIds?.includes(n.id))}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </div>
  );
}