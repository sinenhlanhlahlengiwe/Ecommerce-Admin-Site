import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FakestoreService } from '../../services/fakestore.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fakestoreService: FakestoreService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadProduct(+params['id']);
      }
    });
  }

  loadProduct(id: number) {
    this.fakestoreService.getProduct(id).subscribe({
      next: (data) => {
        this.product = {
          id: data.id,
          name: data.title,
          imageUrl: data.image,
          description: data.description,
          price: data.price,
          category: data.category || 'Uncategorized',
          inStock: true
        };
        this.selectedImage = this.product?.imageUrl || '';
      },
      error: (error) => {
        console.error('Error loading product:', error);
      }
    });
  }

  selectImage(image: string) {
    this.selectedImage = image;
  }

  onEdit() {
    // TODO: Implement edit functionality
    console.log('Edit product:', this.product?.id);
  }

  onDelete() {
    if (this.product?.id) {
      this.fakestoreService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }
}
