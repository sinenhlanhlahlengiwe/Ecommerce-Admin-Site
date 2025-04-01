import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FakestoreService } from '../../services/fakestore.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  additionalImages?: string[];
  specifications?: { [key: string]: string };
  title?: string;
  image?: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FormsModule,
    MatCardModule,
    MatTooltipModule
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  exchangeRate: number = 18.5; // USD to ZAR conversion rate

  constructor(
    private service: FakestoreService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (!this.storageService.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.service.getProducts().subscribe(
      (data) => {
        this.products = data.map((product: Product) => ({
          ...product,
          price: product.price * this.exchangeRate // Convert to ZAR
        }));
        this.filteredProducts = this.products;
        this.loading = false;
      },
      (error) => {
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.loading = false;
      }
    );
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      (product.title?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  addProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(id: number): void {
    this.router.navigate(['/products/edit', id]);
  }

  viewProduct(id: number): void {
    this.router.navigate(['/products', id]);
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.service.deleteProduct(id).subscribe(
        () => {
          this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          this.loadProducts();
        },
        (error) => {
          this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        }
      );
    }
  }
}