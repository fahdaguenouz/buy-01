import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service'; // Adjust path
import { ToasterService } from '../../../shared/components/Toaster/toast';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: false,
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  isLoading = true;

  constructor(
    private productService: ProductService,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toast.showError('Failed to load products from the server.');
        console.error('Error fetching products:', err);
      }
    });
  }
}