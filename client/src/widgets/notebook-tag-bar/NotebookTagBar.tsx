'use client';

import React from 'react';
import clsx from 'clsx';
import { useTags } from '@/entities/tag/model/useMyTags';
import { useNotebookFilter } from '@/entities/note/model/useNotebookFilter';
import Tag from '@/shared/ui/tag/Tag';
import * as S from './NotebookTagBar.css';

/**
 * 노트북 태그 칩 수평 스크롤 바 위젯 (Props 0개 자율형 컴포넌트)
 */
export const NotebookTagBar = () => {
  const { targetUserId, selectedTag, setSelectedTag } = useNotebookFilter();
  const { tags } = useTags(targetUserId);

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <nav className={S.tagBar} aria-label="노트 태그 필터">
      {tags.map((tag) => {
        const isActive = selectedTag === tag.name;
        return (
          <Tag
            key={tag.name}
            label={tag.name}
            count={tag.count}
            className={clsx(S.tagItem, isActive && S.activeTagItem)}
            onClick={() => setSelectedTag(isActive ? '' : tag.name)}
          />
        );
      })}
    </nav>
  );
};

export default NotebookTagBar;
