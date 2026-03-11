export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  NOTE: '/note',
  STORY: '/story',
} as const;
