import React from 'react';
import Tag from '@/shared/ui/tag/Tag';
import { CATEGORY_MAP } from '@/features/note/view-note/constants/note.constants';
import type { Note } from '@/entities/note/note.types';
import * as s from './NoteMeta.css';

interface NoteHeaderProps {
  note: Note;
}

export const NoteMeta = ({ note }: NoteHeaderProps) => {
  return (
    <header className={s.header}>
      {note.category && (
        <span className={s.category}>
          {CATEGORY_MAP[note.category] || note.category}
        </span>
      )}
      <h1 className={s.title}>{note.title}</h1>
      <div className={s.meta}>
        <span className={s.author}>{note.author || '익명'}</span>
      </div>
      {note.tag && note.tag.length > 0 && (
        <div className={s.tagList}>
          {note.tag.map((tagName) => (
            <Tag key={tagName} label={tagName} />
          ))}
        </div>
      )}
    </header>
  );
};
