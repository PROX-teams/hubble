import { style } from "@vanilla-extract/css";
import { vars } from "@/shared/styles/theme.css";
import { tx } from "@/shared/styles/textStyle.css";

export const storyCard = style({
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  padding: "30px",
  width:"394px",
  height:"170px",
  border: `1px solid ${vars.color.stroke_300}`,
  borderRadius: "8px",
  backgroundColor: vars.color.gray_200,
  // 이거 왜 쓰더라?
  cursor: "pointer",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: vars.color.white
  //select 라이트 모드 추가
});

export const titleContainer = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  minWidth: 0, 
});


export const icon = style({
  display: "flex",
  alignItems: "center",
});

export const title = style([
  tx.h5_md,
  {
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  }]);

export const countContainer = style([
  tx.t2_rg,
{
  display: "inline-flex",
  gap: "4px",
}]);

export const countIcon = style({
  display: "flex",
  alignItems: "center",
})

export const description = style([
  tx.b1_rg,
  {
  color: vars.color.gray_500,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  whiteSpace: "normal",
}]);