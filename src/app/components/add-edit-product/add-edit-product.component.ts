import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FakestoreService } from '../../services/fakestore.service';

@Component({
  selector: 'app-add-edit-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-edit-product.component.html',
  styleUrl: './add-edit-product.component.css'
})
export class AddEditProductComponent implements OnInit {
  productForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  productId: number | null = null;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private fakestoreService: FakestoreService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      price: ['', [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      image: ['', [Validators.required, Validators.pattern('^https?://.*')]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct();
      }
    });
  }

  loadProduct() {
    if (this.productId) {
      this.isLoading = true;
      this.fakestoreService.getProduct(this.productId).subscribe({
        next: (product) => {
          this.productForm.patchValue(product);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading product:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading = true;
      const productData = this.productForm.value;

      const request = this.isEditMode && this.productId
        ? this.fakestoreService.updateProduct(this.productId, productData)
        : this.fakestoreService.addProduct(productData);

      request.subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = `Product successfully ${this.isEditMode ? 'updated' : 'added'}`;
          setTimeout(() => {
            this.router.navigate(['/products']);
          }, 2000);
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.isLoading = false;
        }
      });
    } else {
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['min']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be greater than 0`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid URL';
      }
    }
    return '';
  }
}
