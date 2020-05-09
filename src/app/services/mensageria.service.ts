import { Injectable } from '@angular/core';
import { AnimateService } from './atacks/animate.service';

@Injectable({
  providedIn: 'root'
})
export class MensageriaService {
  mensageriaP1: string[];
  mensageriaP2: string[];
  timeP1 = 0;
  timeP2 = 0;

  constructor(
    public animateAttack: AnimateService,
  ) { }

  setMensageria(mensageria, index, string) {
    mensageria[index] = string;
    mensageria[index+1] = '';
    console.log(mensageria);
  }

  display(mensageria, isTime){
    const time = { timeP1 : this.timeP1, timeP2 : this.timeP2, };
    const timefinal = {
      timeP1 : () => { this.timeP1 = time[isTime]; },
      timeP2 : () => { this.timeP2 = time[isTime]; },
    }

    mensageria.forEach((e) => {
      if(e){
        setTimeout(() => this.animateAttack.setMessage(e), time[isTime] = time[isTime]+500);
        setTimeout(() => this.animateAttack.setMessage(''), time[isTime] = time[isTime]+2000);
      }
    });

    timefinal[isTime]();
  }
}