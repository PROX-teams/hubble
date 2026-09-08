import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as S from './StoryCard.css';

interface StoryCardSkeletonProps {
  density?: 'compact' | 'comfortable';
}

/**
 * StoryCard 로딩 상태를 시각적으로 나타내는 스켈레톤 컴포넌트입니다.
 * 기존 StoryCard의 CSS 레시피와 규격을 그대로 재활용하여 레이아웃 시프트를 방지합니다.
 */
export const StoryCardSkeleton = ({ density = 'comfortable' }: StoryCardSkeletonProps) => {
  return (
    <div className={S.storyCard({ density })} style={{ pointerEvents: 'none', cursor: 'default' }}>
      {/* 헤더: 아이콘 + 제목 + 카운트 */}
      <div className={S.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '70%' }}>
          <Skeleton width="24px" height="24px" borderRadius="4px" style={{ flexShrink: 0 }} />
          <Skeleton width="60%" height="20px" borderRadius="4px" />
        </div>
        <Skeleton width="32px" height="18px" borderRadius="4px" />
      </div>

      {/* 설명글 영역 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '12px' }}>
        <Skeleton width="92%" height="15px" borderRadius="4px" />
        <Skeleton width="80%" height="15px" borderRadius="4px" />
        <Skeleton width="60%" height="15px" borderRadius="4px" />
      </div>
    </div>
  );
};
