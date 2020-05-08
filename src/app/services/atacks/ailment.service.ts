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
    const testObject = {
      sleep: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} is fast asleep!`);
      },
      confusion: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} became confused!`);
      },
      poison: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} became posion!`);
      },
      burn: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} was burned!`);
      },
      leechseed: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} was seeded!`);
      },
      paralysis: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} was paralyzed!`);
      },
      trap: (round)=>{
        console.log('entrou na function do obj');
        this.applyAilment(round, `${round.pokemonTo.name} Trap!`);
      },
    }
    
    const typeMove = round.move.meta.ailment.name.replace('-', '');
    testObject[typeMove](round);
  }

  applyAilment(round, menssage) {
    console.log('chamou a function!');
    console.log(menssage);    
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    console.log(porcentAccuracy);    
    console.log(round.move.meta.ailment_chance);    
    if (
      round.pokemonTo.especialStatus === 'normal'
      && porcentAccuracy <= round.move.meta.ailment_chance
      || round.move.meta.ailment_chance === 0
    ) {
      round.pokemonTo.especialStatus = round.move.meta.ailment.name;
      setTimeout(() => { this.fastmessages(menssage); }, 2000);
    } else { this.faildAttack(); }
  }

  applyAilment2(round, menssageAilment) {
    console.log(`entrou2`);
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
