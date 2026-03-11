import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../environments/environment';

// Assuming your Gateway routes /products to the Product Service
const PRODUCT_API = `${environment.gatewayUrl}/products`; 

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // Public endpoint to get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(PRODUCT_API);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${PRODUCT_API}/products`, product);
  }
}