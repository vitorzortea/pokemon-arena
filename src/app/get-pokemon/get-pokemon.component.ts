import { PokemonsService } from './../services/pokemons.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-get-pokemon',
  templateUrl: './get-pokemon.component.html',
  styleUrls: ['./get-pokemon.component.styl']
})
export class GetPokemonComponent implements OnInit {

  constructor(
    public pokemonsService: PokemonsService,
  ) { }

  ngOnInit() {
    this.pokemonsService.idP2 = this.geId();
    this.sortear();
  }

  sortear() {
    this.pokemonsService.idP1 = this.geId();
    // this.pokemonsService.idP1 = [97, 97, 97, 97, 97, 97];
  }

  geId() {
    return Array.from({length: 6}, (e) =>e =Math.floor((Math.random() * 151) + 1));
  }



}
