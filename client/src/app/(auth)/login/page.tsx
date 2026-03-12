import { LoginForm } from '@/features/auth/log-in/ui/login-form/LoginForm';
import * as s from './page.css'

export default function LoginPage() {
  return (
    <div className={s.container}>
      <div className={s.titleContainer}>
        <h1 className={s.title}>Welcome to hubble</h1>
        <h3 className={s.subTitle}>생각이 가치로 이어지는 공간, 지금 바로 허블에서 경험하세요.</h3>
      </div>
      <LoginForm />
    </div>
  );
}
