export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  categoryId: string;
  categoryName: string;
  author?: string;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  featured?: boolean;
}
