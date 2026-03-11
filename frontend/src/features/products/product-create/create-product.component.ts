import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { ToasterService } from '../../../shared/components/Toaster/toast';
import { forkJoin } from 'rxjs';
import { MediaService } from '../../../services/media.service';
import { Router } from '@angular/router';
@Component({
  standalone: false,
  selector: 'app-add-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  maxMedia = 4;

  files: File[] = [];
  previewUrls: string[] = [];
  categories: any[] = [];
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toast: ToasterService,
    private mediaService: MediaService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [1, [Validators.required, Validators.min(1)]],
      category: ['', [Validators.required]],
      media: this.fb.array([this.fb.control(null)]),
    });
    this.productService.getCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => this.toast.showError('Could not load categories'),
    });
  }

  get media(): FormArray {
    return this.productForm.get('media') as FormArray;
  }

  addMedia() {
    if (this.media.length < this.maxMedia) {
      this.media.push(this.fb.control(null));
    }
  }

  removeMedia(index: number) {
    if (this.media.length > 1) {
      this.media.removeAt(index);
      this.files.splice(index, 1);
      this.previewUrls.splice(index, 1);
    }
  }
  resetForm() {
    this.productForm.reset();
    this.media.clear();
    this.media.push(this.fb.control(null));
    this.files = [];
    this.previewUrls = [];
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];

    if (file) {
      this.files[index] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls[index] = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
  isLoading = false;

  onSubmit() {
    this.isLoading = true;
    if (this.productForm.invalid) return;

    // Filter out any undefined/null slots in the files array before mapping
    const validFiles = this.files.filter((file) => !!file);

    if (validFiles.length === 0) {
      this.toast.showError('Please upload at least one image');
      return;
    }

    const uploads = validFiles.map((file) => this.mediaService.uploadImage(file));

    forkJoin(uploads).subscribe({
      next: (responses: any[]) => {
        // Map the filenames from response
        const mediaIds = responses.map((res) => res[0]?.fileName || res.fileName);

        const payload = {
          ...this.productForm.value,
          mediaIds: mediaIds,
        };

        this.productService.createProduct(payload).subscribe({
          next: () => {
            this.toast.showSuccess('Product added successfully!');
            this.resetForm();
            // 3. Redirect to home page
            this.router.navigate(['/']);
          },
          error: (err) => {
            console.error(err);
            this.toast.showError('Product creation failed');
          },
        });
      },
      error: () => this.toast.showError('Image upload failed'),
    });
  }
}
