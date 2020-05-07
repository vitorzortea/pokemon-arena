import { TestBed } from '@angular/core/testing';

import { AilmentService } from './ailment.service';

describe('AilmentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AilmentService = TestBed.get(AilmentService);
    expect(service).toBeTruthy();
  });
});
