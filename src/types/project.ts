export interface Project {
  id: string;
  slug: string;
  title: string;
  tag: string;
  address: string;
  scale: string;
  client?: string;
  completionYear?: string;
  excerpt: string;
  description: string;
  image: string;
  images: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}
