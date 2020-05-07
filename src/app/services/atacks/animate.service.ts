import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimateService {
  public textRound: string;

  constructor() { }

  setMessage(message: string) {
    if (message) {
      const letterMenssage = message.split('');
      this.textRound = '<i class="anime-letter">' + letterMenssage.join('</i><i class="anime-letter">') + '</i>';

    } else {
      this.textRound = null;
    }
    document.querySelector('.message-round p').innerHTML = this.textRound;
    const spansText = document.querySelectorAll('.anime-letter');
    spansText.forEach((e, i) => {
      e.animate([
        {transform: `scaleX(0)`, opacity: 0},
        {transform: `scaleX(1)`, opacity: 1},
      ], {duration: 100, fill: 'forwards', delay: i * 50 });
    });
  }

  classRound(classToggle) {
    return document.querySelector('.pokemons').classList.toggle(classToggle);
  }

  hpMinus(pokemon, player, newHp) {
    const mapFor = Array.from({length: pokemon.hp.value}, (e, i) => i * 50 );
    mapFor.map(e => {
      setTimeout(() => {
        if (newHp < pokemon.hp.value) {
          pokemon.hp.value = pokemon.hp.value - 1;
          pokemon.hp.porcent = ((pokemon.hp.value * 100) / pokemon.status[5].value) / 100;
          const porcetagem = pokemon.hp.porcent;
          document.querySelector(`.pokemon-bar.player-${player}>div>div>span`).setAttribute('style', `transform: scaleX(${porcetagem})`);
        }
      }, e);
    });
  }
}
