'use client';

import { CategoryType, SortType } from '@/shared/types/api.types';
import { Dropdown } from '@/shared/ui/dropdown/Dropdown';
import { AppToggleGroup } from '@/shared/ui/toggle/app-toggle-group/AppToggleGroup';
import Tag from '@/shared/ui/tag/Tag';
import * as S from './ThreadFilterBar.css';

interface ThreadFilterBarProps {
  category?: CategoryType;
  onCategoryChange: (category: CategoryType | undefined) => void;
  selectedTag?: string;
  onTagChange: (tag: string) => void;
  sortType: SortType;
  onSortChange: (sort: SortType) => void;
}

const CATEGORY_MAP: Record<string, CategoryType | undefined> = {
  '전체': undefined,
  '개발': 'DEVELOPMENT',
  '디자인': 'DESIGN',
  '기획': 'PLANNING',
  '마케팅': 'MARKETING',
  '일상': 'LIFE',
};

const SORT_MAP: Record<string, SortType> = {
  '최신순': 'latest',
  '좋아요 많은 순': 'mostLiked',
  '조회수 많은 순': 'mostViewed',
};

const POPULAR_TAGS = ['React', 'Next.js', 'Spring', 'UI/UX', 'Architecture', 'TypeScript'];

export const ThreadFilterBar = ({
  category,
  onCategoryChange,
  selectedTag,
  onTagChange,
  sortType,
  onSortChange,
}: ThreadFilterBarProps) => {
  // 현재 API 값(CategoryType)에 해당하는 한글 레이블을 찾습니다.
  const currentCategoryLabel = Object.keys(CATEGORY_MAP).find(
    (key) => CATEGORY_MAP[key] === category
  ) || '전체';

  return (
    <div className={S.filterSection}>
      {/* 카테고리 필터 (AppToggleGroup.Item의 설계에 맞춤) */}
      <AppToggleGroup 
        type="page"
        value={currentCategoryLabel}
        onValueChange={(label) => onCategoryChange(CATEGORY_MAP[label])}
      >
        {Object.keys(CATEGORY_MAP).map((label) => (
          <AppToggleGroup.Item key={label} value={label} />
        ))}
      </AppToggleGroup>

      <div className={S.filterRow}>
        {/* 태그 선택 필터 */}
        <div className={S.tagFilterRow}>
          {POPULAR_TAGS.map((tagName) => (
            <Tag
              key={tagName}
              label={tagName}
              className={selectedTag === tagName ? S.activeTagElement : S.tagElement}
              onClick={() => onTagChange(selectedTag === tagName ? '' : tagName)}
            />
          ))}
        </div>

        {/* 정렬 필터 */}
        <Dropdown className={S.dropdown}>
          <Dropdown.Trigger size='xl' variant='surface'>
            <Dropdown.Value>
              {({ selectedOption }) => selectedOption || '정렬 기준'}
            </Dropdown.Value>
            <Dropdown.Icon />
          </Dropdown.Trigger>
          <Dropdown.Menu>
            {Object.entries(SORT_MAP).map(([label, value], index) => (
              <Dropdown.Option 
                key={label} 
                optionId={index}
                onClick={() => onSortChange(value)}
              >
                {label}
              </Dropdown.Option>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
};
