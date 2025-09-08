import { easeInOut, motion } from "framer-motion";
import Modal from "../modal/Modal";
import * as S from "./ConfirmModal.css";
import {
  CONFIRM_MESSAGES,
  MessageType,
} from "@/shared/constants/confirmMessage";
import WarnIcon from "@/shared/assets/icons/common/warn.svg";
import ActionButton from "../../atoms/button/action-button/ActionButton";

export interface ConfirmModalProps {
  type: MessageType; // 메시지 타입
  hide: () => void; // 모달 숨기기 함수
  hideOnClickOutside?: boolean; // 배경 클릭 시 모달 숨기기 여부
  onCancel?: () => void; // 취소 콜백 함수
  onDelete: () => void; // 삭제 콜백 함수
}

export default function ConfirmModal({
  hide,
  hideOnClickOutside = false,
  type,
  onCancel,
  onDelete,
}: ConfirmModalProps) {
  const label = CONFIRM_MESSAGES[type];

  const handleCancel = () => {
    onCancel?.();
    hide();
  };

  const handleDelete = () => {
    onDelete();
    hide();
  };

  return (
    <Modal
      hide={hide}
      className={S.container}
      hideOnClickOutside={hideOnClickOutside}
    >
      <Modal.Content className={S.contentWrapper}>
        <motion.div
          className={S.iconWrapper}
          // Warn shake animation
          animate={{
            rotate: [0, -20, 10, 0, -10, 5],
          }}
          transition={{
            delay: 0.7,
            duration: 0.6,
            ease: easeInOut,
            times: [0, 0.3, 0.5, 0.7, 0.8, 1],
          }}
        >
          <WarnIcon className={S.icon} />
        </motion.div>
        <strong className={S.title}>{label.title}</strong>
        <p className={S.description}>{label.description}</p>
      </Modal.Content>

      <Modal.Footer className={S.footer}>
        <ActionButton
          size="md"
          variants="neutral"
          wideWidth={true}
          onClick={handleCancel}
        >
          취소
        </ActionButton>
        <ActionButton
          size="md"
          variants="danger"
          wideWidth={true}
          onClick={handleDelete}
        >
          삭제
        </ActionButton>
      </Modal.Footer>
    </Modal>
  );
}
