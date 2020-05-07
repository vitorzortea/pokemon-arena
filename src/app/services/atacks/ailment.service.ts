import { Injectable } from '@angular/core';
import { PokemonsService } from '../pokemons.service';
import { AnimateService } from './animate.service';

@Injectable({
  providedIn: 'root'
})
export class AilmentService {

  constructor(
    public animateAttack: AnimateService,
    public pokemonsService: PokemonsService
  ) { }


  start(round) {
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    const objFunctions = {
      sleep: this.applyAilment(round, `${round.pokemonTo.name} is fast asleep!`),
      confusion: this.applyAilment(round, `${round.pokemonTo.name} became confused!`),
      poison: this.applyAilment(round, `${round.pokemonTo.name} became posion!`),
      leechseed: this.applyAilment(round, `${round.pokemonTo.name} was seeded!`),
      paralysis: this.applyAilment(round, `${round.pokemonTo.name} was paralyzed!`),
    };
    const typeMove = round.move.meta.ailment.name.replace('-', '');
    const applyMove = objFunctions[typeMove];

    (porcentAccuracy <= round.move.accuracy) ? applyMove() : this.faildAttack();
  }

  applyAilment(round, menssageAilment) {
    if (round.pokemonTo.especialStatus === 'normal') {
      round.pokemonTo.especialStatus = round.move.meta.ailment.name;
      setTimeout(() => { this.fastmessages(menssageAilment); }, 2000);
    } else { this.faildAttack(); }
  }
  removeAilment(pokemon, porcetagem, menssageRemove, menssageContinue) {
    const porcentWakeup = Math.floor((Math.random() * 100) + 1);
    if ( porcentWakeup > porcetagem ) {
      pokemon.especialStatus = 'normal';
      this.fastmessages(menssageRemove);
      return true;
    } else {
      this.fastmessages(menssageContinue);
      return false;
    }
  }

  faildAttack() {
    setTimeout(() => { this.fastmessages('But it failed!'); }, 2000);
    setTimeout(() => { this.fastmessages(''); }, 4000);
  }

  fastmessages(message: string) {
    this.animateAttack.setMessage(message);
    setTimeout(() => { this.animateAttack.setMessage(''); }, 2000);
  }

  noMove(porcent, menssage) {
    const porcentRadom = Math.floor((Math.random() * 100) + 1);
    if (porcentRadom < porcent) {
      this.fastmessages(menssage);
      this.faildAttack();
      return true;
    } else {
      return false;
    }
  }

  applyPossion(pokemon, np) {
    const dano = pokemon.status[5].value / 16;
    const newHP = pokemon.hp.value - dano;
    this.animateAttack.hpMinus(pokemon, np, newHP);
    this.fastmessages(`${pokemon.name} is hurt by posion!`);
  }
}
