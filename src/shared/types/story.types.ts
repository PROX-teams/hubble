interface StoryEntity {
  id: number;             // 스토리 고유 ID
  title: string;          // 스토리 제목
  description?: string;   // 스토리 설명 (선택)
  category: string;       // 작성자
  icon: string; 
  articleIds: number[]
}

export type { StoryEntity };