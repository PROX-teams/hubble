interface ButtonBase {
  size?: "xs" | "sm" | "md" | "lg"; // 버튼 height 크기
  variants?: "colored" | "neutral" | "danger"; // colored : 색상 버튼 / neutral : 무채색 버튼 / danger: 삭제 버튼
  disabled?: boolean; // 버튼 비활성화 여부
}

export type { ButtonBase };
