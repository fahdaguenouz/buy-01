import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../shared/components/Toaster/toast';
import { forkJoin, of, Observable } from 'rxjs';
import { MediaService } from '../../../services/media.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-add-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  maxMedia = 4;
  isEditMode = false;
  productId: string | null = null;
  
  files: File[] = [];
  previewUrls: string[] = []; 
  existingMedia: string[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toast: ToasterService,
    private mediaService: MediaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [1, [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      
    });

    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.isEditMode = true;
      this.productService.getProductById(this.productId).subscribe(product => {
        this.productForm.patchValue(product);
        this.existingMedia = product.mediaIds || [];
        this.previewUrls = [...this.existingMedia];
      });
    }

    this.productService.getCategories().subscribe({
      next: (data) => (this.categories = data),
    });
  }

  removeMedia(index: number) {
    this.previewUrls.splice(index, 1);
    if (index < this.existingMedia.length) {
      this.existingMedia.splice(index, 1);
    } else {
      this.files.splice(index - this.existingMedia.length, 1);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && this.previewUrls.length < this.maxMedia) {
      this.files.push(file);
      const reader = new FileReader();
      reader.onload = () => this.previewUrls.push(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

onSubmit() {
  // 1. Form Validation Check
  if (this.productForm.invalid) {
    this.toast.showError('Please fill in all required fields.');
    return;
  }

  // 2. Mandatory Media Check
  if (this.previewUrls.length === 0) {
    this.toast.showError('At least one product image is required.');
    return;
  }

  // 3. Proceed with Uploads
  const uploadObservables = this.files.length > 0 
    ? this.files.map(file => this.mediaService.uploadImage(file))
    : of([]);

  forkJoin(uploadObservables).subscribe({
    next: (responses: any[]) => {
      const newMediaIds = responses.flat().map(item => item.fileName);
      const finalMediaIds = [...this.existingMedia, ...newMediaIds];
      
      const payload = { 
        ...this.productForm.value, 
        mediaIds: finalMediaIds 
      };

      const action$ = this.isEditMode 
        ? this.productService.updateProduct(this.productId!, payload) 
        : this.productService.createProduct(payload);

      action$.subscribe({
        next: () => {
          this.toast.showSuccess(`Product ${this.isEditMode ? 'updated' : 'created'}!`);
          this.router.navigate(['/seller-dashboard']);
        },
        error: (err) => {
          console.error(err);
          this.toast.showError('Operation failed.');
        }
      });
    }
  });
}
}