import { Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';

export interface BackendProduct {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  category?: { id: number; name: string } | null;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: BackendProduct[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsRestService {
  private readonly basicAuthUser = 'estudiante';
  private readonly basicAuthPassword = 'cambiar-esta-clave';
  private readonly encodedCredentials = btoa(`${this.basicAuthUser}:${this.basicAuthPassword}`);

  productsResource = httpResource<ProductsResponse>(() => ({
    url: 'http://localhost:3000/api/v1/products',
    method: 'GET',
    headers: {
      Authorization: `Basic ${this.encodedCredentials}`,
    },
  }));
}
