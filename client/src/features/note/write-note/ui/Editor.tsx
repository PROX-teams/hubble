'use client';

import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Suggestion from '@tiptap/suggestion';
import * as s from './Editor.css';
import { suggestion } from './suggestion';

const Editor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: '/ 명령어로 기록을 남겨보세요',
      }),
      // 슬래시 메뉴(/) 확장
      Extension.create({
        name: 'slash-menu',
        addProseMirrorPlugins() {
          return [
            Suggestion({
              editor: this.editor,
              char: '/',
              ...suggestion,
            }),
          ];
        },
      }),
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: s.editorContent,
      },
    },
  });

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      editor?.commands.focus();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={s.editorContainer}>
      {/* 제목 입력 영역 */}
      <input
        type="text"
        className={s.titleInput}
        placeholder="제목을 입력하세요"
        onKeyDown={handleTitleKeyDown}
      />

      {/* 본문 에디터 영역 */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
