import { PokemonsService } from './../pokemons.service';
import { AnimateService } from './animate.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DamageService {
  public mensagemForca = '';

  constructor(
    public animateAttack: AnimateService,
    public pokemonsService: PokemonsService
  ) { }

  start(round) {
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    if (porcentAccuracy <= round.move.accuracy) {
      this.applyAttack(round);

      // Animação dos Pokemons
      this.animateAttack.classRound(`pokemons-atacked-${round.p1}`);
      this.animateAttack.classRound(`pokemons-damage-${round.p2}`);
      setTimeout(() => { this.animateAttack.classRound(`pokemons-atacked-${round.p1}`); }, 5800);
      setTimeout(() => { this.animateAttack.classRound(`pokemons-damage-${round.p2}`); }, 5800);

    } else {
      setTimeout(() => { this.animateAttack.setMessage('But it failed!'); }, 2000);
      setTimeout(() => { this.animateAttack.setMessage(''); }, 4000);
    }
  }

  applyAttack(round) {
    const forca = this.calculateEffect(round);
    setTimeout(() => { this.animateAttack.setMessage(this.mensagemForca); this.mensagemForca = ''; }, 2500);
    setTimeout(() => { this.animateAttack.setMessage(''); }, 4500);

    // tslint:disable-next-line: max-line-length
    let newHP = Math.floor(round.pokemonTo.hp.value - (0.44 * round.pokemonFrom.status[4].value / round.pokemonTo.status[3].value * round.move.power  + 2) * forca);
    if (newHP <= 0) { newHP = 0; }

    setTimeout(() => { this.animateAttack.hpMinus(round.pokemonTo, round.p2, newHP); }, 2000);
  }

  calculateEffect(round) {
    const indexMove = this.pokemonsService.types.findIndex((e) => e.type === round.move.type );
    const objMove = this.pokemonsService.types[indexMove];
    let forcaFinal = 1;

    forcaFinal = this.ApplyEffect(round.pokemonTo.types, objMove.nofDamageTo, forcaFinal, 0.0001,  'It\'s not effective...');
    forcaFinal = this.ApplyEffect(round.pokemonTo.types, objMove.halfDamageTo, forcaFinal, 0.5, 'It\'s not very effective...');
    forcaFinal = this.ApplyEffect(round.pokemonTo.types, objMove.doubleDamageTo, forcaFinal, 2, 'It\'s super effective!');

    return forcaFinal;
  }

  ApplyEffect(tipoPokemon, tipoDanos, forcaFinal, valorFinal, mensagem) {
    tipoPokemon.forEach(e => {
      if (tipoDanos.includes(e)) {
        forcaFinal = valorFinal;
        this.mensagemForca = mensagem;
        return false;
      }
    });
    return forcaFinal;
  }


}
