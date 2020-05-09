import { Injectable } from '@angular/core';
import { DamageService } from './atacks/damage.service';
import { AnimateService } from './atacks/animate.service';
import { AilmentService } from './atacks/ailment.service';
import { MensageriaService } from './mensageria.service';

@Injectable({
  providedIn: 'root'
})
export class RoundService {

  constructor(
    // Functions in Render
    public animateAttack: AnimateService,
    public mensageria: MensageriaService,
    // Attacks Types
    public damage: DamageService,
    public ailment: AilmentService,
  ) { }

  round(round) {
    console.log(round);
    this.categoryMove(round);
    this.mensageria.setMensageria(round.mensages, 2, `${round.pokemonFrom.name} used ${round.move.name}`);
  }

  categoryMove(round) {
    if (round.move.meta.category.name.includes('damage')) { this.damage.start(round); }
    if (round.move.meta.category.name.includes('ailment')) { this.ailment.start(round); }\
  }
}
