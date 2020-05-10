import { RoundService } from './../services/round.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PokemonsService } from '../services/pokemons.service';
import { async } from '@angular/core/testing';
import { AnimateService } from '../services/atacks/animate.service';
import { MensageriaService } from '../services/mensageria.service';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.styl']
})
export class RoundComponent implements OnInit {
  loading = true;
  runRound = false;
  noMove = false;

  constructor(
    public pokemonsServices: PokemonsService,
    public roundServices: RoundService,
    private router: Router,
    public animateAttack: AnimateService,
    public mensageria: MensageriaService,
  ) { }

  ngOnInit() {
    (this.pokemonsServices.idP1) ? this.start() : this.router.navigate(['/get-pokemon']);
  }
  async start() {
    this.loading = true;
    await Promise.all(
      this.pokemonsServices.idP1.map((e, i) => this.pokemonsServices.getPokemons(e, i, this.pokemonsServices.pokemonsP1))
    );
    await Promise.all(
      this.pokemonsServices.idP2.map((e, i) => this.pokemonsServices.getPokemons(e, i, this.pokemonsServices.pokemonsP2))
    );
    for await (const [index, moveArray] of this.pokemonsServices.pokemonsP1.map(e => e.moves).entries()) {
      await Promise.all(
        moveArray.map((e, i) => this.pokemonsServices.getMoves(e, i, this.pokemonsServices.movesP1[index]))
      );
    }
    for await (const [index, moveArray] of this.pokemonsServices.pokemonsP2.map(e => e.moves).entries()) {
      await Promise.all(
        moveArray.map((e, i) => this.pokemonsServices.getMoves(e, i, this.pokemonsServices.movesP2[index]))
      );
    }
    await Promise.all(
      this.pokemonsServices.typesName.map((e, i) => this.pokemonsServices.getTypes(e, i))
    );
    this.loading = false;
  }

  round(move) {
    this.mensageria.mensageriaP1 = Array.from({length: 15}, (e) => '');
    this.mensageria.mensageriaP2 = Array.from({length: 15}, (e) => '');

    this.runRound = true; this.noMove = true;
    let pokemon1: any; let pokemon2: any; let np1: number; let np2: number;

    const p1 = this.pokemonsServices.pokemonsP1[this.pokemonsServices.index1];
    const p2 = this.pokemonsServices.pokemonsP2[this.pokemonsServices.index2];

    if (p1.status[0].value > p2.status[0].value) {
      pokemon1 = p1; pokemon2 = p2; np1 = 1; np2 = 2;
    } else {
      pokemon1 = p2; pokemon2 = p1; np1 = 2; np2 = 1;
    }

    this.attack({
      move,
      p1: np1,
      p2: np2,
      pokemonFrom: pokemon1,
      pokemonTo: pokemon2,
      mensages: this.mensageria.mensageriaP1,
    });
    //display mensageria
    this.mensageria.timeP1 = 0;
    this.mensageria.display(this.mensageria.mensageriaP1, 'timeP1');
    console.log('time1', this.mensageria.timeP1);


    setTimeout(() => {
      if (pokemon2.especialStatus !== 'fainted') {
        this.attack({
          move,
          p1: np2,
          p2: np1,
          pokemonFrom: pokemon2,
          pokemonTo: pokemon1,
          mensages: this.mensageria.mensageriaP2,
        });
        //display mensageria
        this.mensageria.timeP2 = 0;
        this.mensageria.display(this.mensageria.mensageriaP2, 'timeP2');
        console.log('time2', this.mensageria.timeP2);

        setTimeout(() => {
          this.runRound = false;
          if (pokemon1.especialStatus === 'fainted') { this.morte(pokemon1.name, np1); } else { this.noMove = false; }
          this.finalAtrak({ p1: np1, p2: np2, pokemonFrom: pokemon1, pokemonTo: pokemon2});
        }, this.mensageria.timeP2);
      } else {
        this.morte(pokemon2.name, np2);
        this.finalAtrak({ p1: np1, p2: np2, pokemonFrom: pokemon1, pokemonTo: pokemon2});
      }
    }, this.mensageria.timeP1);
  }

