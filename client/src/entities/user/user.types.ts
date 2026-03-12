// Auth 관련 타입 (로그인)
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  grantType: string;
}

// 이메일 인증 부분은 추후 백엔드에서 Auth -> User로 변경 에정
export interface EmailVerifyRequest {
  email: string;
  code: string;
}

// User 관련 타입 (회원가입)
export interface UserCreateRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

// 공통 응답 및 단순 요청 타입
export interface ConflictCheckResponse {
  isConflict: boolean;
}

export type EmailRequest = { email: string };
export type NicknameRequest = { nickname: string };
