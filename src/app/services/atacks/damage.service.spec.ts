import { TestBed } from '@angular/core/testing';

import { DamageService } from './damage.service';

describe('DamageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DamageService = TestBed.get(DamageService);
    expect(service).toBeTruthy();
  });
});
