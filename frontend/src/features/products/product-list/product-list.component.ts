import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: false
})
export class ProductListComponent implements OnInit {
  // Mock data for testing the UI
  products: Product[] = [
    { name: 'Gaming Laptop', price: 1200, description: 'High performance laptop', imageUrls: ['https://via.placeholder.com/300'], sellerId: '1' },
    { name: 'Wireless Mouse', price: 25, description: 'Ergonomic mouse', imageUrls: ['https://via.placeholder.com/300'], sellerId: '1' },
    { name: 'Mechanical Keyboard', price: 80, description: 'RGB backlit keys', imageUrls: ['https://via.placeholder.com/300'], sellerId: '2' }
  ];

  constructor() {}

  ngOnInit(): void {}

  // In your ProductListComponent
logout() {
  localStorage.clear();
  window.location.href = '/login';
}
}