import {TestBed} from '@angular/core/testing';

import {DigimonRestService} from './digimon-rest-service';

describe('DigimonRestService', () => {
  let service: DigimonRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DigimonRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
