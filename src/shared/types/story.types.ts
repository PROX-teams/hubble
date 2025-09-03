import type { Article } from "@/shared/types/post.types";

interface StoryMeta {
  id: number;             // 스토리 고유 ID
  title: string;          // 스토리 제목
  description?: string;   // 스토리 설명 (선택)
  category: string;       // 작성자
  icon: string; 
}

interface StoryEntity extends StoryMeta {
  articles: Article[];    // 스토리에 포함된 포스트들
}

export type { StoryMeta, StoryEntity };