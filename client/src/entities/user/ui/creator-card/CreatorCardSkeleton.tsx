import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import * as s from './CreatorCard.css';

/**
 * CreatorCard 로딩 상태를 나타내는 스켈레톤 컴포넌트입니다.
 * 기존 CreatorCard의 컨테이너 레이아웃 규격을 그대로 재활용합니다.
 */
export const CreatorCardSkeleton = () => {
  return (
    <div className={s.container} style={{ pointerEvents: 'none', cursor: 'default' }}>
      {/* 아바타 원형 스켈레톤 */}
      <Skeleton width="40px" height="40px" borderRadius="50%" style={{ flexShrink: 0 }} />

      {/* 텍스트 영역 스켈레톤 */}
      <div className={s.contentWrapper}>
        <Skeleton width="50%" height="15px" borderRadius="4px" />
        <Skeleton width="80%" height="12px" borderRadius="4px" style={{ marginTop: '4px' }} />
      </div>
    </div>
  );
};
