import { ReactRenderer, Editor } from '@tiptap/react';
import { Range } from '@tiptap/core';
import { SuggestionProps, SuggestionKeyDownProps } from '@tiptap/suggestion';
import tippy, { Instance } from 'tippy.js';
import { SuggestionList, SuggestionItem, CommandProps, SuggestionListRef } from './SuggestionList';

export const suggestion = {
  items: ({ query }: { query: string }): SuggestionItem[] => {
    return [
      {
        title: '제목 1',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
        },
      },
      {
        title: '제목 2',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
        },
      },
      {
        title: '제목 3',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
        },
      },
      {
        title: '글머리 기호',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
      },
      {
        title: '번호 기호',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
      },
      {
        title: '코드 블럭',
        command: ({ editor, range }: CommandProps) => {
          editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
      },
      {
        title: '이미지',
        command: ({ editor, range }: CommandProps) => {
          const url = window.prompt('이미지 URL을 입력하세요');
          if (url) {
            editor.chain().focus().deleteRange(range).setImage({ src: url }).run();
          }
        },
      },
    ].filter(item => item.title.toLowerCase().startsWith(query.toLowerCase()));
  },

  command: ({ editor, range, props: item }: { editor: Editor; range: Range; props: SuggestionItem }) => {
    item.command({ editor, range });
  },

  render: () => {
    let component: ReactRenderer<SuggestionListRef, SuggestionProps>;
    let popup: Instance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(SuggestionList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate(props: SuggestionProps) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown(props: SuggestionKeyDownProps) {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        return component.ref?.onKeyDown(props) ?? false;
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};
