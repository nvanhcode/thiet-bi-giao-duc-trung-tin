export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null; // null for root category
  icon?: string;
  color?: string;
  image?: string;
  displayOrder?: number;
}

