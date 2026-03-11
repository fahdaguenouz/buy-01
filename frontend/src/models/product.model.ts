export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  mediaIds: string[]; 
  createdAt?: Date;
}