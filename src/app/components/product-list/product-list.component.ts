import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FakestoreService } from '../../services/fakestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  imports: [CommonModule]
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(
    private service: FakestoreService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.service.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
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
      product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
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

