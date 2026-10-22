import { Component } from '@angular/core';
import { ProductsRestService } from '../../services/products-rest-service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  constructor(readonly servicioProductos: ProductsRestService) {}
}
