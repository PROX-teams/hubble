import { fetcher } from '@/shared/api/base';
import { API_ENDPOINTS } from '@/shared/api/constants';
import type { 
  UserCreateRequest, 
  UserInfo, 
  EmailRequest, 
  NicknameRequest,
  ConflictCheckResponse
} from '../user.types';

export const signup = (data: UserCreateRequest) => 
  fetcher<UserInfo>(API_ENDPOINTS.USER.SIGNUP, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const checkEmailConflict = (data: EmailRequest) => 
  fetcher<ConflictCheckResponse>(API_ENDPOINTS.USER.CHECK_EMAIL, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const checkNicknameConflict = (data: NicknameRequest) => 
  fetcher<ConflictCheckResponse>(API_ENDPOINTS.USER.CHECK_NICKNAME, {
    method: 'POST',
    body: JSON.stringify(data),
  });
