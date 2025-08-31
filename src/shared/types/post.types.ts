interface ArticleMeta {
  author: string;
  date: string;
  likeCount: number;
}

interface Article extends ArticleMeta {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export type { ArticleMeta, Article };
