import { Component, OnInit } from '@angular/core';
import { FakestoreService } from '../../services/fakestore.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];

  constructor(private service: FakestoreService) {}

  ngOnInit(): void {
    this.service.getProducts().subscribe((data) => (this.products = data));
  }
}

