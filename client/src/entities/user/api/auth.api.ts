import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { LoginRequest, LoginResponse, EmailRequest, EmailVerifyRequest } from '../user.types';

export const login = (data: LoginRequest) => 
  fetcher<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const sendEmailCode = (data: EmailRequest) => 
  fetcher<void>(API_ENDPOINTS.AUTH.EMAIL_SEND, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const verifyEmailCode = (data: EmailVerifyRequest) => 
  fetcher<void>(API_ENDPOINTS.AUTH.EMAIL_VERIFY, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const reissueToken = (refreshToken: string) => 
  fetcher<LoginResponse>(API_ENDPOINTS.AUTH.REISSUE, {
    method: 'POST',
    body: refreshToken,
  });
