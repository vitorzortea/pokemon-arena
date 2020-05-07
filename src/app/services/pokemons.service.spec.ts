import { TestBed } from '@angular/core/testing';

import { PokemonsService } from './pokemons.service';

describe('PokemonsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PokemonsService = TestBed.get(PokemonsService);
    expect(service).toBeTruthy();
  });
});
