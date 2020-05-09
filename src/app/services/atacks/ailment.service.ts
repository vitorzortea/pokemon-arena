import { Injectable } from '@angular/core';
import { PokemonsService } from '../pokemons.service';
import { AnimateService } from './animate.service';
import { MensageriaService } from '../mensageria.service';

@Injectable({
  providedIn: 'root'
})
export class AilmentService {

  constructor(
    public animateAttack: AnimateService,
    public mensageria: MensageriaService,
    public pokemonsService: PokemonsService,
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
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    console.log(porcentAccuracy);    
    console.log(round.move.meta.ailment_chance);    
    if (
      round.pokemonTo.especialStatus === 'normal'
      && porcentAccuracy <= round.move.meta.ailment_chance
      || round.move.meta.ailment_chance === 0
    ) {
      round.pokemonTo.especialStatus = round.move.meta.ailment.name;
      this.mensageria.setMensageria(round.mensages, 8, menssage);
    } else if(round.move.meta.category.name == 'ailment') {
      this.mensageria.setMensageria(round.mensages, 4, 'But it failed!');
    }
  }

  removeAilment(pokemon, porcetagem, menssageRemove, menssageContinue) {
    const porcentWakeup = Math.floor((Math.random() * 100) + 1);
    if ( porcentWakeup > porcetagem ) {
      pokemon.especialStatus = 'normal';
      return true;
    } else {
      return false;
    }
  }

  noMove(porcent, menssage) {
    const porcentRadom = Math.floor((Math.random() * 100) + 1);
    if (porcentRadom < porcent) {
      return true;
    } else {
      return false;
    }
  }

  applyPossion(pokemon, np) {
    const dano = pokemon.status[5].value / 16;
    const newHP = pokemon.hp.value - dano;
    this.animateAttack.hpMinus(pokemon, np, newHP);
    //this.fastmessages(`${pokemon.name} is hurt by posion!`);
  }
}
