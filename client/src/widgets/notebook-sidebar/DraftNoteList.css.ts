import { style } from '@vanilla-extract/css';

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '12px',
  padding: '8px 0',
});

export const header = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 8px 8px 8px',
  borderBottom: '1px solid #f0f0f0',
});

export const countText = style({
  fontSize: '13px',
  fontWeight: 600,
  color: '#666666',
});

export const clearAllButton = style({
  fontSize: '12px',
  color: '#999999',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '4px 6px',
  borderRadius: '4px',
  transition: 'color 0.2s, background-color 0.2s',
  ':hover': {
    color: '#ef4444',
    backgroundColor: '#fee2e2',
  },
});

export const listWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const draftCard = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '12px',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  ':hover': {
    borderColor: '#3b82f6',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
});

export const cardMain = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
  overflow: 'hidden',
});

export const draftTitle = style({
  fontSize: '14px',
  fontWeight: 600,
  color: '#1f2937',
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const draftDate = style({
  fontSize: '11px',
  color: '#9ca3af',
});

export const deleteButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  marginLeft: '8px',
  background: 'none',
  border: 'none',
  borderRadius: '4px',
  color: '#9ca3af',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'color 0.2s, background-color 0.2s',
  ':hover': {
    color: '#ef4444',
    backgroundColor: '#fee2e2',
  },
});

export const emptyText = style({
  padding: '40px 16px',
  textAlign: 'center',
  fontSize: '13px',
  color: '#9ca3af',
  lineHeight: 1.5,
});
