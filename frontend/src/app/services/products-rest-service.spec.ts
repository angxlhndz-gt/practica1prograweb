import { TestBed } from '@angular/core/testing';

import { ProductsRestService } from './products-rest-service';

describe('ProductsRestService', () => {
  let service: ProductsRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
