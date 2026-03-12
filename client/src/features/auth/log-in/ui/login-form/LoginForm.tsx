'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/shared/ui/input/input/Input';
import Button from '@/shared/ui/button/button/Button';
import { PATHS } from '@/shared/constants/paths';
import { useLogin } from '../../model/useLogin';
import * as S from './LoginForm.css';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    login({ email, password });
  };

  return (
    <form className={S.formContainer} onSubmit={handleSubmit}>
      <h1 className={S.title}>로그인</h1>
      
      <div className={S.inputGroup}>
        <Input 
          label="이메일"
          type="email"
          placeholder="이메일을 입력해 주세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="solid"
          size="lg"
          required
        />
        <Input 
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해 주세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="solid"
          size="lg"
          required
        />
      </div>

      <Button
        type="submit" 
        disabled={isPending || !email || !password}
        className={S.button}
        size='lg'
      >
        {isPending ? '로그인 중...' : '로그인'}
      </Button>

      <p className={S.linkText}>
        아직 회원이 아니신가요?
        <Link href={PATHS.AUTH_SIGNUP} className={S.link}>
          회원가입
        </Link>
      </p>
    </form>
  );
};
