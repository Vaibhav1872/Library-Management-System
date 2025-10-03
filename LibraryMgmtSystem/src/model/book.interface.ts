export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  isBorrowed: boolean;
  borrowedDate?: Date;
}