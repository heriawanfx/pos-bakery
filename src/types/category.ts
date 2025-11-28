export interface Category {
  id: number;
  name: string;
  description: string | null; //nullable property
  created_at: string;
  updated_at: string | null;
}
