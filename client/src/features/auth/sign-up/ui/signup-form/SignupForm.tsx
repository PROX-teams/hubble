'use client';

import { useState } from 'react';
import { Input } from '@/shared/ui/input/input/Input';
import { useSignup } from '../../model/useSignup';
import * as S from './SignupForm.css';
import clsx from 'clsx';

export const SignupForm = () => {
  // 입력 상태
  const [email, setEmail] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');

  // 검증 상태
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);

  const { checkEmail, sendCode, verifyCode, checkNickname, signup } = useSignup();

  // 이메일 중복 확인
  const handleEmailCheck = () => {
    checkEmail.mutate({ email }, {
      onSuccess: (data) => {
        if (data.isConflict) {
          alert('이미 사용 중인 이메일입니다.');
        } else {
          // 중복이 아니면 바로 인증 코드 발송
          handleSendCode();
        }
      }
    });
  };

  // 인증 코드 발송
  const handleSendCode = () => {
    sendCode.mutate({ email }, {
      onSuccess: () => {
        setIsCodeSent(true);
        alert('인증 코드가 발송되었습니다.');
      }
    });
  };

  // 인증 코드 검증
  const handleVerifyCode = () => {
    verifyCode.mutate({ email, code: authCode }, {
      onSuccess: () => {
        setIsEmailVerified(true);
        alert('이메일 인증이 완료되었습니다.');
      },
      onError: (error) => {
        alert(error.message || '인증 코드가 일치하지 않습니다.');
      }
    });
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = () => {
    if (!nickname) return;
    checkNickname.mutate({ nickname }, {
      onSuccess: (data) => {
        if (data.isConflict) {
          alert('이미 사용 중인 닉네임입니다.');
          setIsNicknameChecked(false);
        } else {
          setIsNicknameChecked(true);
          alert('사용 가능한 닉네임입니다.');
        }
      }
    });
  };

  // 최종 가입 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmailVerified || !isNicknameChecked || password !== rePassword) {
      alert('모든 항목을 올바르게 입력해 주세요.');
      return;
    }

    signup.mutate({ email, password, nickname });
  };

  const isFormValid = isEmailVerified && isNicknameChecked && password && rePassword && password === rePassword;

  return (
    <form className={S.formContainer} onSubmit={handleSubmit}>
      <div className={S.titleGroup}>
        <h1 className={S.title}>회원가입</h1>
        <p className={S.description}>Hubble에 오신 것을 환영합니다!</p>
      </div>

      <div className={S.section}>
        {/* 이메일 섹션 */}
        <div className={S.inputWithButton}>
          <div className={S.inputWrapper}>
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailVerified(false);
              }}
              placeholder="example@hubble.com"
              disabled={isEmailVerified}
              variant="solid"
              size="lg"
            />
          </div>
          <button 
            type="button" 
            className={S.actionButton}
            onClick={handleEmailCheck}
            disabled={!email || isEmailVerified || checkEmail.isPending}
          >
            {isEmailVerified ? '인증됨' : '중복확인'}
          </button>
        </div>

        {/* 인증 코드 섹션 (코드 발송 후에만 노출) */}
        {isCodeSent && !isEmailVerified && (
          <div className={S.inputWithButton}>
            <div className={S.inputWrapper}>
              <Input
                label="인증 코드"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                placeholder="6자리 코드를 입력해 주세요."
                variant="solid"
                size="lg"
              />
            </div>
            <button 
              type="button" 
              className={S.actionButton}
              onClick={handleVerifyCode}
              disabled={!authCode || verifyCode.isPending}
            >
              인증확인
            </button>
          </div>
        )}

        {/* 닉네임 섹션 */}
        <div className={S.inputWithButton}>
          <div className={S.inputWrapper}>
            <Input
              label="닉네임"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
              placeholder="사용하실 닉네임을 입력해 주세요."
              variant="solid"
              size="lg"
            />
          </div>
          <button 
            type="button" 
            className={S.actionButton}
            onClick={handleNicknameCheck}
            disabled={!nickname || isNicknameChecked || checkNickname.isPending}
          >
            {isNicknameChecked ? '사용가능' : '중복확인'}
          </button>
        </div>

        {/* 비밀번호 섹션 */}
        <div className={S.section}>
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요."
            variant="solid"
            size="lg"
          />
          <Input
            label="비밀번호 확인"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            placeholder="비밀번호를 다시 한 번 입력해 주세요."
            variant="solid"
            size="lg"
            isError={password !== '' && rePassword !== '' && password !== rePassword}
            errorMessage="비밀번호가 일치하지 않습니다."
          />
          {password !== '' && rePassword !== '' && password === rePassword && (
            <p className={clsx(S.helperText, S.successText)}>비밀번호가 일치합니다.</p>
          )}
        </div>
      </div>

      <button 
        type="submit" 
        className={S.submitButton}
        disabled={!isFormValid || signup.isPending}
      >
        {signup.isPending ? '가입 처리 중...' : '회원가입 완료'}
      </button>
    </form>
  );
};
