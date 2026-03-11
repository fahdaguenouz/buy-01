import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../../services/product.service";
import { ToasterService } from "../../../shared/components/Toaster/toast";
import { Product } from "../../../models/product.model";


@Component({
  selector: 'seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
  standalone: false,
})
export class SellerDashboardComponent implements OnInit {
  myProducts: Product[] = [];

  constructor(private productService: ProductService, private toast: ToasterService) {}

  ngOnInit() {
    this.productService.getMyProducts().subscribe(data => this.myProducts = data);
  }

  deleteProduct(id: string) {
    if(confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toast.showSuccess('Product deleted');
          this.myProducts = this.myProducts.filter(p => p.id !== id);
        },
        error: () => this.toast.showError('Delete failed')
      });
    }
  }
}