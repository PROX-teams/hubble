'use client';

import React from 'react';
import CreatorCard from '@/entities/user/ui/creator-card/CreatorCard';
import { CreatorCardSkeleton } from '@/entities/user/ui/creator-card/CreatorCardSkeleton';
import { useTrendingCreators } from '@/entities/recommend/model/useMainRecommendations';
import * as s from './TrendingCreatorsSection.css';

const SKELETON_COUNT = 5;
const EMPTY_MESSAGE = '등록된 크리에이터가 없습니다.';

/**
 * 메인 페이지 인기 크리에이터(Trending Creators) 사이드바 위젯
 * - 자체 쿼리 훅(useTrendingCreators)을 통해 데이터를 자율적으로 페칭 및 렌더링
 * - 로딩(Skeleton), 빈 데이터(Empty), 실제 리스트 렌더링 상태를 자체 통제
 */
export const TrendingCreatorsSection = () => {
  const { creators, isLoading } = useTrendingCreators();

  return (
    <aside className={s.creatorsSection}>
      <h2 className={s.sectionTitle}>Trending Creators</h2>
      <div className={s.creatorsWrapper}>
        {isLoading ? (
          <CreatorCardSkeleton count={SKELETON_COUNT} />
        ) : creators.length === 0 ? (
          <div className={s.emptyMessage}>{EMPTY_MESSAGE}</div>
        ) : (
          creators.map((creator) => (
            <CreatorCard
              key={creator.userId}
              userId={creator.userId}
              name={creator.name}
              imageUrl={creator.imageUrl}
              introduction={creator.introduction}
            />
          ))
        )}
      </div>
    </aside>
  );
};
