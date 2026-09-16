export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  NOTE: '/note',
  STORY: '/story',
  SEARCH: '/search',
  RECOMMEND: {
    ALL: '/main/recommend',
    MOST_LOVED: '/main/recommend/most-loved',
    DISCOVER: '/main/recommend/discover',
    CREATORS: '/main/recommend/creators',
    STORIES: '/main/recommend/stories',
  },
  AUTH: {
    LOGIN: '/auth/login',
    REISSUE: '/auth/reissue',
    EMAIL_SEND: '/auth/email/send',
    EMAIL_VERIFY: '/auth/email/verify',
  },
  USER: {
    SIGNUP: '/user/signup',
    CHECK_EMAIL: '/user/check-email',
    CHECK_NICKNAME: '/user/check-nickname',
    PROFILE: '/user',
  },
} as const;
