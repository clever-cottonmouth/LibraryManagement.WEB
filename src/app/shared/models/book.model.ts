export interface Book {
  id: number;
  title: string;
  author: string;
  publication: string;
  stock: number;
  pdfUrl?: string;
  videoUrl?: string;
  isActive: boolean;
}
