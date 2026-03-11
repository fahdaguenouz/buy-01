import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: false
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  selectedImageIndex = 0;
  isLoading = true;
    seller: User | null = null;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => {
          this.product = data;
          this.isLoading = false;
          // Fetch the seller details using the sellerId
          this.fetchSellerInfo(data.sellerId);
        },
        error: () => (this.isLoading = false)
      });
    }
  }

  fetchSellerInfo(sellerId: string) {
    this.productService.getUserById(sellerId).subscribe({
      next: (user) => this.seller = user,
      error: () => console.error("Could not fetch seller info")
    });
  }
   changeImage(index: number) {
    this.selectedImageIndex = index;
  }
}