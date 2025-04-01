import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FakestoreService } from '../../services/fakestore.service';
import { StorageService } from '../../services/storage.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { map } from 'rxjs/operators';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
}

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  selectedImage: string = '';
  relatedProducts: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fakestoreService: FakestoreService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    if (!this.storageService.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(+params['id']);
      } else {
        this.router.navigate(['/dashboard/products']);
      }
    });
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.error = null;
    
    this.fakestoreService.getProduct(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.selectedImage = product.image;
        this.loadRelatedProducts(product.category);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Failed to load product details';
        this.isLoading = false;
        this.router.navigate(['/dashboard/products']);
      }
    });
  }

  loadRelatedProducts(category: string) {
    this.fakestoreService.getProducts().pipe(
      map((products: Product[]) => products.filter(p => p.category === category))
    ).subscribe({
      next: (products: Product[]) => {
        this.relatedProducts = products
          .filter(p => p.id !== this.product?.id)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error loading related products:', error);
        this.relatedProducts = [];
      }
    });
  }

  setSelectedImage(imageUrl: string) {
    this.selectedImage = imageUrl;
  }

  navigateToProduct(productId: number) {
    this.router.navigate(['/dashboard/products', productId]);
  }
}
