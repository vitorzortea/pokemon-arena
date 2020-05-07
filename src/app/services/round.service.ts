import { Injectable } from '@angular/core';
import { DamageService } from './atacks/damage.service';
import { AnimateService } from './atacks/animate.service';

@Injectable({
  providedIn: 'root'
})
export class RoundService {

  constructor(
    // Functions in Render
    public animateAttack: AnimateService,
    // Attacks Types
    public damage: DamageService,
  ) { }

  round(round) {
    console.log(round);
    this.categoryMove(round);
    this.animateAttack.setMessage(`${round.pokemonFrom.name} used ${round.move.name}`);
    setTimeout(() => { this.animateAttack.setMessage(''); }, 2000);
  }

  categoryMove(round) {
    if (round.move.meta.category.name.includes('damage')) { this.damage.start(round); }
    // if (round.moveAtive.meta.category.name.includes('ailment')) { this.roundService.causeAilment(round); }
    // if (round.moveAtive.meta.category.name.includes('net-good-stats')) { this.roundService.causeBuff(round); }
  }
}
