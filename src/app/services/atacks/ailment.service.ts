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
    const porcentAccuracy = Math.floor((Math.random() * 100) + 1);
    const testObject = {
      sleep: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} is fast asleep!`);
        round.pokemonTo.countSleep = Math.floor((Math.random() * 4) + 1);
      },
      confusion: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} became confused!`);
      },
      poison: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} became posion!`);
      },
      burn: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} was burned!`);
      },
      leechseed: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} was seeded!`);
      },
      paralysis: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} was paralyzed!`);
      },
      trap: (round)=>{
        this.applyAilment(round, `${round.pokemonTo.name} Trap!`);
      },
    }
    
    const typeMove = round.move.meta.ailment.name.replace('-', '');
    
    if (round.pokemonTo.especialStatus === 'normal') {
      if(porcentAccuracy <= round.move.meta.ailment_chance || round.move.meta.ailment_chance === 0) {
        testObject[typeMove](round);
      } else if(round.move.meta.category.name == 'ailment') {
        this.mensageria.setMensageria(round.mensages, 4, 'But it failed!');
      }
    } else if(round.move.meta.category.name == 'ailment') {
      this.mensageria.setMensageria(round.mensages, 4, 'But it failed!');
    }
  }

  applyAilment(round, menssage) {    
    round.pokemonTo.especialStatus = round.move.meta.ailment.name;
    this.mensageria.setMensageria(round.mensages, 8, menssage); 
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

  applyPossion(pokemon, np) {
    const dano = pokemon.status[5].value / 16;
    const newHP = pokemon.hp.value - dano;
    this.animateAttack.hpMinus(pokemon, np, newHP);
    //this.fastmessages(`${pokemon.name} is hurt by posion!`);
  }

  
}
