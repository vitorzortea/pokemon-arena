import { PokemonsService } from './../pokemons.service';
import { AnimateService } from './animate.service';
import { Injectable } from '@angular/core';
import { MensageriaService } from '../mensageria.service';

@Injectable({
  providedIn: 'root'
})
export class DamageService {
  public mensagemForca = '';

  constructor(
    public animateAttack: AnimateService,
    public mensageria: MensageriaService,
    public pokemonsService: PokemonsService
  ) { }

  start(round) {
    this.mensagemForca = ''
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    if (porcentAccuracy <= round.move.accuracy) {
      this.applyAttack(round);

      // Animação dos Pokemons
      this.animateAttack.classRound(`pokemons-atacked-${round.p1}`);
      this.animateAttack.classRound(`pokemons-damage-${round.p2}`);
      setTimeout(() => { this.animateAttack.classRound(`pokemons-atacked-${round.p1}`); }, 5800);
      setTimeout(() => { this.animateAttack.classRound(`pokemons-damage-${round.p2}`); }, 5800);

    } else {
      this.mensageria.setMensageria(round.mensages, 4, 'But it failed!');
    }
  }

  applyAttack(round) {
    const forca = this.calculateEffect(round);
    if (this.mensagemForca) {
      this.mensageria.setMensageria(round.mensages, 6, this.mensagemForca);
    }

    // tslint:disable-next-line: max-line-length
    let newHP = Math.floor(round.pokemonTo.hp.value - (0.44 * round.pokemonFrom.status[4].value / round.pokemonTo.status[3].value * round.move.power  + 2) * forca);
    if (newHP <= 0) {
      newHP = 0;
      round.pokemonTo.especialStatus = 'fainted';
    }
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
