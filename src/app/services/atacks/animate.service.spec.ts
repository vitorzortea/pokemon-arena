import { TestBed } from '@angular/core/testing';

import { AnimateService } from './animate.service';

describe('AnimateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnimateService = TestBed.get(AnimateService);
    expect(service).toBeTruthy();
  });
});
