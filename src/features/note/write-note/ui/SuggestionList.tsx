import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Editor } from '@tiptap/react';
import { Range } from '@tiptap/core';
import { SuggestionProps } from '@tiptap/suggestion';
import * as s from './Editor.css';

// 명령어 실행 시 전달되는 프로퍼티 인터페이스
export interface CommandProps {
  editor: Editor;
  range: Range;
}

// 명령어 아이템 타입 정의
export interface SuggestionItem {
  title: string;
  command: (props: CommandProps) => void;
}

// Ref로 노출할 함수 타입 정의
export interface SuggestionListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

// Tiptap SuggestionProps를 확장하여 타입 호환성 확보
export interface SuggestionListProps extends SuggestionProps {
  items: SuggestionItem[];
}

export const SuggestionList = forwardRef<SuggestionListRef, SuggestionListProps>(
  ({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (item: SuggestionItem) => {
      if (item) {
        command(item);
      }
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (event.key === 'ArrowUp') {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowDown') {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          selectItem(items[selectedIndex]);
          return true;
        }
        return false;
      },
    }));

    useEffect(() => setSelectedIndex(0), [items]);

    return (
      <div className={s.suggestionList}>
        {items.length > 0 ? (
          items.map((item, index) => (
            <button
              key={index}
              className={`${s.suggestionItem} ${index === selectedIndex ? s.isSelected : ''}`}
              onClick={() => selectItem(item)}
            >
              {item.title}
            </button>
          ))
        ) : (
          <div className={s.suggestionItem}>검색 결과 없음</div>
        )}
      </div>
    );
  }
);

SuggestionList.displayName = 'SuggestionList';
