import React from "react";
import { Skeleton } from "@/shared/ui/skeleton/Skeleton";
import * as S from "./SearchContents.css";

/**
 * 검색 모달 최초 마운트 시 추천/인기 데이터 로딩 중에 표시되는 스켈레톤 UI
 * - 레이아웃 시프트(CLS)를 방지하고 고급스러운 초기 로딩 인터랙션을 제공합니다.
 */
export function SearchContentsSkeleton() {
  return (
    <div style={{ padding: "4px 0" }}>
      {/* 1. 추천 태그 스켈레톤 */}
      <div className={S.section}>
        <Skeleton
          width="60px"
          height="14px"
          borderRadius="4px"
          style={{ marginBottom: "12px" }}
        />
        <div className={S.tagList}>
          <Skeleton width="64px" height="28px" borderRadius="14px" />
          <Skeleton width="80px" height="28px" borderRadius="14px" />
          <Skeleton width="56px" height="28px" borderRadius="14px" />
          <Skeleton width="72px" height="28px" borderRadius="14px" />
        </div>
      </div>

      <div className={S.divider} />

      {/* 2. 추천 콘텐츠(스토리/노트) 리스트 스켈레톤 */}
      <div className={S.section}>
        <Skeleton
          width="80px"
          height="14px"
          borderRadius="4px"
          style={{ marginBottom: "12px" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flex: 1,
                }}
              >
                <Skeleton width="18px" height="18px" borderRadius="4px" />
                <Skeleton width="50%" height="16px" borderRadius="4px" />
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Skeleton width="48px" height="14px" borderRadius="4px" />
                <Skeleton width="36px" height="14px" borderRadius="4px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
