import { useEffect, useRef, useState } from 'react';
import { useNoteEditorStore } from './useNoteEditorStore';
import { useNoteDraft } from './useNoteDraft';

interface UseAutoSaveDraftOptions {
  /** 디바운스 대기 시간 (ms, 기본값: 3000ms) */
  delay?: number;
  /** 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

/**
 * 에디터 타이핑을 감지하여 백그라운드에서 조용히 자동 임시저장하는 훅 (A-2)
 * - 사용자가 입력을 멈춘 후 N초 뒤 alert 없이 최신본을 서버에 저장
 * - 마지막 저장 시간(lastSavedText)을 반환하여 UI에 시각적 피드백 제공
 */
export const useAutoSaveDraft = ({
  delay = 3000,
  enabled = true,
}: UseAutoSaveDraftOptions = {}) => {
  const { saveDraft } = useNoteDraft();
  const editor = useNoteEditorStore((state) => state.editor);
  const title = useNoteEditorStore((state) => state.title);
  const [lastSavedText, setLastSavedText] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const triggerAutoSave = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        const success = await saveDraft({ silent: true });
        if (success) {
          const now = new Date();
          const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
          setLastSavedText(`자동 저장됨 (${timeStr})`);
        }
      }, delay);
    };

    // 1. TipTap 에디터 본문 내용 변경 감지
    if (editor) {
      editor.on('update', triggerAutoSave);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (editor) {
        editor.off('update', triggerAutoSave);
      }
    };
  }, [editor, delay, enabled, saveDraft]);

  // 2. 제목 변경 시에도 자동 저장 타이머 트리거
  useEffect(() => {
    if (!enabled || !title) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      const success = await saveDraft({ silent: true });
      if (success) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        setLastSavedText(`자동 저장됨 (${timeStr})`);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [title, delay, enabled, saveDraft]);

  return { lastSavedText };
};
