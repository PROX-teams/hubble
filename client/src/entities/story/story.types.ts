import { NoteMeta } from "../note/note.types";

// 임시로 NoteMeta를 extends함
interface Story extends NoteMeta {
  id: number;          
  title: string;          
  description?: string;   
  category?: string;       
  icon?: string; 
  articleIds: number[]
}

export type { Story };