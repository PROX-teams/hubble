import { ChangeEvent } from "react";
import * as S from "./SwitchToggle.css";

interface SwitchToggleProps {
  /** 현재 토글이 활성화(ON) 상태인지 여부 */
  isActive: boolean;
  /** 토글 상태가 변경될 때 호출되는 콜백 함수. 변경된 상태값을 인자로 전달. */
  onToggle: (isActive: boolean) => void;
}

/**
 * SwitchToggle 컴포넌트는 ON/OFF 상태를 토글할 수 있는 UI 스위치입니다.
 * ```jsx
 * const { isActive, toggle } = useToggle(false);
 *
 * return (
 *   <SwitchToggle
 *     isActive={isActive}
 *     onToggle={(checked) => toggle(checked)}
 *   />
 * );
 * ```
 */

export default function SwitchToggle({
  isActive,
  onToggle,
}: SwitchToggleProps) {
  return (
    // label 클릭 시 내부 input 요소를 자동으로 포커싱하여 토글 (기능적 요소)
    <label className={S.label}>
      {/* 실제 체크박스 요소 (화면에서는 숨겨짐) */}
      <input
        type="checkbox"
        checked={isActive}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onToggle(e.target.checked)
        }
        className={S.input}
      />
      {/* 토글 스위치 배경 + knob 슬라이더 역할 (시각적 요소) */}
      <span className={S.slider} />
    </label>
  );
}
