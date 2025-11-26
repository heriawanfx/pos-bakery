export interface Category {
  id: string;
  name: string;
  //description?: string | null; //optional and nullable property
  description: string | null; //nullable property
  createdAt: string;
  updatedAt: string | null;
}
