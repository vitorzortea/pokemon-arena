import { TestBed } from '@angular/core/testing';

import { MensageriaService } from './mensageria.service';

describe('MensageriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MensageriaService = TestBed.get(MensageriaService);
    expect(service).toBeTruthy();
  });
});
