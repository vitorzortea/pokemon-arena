import { RoundService } from './../services/round.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PokemonsService } from '../services/pokemons.service';
import { async } from '@angular/core/testing';
import { AnimateService } from '../services/atacks/animate.service';

@Component({
  selector: 'app-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.styl']
})
export class RoundComponent implements OnInit {
  public loading = true;
  public runRound = false;
  public noMove = false;

  constructor(
    public pokemonsServices: PokemonsService,
    public roundServices: RoundService,
    private router: Router,
    public animateAttack: AnimateService,
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
    this.runRound = true; this.noMove = true;
    let pokemon1: any; let pokemon2: any; let np1: number; let np2: number;

    const p1 = this.pokemonsServices.pokemonsP1[this.pokemonsServices.index1];
    const p2 = this.pokemonsServices.pokemonsP2[this.pokemonsServices.index2];

    if (p1.status[0].value > p2.status[0].value) {
      pokemon1 = p1; pokemon2 = p2; np1 = 1; np2 = 2;
    } else {
      pokemon1 = p2; pokemon2 = p1; np1 = 2; np2 = 1;
    }

    this.roundServices.round({pokemonFrom: pokemon1,  pokemonTo: pokemon2, move, p1: np1, p2: np2});
    setTimeout(() => {
      if (pokemon2.hp.value !== 0) {
        this.roundServices.round({pokemonFrom: pokemon2,  pokemonTo: pokemon1, move, p1: np2, p2: np1});
        setTimeout(() => {
          this.runRound = false;
          if (pokemon1.hp.value === 0) {
            this.animateAttack.setMessage(`${pokemon1.name} fainted!`);
            setTimeout(() => {
              this.animateAttack.setMessage('');
              this.levelChange(np1);
            }, 2000);
          } else {
            this.noMove = false;
          }
        }, 6000);
      } else {
        this.animateAttack.setMessage(`${pokemon2.name} fainted!`);
        setTimeout(() => {
          this.animateAttack.setMessage('');
          this.runRound = false;
          this.levelChange(np2);
        }, 2000);

      }
    }, 6000);
  }

  levelChange(np) {
    const indexLife = [];
    const Allpokemons = (np === 1) ? this.pokemonsServices.pokemonsP1 : this.pokemonsServices.pokemonsP2;
    Allpokemons.map((e, i) => { if (e.hp.value !== 0) { indexLife.push(i); }});

    if (np === 1) {
      this.animateAttack.setMessage(`Choose another pokémon to continue!`);
      setTimeout(() => { this.animateAttack.setMessage(''); }, 2000);
    } else {
      if ( !indexLife[0] ) {
        alert('Ganhou');
      } else {
        const pokemonSelect = Math.floor(Math.random() * indexLife.length);
        document.querySelectorAll('.menu-enemy ul li')[this.pokemonsServices.index2].classList.add('pokemon-dead')
        this.pokemonsServices.index2 = indexLife[pokemonSelect];
        this.noMove = false;
        document.querySelector(`.pokemon-bar.player-2>div>div>span`).setAttribute('style', `transform: scaleX(1)`);
      }
    }
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

}
