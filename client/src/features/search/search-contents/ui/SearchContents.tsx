"use client";

import React, { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/shared/ui/input/input/Input";
import Tag from "@/shared/ui/tag/Tag";
import { SearchListItem } from "./SearchListItem";
import { SearchResultSection } from "./SearchResultSection";
import { useSearchQuery } from "../model/useSearchQuery";
import { useSearchModalStore } from "../model/useSearchModalStore";
import { PATHS } from "@/shared/constants/paths";
import * as S from "./SearchContents.css";

export function SearchContents() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const { closeSearch } = useSearchModalStore();
  const { 
    storyData, 
    noteData, 
    isLoading, 
    isError,
    isSearching, 
    refetchSearch 
  } = useSearchQuery(keyword);

  // 추천 태그 (상수) API 개발 시 연동 예정
  const RECOMMEND_TAGS = ["Next.js", "React", "TypeScript", "UI/UX", "프론트엔드"];

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refetchSearch();
    }
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
  };

  const handleNoteClick = (id: number) => {
    closeSearch();
    router.push(PATHS.NOTEBOOK_DETAIL(id));
  };

  return (
    <div className={S.container}>
      {/* 1. 검색 입력부 */}
      <Input
        type="search"
        placeholder="태그, 스토리, 노트를 검색해보세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown} 
        variant="solid"           
        size="lg"               
        className={S.searchInput}
      />

      {isError ? (
        /* 2. 에러 상태 */
        // 추후 디자인을 요구함
        <div>
          <p style={{ fontSize: "1.1rem", marginBottom: "8px" }}>데이터를 불러오지 못했습니다.</p>
          <p style={{ fontSize: "0.9rem", opacity: 0.7 }}>잠시 후 다시 시도하거나 다른 키워드로 검색해주세요.</p>
        </div>
      ) : (
        /* 3. 결과/인기 콘텐츠 영역 */
        <div style={{ opacity: isLoading ? 0.6 : 1 }}>

          {/* 태그 섹션 */}
          <SearchResultSection
            title={isSearching ? "검색된 태그" : "추천 태그"}
            isEmpty={RECOMMEND_TAGS.length === 0}
            emptyMessage="태그가 없습니다."
            isLoading={isLoading}
          >
            <div className={S.tagList}>
              {RECOMMEND_TAGS.map((tag) => (
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
              />
            ))}
          </SearchResultSection>
          <div className={S.divider} /> 

          {/* 노트 섹션 */}
          <SearchResultSection
            title={isSearching ? "노트 검색 결과" : "많이 조회한 노트"}
            isEmpty={!noteData || noteData.length === 0}
            emptyMessage="검색된 노트가 없습니다."
            isLoading={isLoading}
          >
            {noteData?.map((note) => (
              <SearchListItem
                key={note.id}
                title={note.title}
                author={note.author || "익명"}
                // 추후 날짜 유틸함수로 분리필요
                meta={note.date?.toString().split('T')[0] || ""}
                onClick={() => handleNoteClick(note.id)}
              />
            ))}
          </SearchResultSection>
        </div>
      )}
    </div>
  );
}