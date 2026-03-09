export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  imageUrls: string[]; // References to the Media Service
  createdAt?: Date;
}