import { style } from '@vanilla-extract/css';
import { vars } from '@/shared/styles/theme.css';
import { tx } from '@/shared/styles/textStyle.css';

export const sidebarContainer = style({
  padding: '24px',
  gap: '32px',
  overflowY: 'auto',
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
});

export const sectionTitle = style([
  tx.t2_sb,
  {
    color: vars.color.gray_700,
  }
]);

export const imageUploadBox = style({
  width: '100%',
  height: '160px',
  backgroundColor: vars.color.gray_100,
  borderRadius: '8px',
  border: `1px dashed ${vars.color.gray_300}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  gap: '8px',
  color: vars.color.gray_500,
  transition: 'background-color 0.2s',
  ':hover': {
    backgroundColor: vars.color.gray_200,
  },
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const buttonGroup = style({
  marginTop: 'auto',
  display: 'flex',
  gap: '12px',
});

export const saveButton = style({
  flex: 1,
});

export const publishButton = style({
  flex: 2,
});
