interface StoryEntity {
  id: number;          
  title: string;          
  description?: string;   
  category: string;       
  icon: string; 
  articleIds: number[]
}

export type { StoryEntity };