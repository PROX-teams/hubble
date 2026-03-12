'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signup, checkEmailConflict, checkNicknameConflict } from '@/entities/user/api/user.api';
import { sendEmailCode, verifyEmailCode } from '@/entities/user/api/auth.api';
import { PATHS } from '@/shared/constants/paths';
import type { UserCreateRequest, EmailRequest, NicknameRequest, EmailVerifyRequest } from '@/entities/user/user.types';

export const useSignup = () => {
  const router = useRouter();

  // 1. 이메일 중복 확인
  const emailCheckMutation = useMutation({
    mutationFn: (data: EmailRequest) => checkEmailConflict(data),
  });

  // 2. 이메일 인증 코드 발송
  const sendCodeMutation = useMutation({
    mutationFn: (data: EmailRequest) => sendEmailCode(data),
  });

  // 3. 이메일 인증 코드 검증
  const verifyCodeMutation = useMutation({
    mutationFn: (data: EmailVerifyRequest) => verifyEmailCode(data),
  });

  // 4. 닉네임 중복 확인
  const nicknameCheckMutation = useMutation({
    mutationFn: (data: NicknameRequest) => checkNicknameConflict(data),
  });

  // 5. 최종 회원가입
  const signupMutation = useMutation({
    mutationFn: (data: UserCreateRequest) => signup(data),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해 주세요!');
      router.push(PATHS.AUTH_LOGIN);
    },
    onError: (error: Error) => {
      alert(error.message);
    },
  });

  return {
    checkEmail: emailCheckMutation,
    sendCode: sendCodeMutation,
    verifyCode: verifyCodeMutation,
    checkNickname: nicknameCheckMutation,
    signup: signupMutation,
  };
};
