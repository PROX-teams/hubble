"use client";

import React, { useState, useEffect, useCallback, KeyboardEvent } from "react";
import { Input } from "@/shared/ui/input/input/Input";
import Tag from "@/shared/ui/tag/Tag";
import { SearchListItem } from "./SearchListItem";
import { Story } from "@/entities/story/story.types";
import { Note } from "@/entities/note/note.types";
import * as S from "./SearchContents.css";

interface SearchData {
  tags: string[];
  stories: Story [];
  notes: Note[];
}

export function SearchContents() {


const MOCK_RECOMMENDATIONS = {
  tags: ["Next.js", "React", "TypeScript", "UI/UX", "프론트엔드"],
  stories: [
    { id: 1, title: "프론트엔드 가이드", author: "김철수", articleIds: [1,2,3,4,5,6,7,8,9,10,11] },
    { id: 2, title: "성능 최적화", author: "이영희", articleIds: [1,2,3,4,5]},
  ],
  notes: [
    { id: 1, icon: "📄", title: "React Query", author: "박민수", date: "2024.03.01" },
  ]
};

const MOCK_SEARCH_RESULTS = {
  tags: ["JavaScript", "Tailwind", "Recoil"],
  stories: [
    { id: 3, title: "검색 결과: 디자인 시스템", author: "박지성", articleIds: [1,2,3,4,5,6,7,8,9,10,11] },
  ],
  notes: [
    { id: 2, title: "검색 결과: Next.js 14 업데이트", author: "최지우", date: "2024.02.28" },
  ]
};

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<SearchData>({ tags: [], stories: [], notes: [] });
  const [isLoading, setIsLoading] = useState(false);

  const isSearching = keyword.trim().length > 0;

  // 통합 검색 API 가정
  const loadData = useCallback(async (searchQuery: string, signal?: AbortSignal) => {
  setIsLoading(true);
  
  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, 500);

      signal?.addEventListener("abort", () => {
        clearTimeout(timeout);
        reject(new DOMException("Aborted", "AbortError"));
      });
    });

    const data = searchQuery.trim() 
      ? MOCK_SEARCH_RESULTS 
      : MOCK_RECOMMENDATIONS;

    setResults({
      tags: data.tags || [],
      stories: data.stories || [],
      notes: data.notes || []
    });
  
  } catch (error) {
    const isAbortError = error instanceof Error && error.name === "AbortError";
    if (!isAbortError) {
    console.error("Mock Search error:", error);
    }
  } finally {
    setIsLoading(false);
  }
}, []);

  // 디바운싱 처리 필수
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      loadData(keyword, controller.signal);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [keyword, loadData]);


  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      loadData(keyword);
    }
  };

  const handleTagClick = (tag: string) => {
    setKeyword(tag);
    loadData(tag);
  };

  return (
    <div className={S.container}>
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

      {/* 데이터 렌더링 영역 */}
      <div style={{ opacity: isLoading ? 0.6 : 1 }}>
        
        {/* 1. 태그 섹션 */}
        <section className={S.section}>
          <h3 className={S.sectionTitle}>
            {isSearching ? "검색된 태그" : "추천 태그"}
          </h3>
          <div className={S.tagList}>
            {results.tags.length > 0 ? (
              results.tags.map((tag) => (
                <Tag 
                  key={tag} 
                  label={tag} 
                  onClick={() => handleTagClick(tag)}
                  style={{ cursor: "pointer" }} 
                />
              ))
            ) : (
              !isLoading && <span>태그가 없습니다.</span>
            )}
          </div>
        </section>
        <div className={S.divider} /> 

        {/* 2. 스토리 섹션 */}
        <section className={S.section}>
          <h3 className={S.sectionTitle}>
            {isSearching ? "스토리 검색 결과" : "많이 조회한 스토리"}
          </h3>
          <div className={S.sectionlist}>
            {results.stories.length > 0 ? (
              results.stories.map((story) => (
                <SearchListItem
                  key={story.id}
                  title={story.title}
                  author={story.author}
                  meta={`노트 ${story.articleIds.length}개`}
                  isMetaHighlighted={true}
                />
              ))
            ) : (
              !isLoading && <span >검색된 스토리가 없습니다.</span>
            )}
          </div>
        </section>
        <div className={S.divider} /> 

        {/* 3. 노트 섹션 */}
        <section className={S.section}>
          <h3 className={S.sectionTitle}>
            {isSearching ? "노트 검색 결과" : "많이 조회한 노트"}
          </h3>
          <div className={S.sectionlist}>
            {results.notes.length > 0 ? (
              results.notes.map((note) => (
                <SearchListItem
                  key={note.id}
                  title={note.title}
                  author={note.author}
                  meta={note.date}
                />
              ))
            ) : (
              !isLoading && <span>검색된 노트가 없습니다.</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}