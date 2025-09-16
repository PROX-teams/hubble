import CheckIcon from "@/shared/assets/icons/alarm/alarm-check.svg";
import * as S from "./MarkAsDoneButton.css";

/**
 * 알림 상태를 '완료'로 변경하는 버튼 컴포넌트
 */

export default function MarkAsDoneButton() {
  return (
    <button className={S.checkWrapper}>
      <CheckIcon className={S.check} />
    </button>
  );
}
