interface NoteMeta {
  author: string;
  date: string;
  likeCount: number;
}

interface Note extends NoteMeta {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export type { NoteMeta, Note };
