import { style, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';

// 1. 에디터 컨테이너
export const editorContainer = style({
  width: '100%',
  position: 'relative',
});

// 2. 에디터 입력 영역
export const editorContent = style({
  outline: 'none',
  fontSize: '18px',
  lineHeight: '1.8',
  cursor: 'text',
});

// 제목 입력 필드
export const titleInput = style({
  width: '100%',
  border: 'none',
  outline: 'none',
  fontSize: '32px',
  fontWeight: 'bold',
  marginBottom: '20px',
  backgroundColor: 'transparent',
  color: vars.color.white,
  selectors: {
    '&::placeholder': {
      color: '#495057',
    },
  },
});

// ✅ 에디터 내부의 Placeholder 스타일링
globalStyle(`${editorContent} p.is-empty::before`, {
  content: 'attr(data-placeholder)',
  float: 'left',
  color: '#adb5bd',
  pointerEvents: 'none',
  height: 0,
});

globalStyle(`${editorContent}.is-editor-empty::before`, {
  content: 'attr(data-placeholder)',
  float: 'left',
  color: '#adb5bd',
  pointerEvents: 'none',
  height: 0,
});

// ✅ 리스트(글머리) 스타일
globalStyle(`${editorContent} ul`, {
  listStyleType: 'disc !important', 
  paddingLeft: '24px',
  margin: '8px 0',
  color: vars.color.white,
});

// ✅ 번호기호 스타일 추가
globalStyle(`${editorContent} ol`, {
  listStyleType: 'decimal !important', 
  paddingLeft: '24px',
  margin: '8px 0',
  color: vars.color.white,
});

globalStyle(`${editorContent} li`, {
  // li 자체에는 listStyleType을 주지 않아야 부모(ul, ol)의 스타일을 따라갑니다.
  listStyleType: 'inherit !important',
  marginBottom: '4px',
  color: vars.color.white,
  display: 'list-item !important',
});

// ✅ 슬래시 메뉴(Suggestion) 스타일링
export const suggestionList = style({
  backgroundColor: '#1e1e1e',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  border: '1px solid #333',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  overflow: 'hidden',
  minWidth: '180px',
  zIndex: 9999,
});

export const suggestionItem = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '8px 12px',
  fontSize: '14px',
  color: '#ccc',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '4px',
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: '#333',
    },
  },
});

export const isSelected = style({
  backgroundColor: '#333 !important',
  color: '#fff !important',
});
