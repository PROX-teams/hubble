import { Skeleton } from '@/shared/ui/skeleton/Skeleton';
import { container, contentContainer } from './NoteCard.css';
import type { Variant } from './NoteCard';

interface NoteCardSkeletonProps {
  variant?: Variant;
}

/**
 * NoteCard 로딩 상태를 시각적으로 나타내는 스켈레톤 컴포넌트입니다.
 * 기존 NoteCard의 CSS 레시피와 규격을 그대로 재활용하여 레이아웃 시프트를 방지합니다.
 */
export const NoteCardSkeleton = ({ variant = 'small' }: NoteCardSkeletonProps) => {
  return (
    <div className={container({ variant })} style={{ pointerEvents: 'none', cursor: 'default' }}>
      <div className={contentContainer({ variant, withImg: false })} style={{ width: '100%', gap: '12px' }}>
        {/* 제목 스켈레톤 2줄 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
          <Skeleton width="85%" height="16px" borderRadius="4px" />
          <Skeleton width="60%" height="16px" borderRadius="4px" />
        </div>

        {/* 본문 내용 스켈레톤 2줄 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', marginTop: '4px' }}>
          <Skeleton width="95%" height="12px" borderRadius="4px" />
          <Skeleton width="70%" height="12px" borderRadius="4px" />
        </div>
      </div>
    </div>
  );
};
