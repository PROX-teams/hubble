interface Alarm {
  userId: number; // 사용자 고유 ID (아바타 컴포넌트에 전달)
  date: string; // 알림 날짜
  message: string; // 알림 내용
  isDone: boolean; // 알림 확인 여부
  userName: string; // 크리에이터명 (아바타 컴포넌트에도 전달)
  imageUrl?: string; // 프로필 이미지 URL (아바타 컴포넌트에 전달)
}

export type { Alarm };
