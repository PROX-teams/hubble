'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { easeInOut, motion } from 'framer-motion';
import Modal from '../modal/Modal';
import ActionButton from '../../button/action-button/ActionButton';
import { PATHS } from '@/shared/constants/paths';
import WarnIcon from '@/shared/assets/icons/common/warn.svg';
import * as S from '../confirm-modal/ConfirmModal.css';

export interface AuthRequiredModalProps {
  hide: () => void;
  hideOnClickOutside?: boolean;
  onCancel?: () => void;
}

/**
 * 로그인 유도 전용 공통 확인 모달 컴포넌트
 */
export default function AuthRequiredModal({
  hide,
  hideOnClickOutside = false,
  onCancel,
}: AuthRequiredModalProps) {
  const router = useRouter();

  const handleCancel = () => {
    onCancel?.();
    hide();
  };

  const handleLogin = () => {
    hide();
    router.push(PATHS.AUTH_LOGIN);
  };

  return (
    <Modal
      hide={hide}
      className={S.container}
      hideOnClickOutside={hideOnClickOutside}
    >
      <div className={S.contentWrapper}>
        <motion.div
          className={S.iconWrapper}
          animate={{
            rotate: [0, -20, 10, 0, -10, 5],
          }}
          transition={{
            delay: 0.5,
            duration: 0.6,
            ease: easeInOut,
            times: [0, 0.3, 0.5, 0.7, 0.8, 1],
          }}
        >
          <WarnIcon className={S.icon} />
        </motion.div>
        <strong className={S.title}>로그인이 필요한 서비스입니다</strong>
        <p className={S.description}>
          내 노트북을 이용하고 글을 관리하려면 로그인이 필요합니다.
          {'\n'}로그인 페이지로 이동하시겠습니까?
        </p>
      </div>

      <div className={S.footer}>
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
          variants="colored"
          wideWidth={true}
          onClick={handleLogin}
        >
          로그인
        </ActionButton>
      </div>
    </Modal>
  );
}
