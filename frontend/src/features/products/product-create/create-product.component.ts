import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../shared/components/Toaster/toast';


@Component({
  standalone: false,
  selector: 'app-add-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService, private toast: ToasterService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      // Initialize with 4 empty strings for media URLs
      media: this.fb.array([this.fb.control(''), this.fb.control(''), this.fb.control(''), this.fb.control('')])
    });
  }

  get media() {
    return this.productForm.get('media') as FormArray;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.createProduct(this.productForm.value).subscribe({
        next: () => {
          this.toast.showSuccess('Product added successfully!');
          this.productForm.reset();
        },
        error: () => this.toast.showError('Failed to add product.')
      });
    }
  }
}