  attack(round) {
    const attackWithAilment = {
      sleep: (round) => {
        this.animateAttack.setMessage(`${round.pokemonFrom.name} is sleeping`);
        setTimeout(() => this.animateAttack.setMessage(''), 2000);
        this.applyAilment(round.pokemonFrom, round.p1,  round.pokemonFrom.especialStatus);
      },
    }
    const menssagesNoAilment = {
      sleep: (round) => {
        setTimeout(() => this.animateAttack.setMessage(`${round.pokemonFrom.name} wake up!`), 2500);
        setTimeout(() => this.animateAttack.setMessage(''), 4500);
        this.roundServices.round(round);
      }
    }
    const menssageSelect = round.pokemonFrom.especialStatus;
    if (!attackWithAilment[round.pokemonFrom.especialStatus]){
      this.roundServices.round(round);
    } else {
      attackWithAilment[round.pokemonFrom.especialStatus](round);
      if (!attackWithAilment[round.pokemonFrom.especialStatus]){
        menssagesNoAilment[menssageSelect](round)
      }
    }
  }

  finalAtrak(round){
    console.log('entrou!');
    const effectAilment = {
      poison: (pokemon, np, ailment) => {
        console.log('entrou!2');
        this.applyAilment(pokemon, np, ailment)
        this.animateAttack.setMessage(`${pokemon.name} is hurt by poison!`);
        setTimeout(() => this.animateAttack.setMessage(''), 2000);
      },
    }
    if (effectAilment[round.pokemonFrom.especialStatus]){
      console.log('entrou!1');
      effectAilment[round.pokemonFrom.especialStatus](round.pokemonFrom, round.p1, round.pokemonFrom.especialStatus)
      if (effectAilment[round.pokemonTo.especialStatus]){
        setTimeout(
          () => effectAilment[round.pokemonTo.especialStatus](round.pokemonTo, round.p2, round.pokemonTo.especialStatus),
          2500
        );
      }
    } else if (effectAilment[round.pokemonTo.especialStatus]){
      console.log('entrou!2');
      effectAilment[round.pokemonTo.especialStatus](round.pokemonTo, round.np2, round.pokemonTo.especialStatus)
    }
  }

  morte(name, np) {
    this.runRound = false;
    this.animateAttack.setMessage(`${name} fainted!`);
    setTimeout(() => {
      this.animateAttack.setMessage('');
      this.levelChange(np);
    }, 2000);
  }

  levelChange(np) {
    const indexLife = [];
    console.log('np ', np);
    const Allpokemons = (np === 1) ? this.pokemonsServices.pokemonsP1 : this.pokemonsServices.pokemonsP2;
    Allpokemons.map((e, i) => { if (e.especialStatus !== 'fainted') { indexLife.push(i); }});
    console.log(indexLife);

    const playerControl = {
      1: () => {
        if ( indexLife.length ) {
          this.animateAttack.setMessage(`Choose another pokémon to continue!`);
          setTimeout(() => { this.animateAttack.setMessage(''); }, 2000);
        } else {
          alert('Perder');
        }
      },
      2: () => {
        console.log('entrou 2');
        if ( indexLife.length ) {
          const pokemonSelect = Math.floor(Math.random() * indexLife.length);
          document.querySelectorAll('.menu-enemy ul li')[this.pokemonsServices.index2].classList.add('pokemon-dead')
          this.pokemonsServices.index2 = indexLife[pokemonSelect];
          this.noMove = false;
          document.querySelector(`.pokemon-bar.player-2>div>div>span`).setAttribute('style', `transform: scaleX(1)`);
        } else {
          alert('Ganhou');
        }
      }
    };
    playerControl[np]();
  }

  changeP1(index) {
    this.pokemonsServices.index1 = index;
    const porcent = this.pokemonsServices.pokemonsP1[this.pokemonsServices.index1].hp.porcent;
    document.querySelector(`.pokemon-bar.player-1>div>div>span`).setAttribute('style', `transform: scaleX(${porcent})`);
    if (this.noMove) {
      this.noMove = false;
    } else {
      alert('ataque do outro pokemon');
    }
  }

  applyAilment(pokemon, np, ailment) {
    const routeAilment = {
      sleep: () => {
        pokemon.countSleep--;
        if (pokemon.countSleep <= 0) {
          pokemon.countSleep = 0;
          pokemon.especialStatus = 'normal';
        }
      },
      confusion: () => { },
      poison: () => {
        let newHP = Math.floor(pokemon.hp.value - (pokemon.status[4].value / 8));
        if (newHP <= 0) {
          newHP = 0;
          pokemon.especialStatus = 'fainted';
          this.morte(pokemon.name, np);
        }
        setTimeout(() => { this.animateAttack.hpMinus(pokemon, np, newHP); }, 2000);
      },
      burn: () => { },
      leechseed: () => { },
      paralysis: () => { },
      trap: () => { },
    };
    routeAilment[ailment](pokemon);
  }
}
