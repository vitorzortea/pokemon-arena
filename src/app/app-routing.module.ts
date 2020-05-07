import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntrarComponent } from './entrar/entrar.component';
import { GetPokemonComponent } from './get-pokemon/get-pokemon.component';
import { RoundComponent } from './round/round.component';


const routes: Routes = [
  {
    path: '',
    component: EntrarComponent
  },
  {
    path: 'get-pokemon',
    component: GetPokemonComponent
  },
  {
    path: 'fight',
    component: RoundComponent
  },
  {
    path: 'end',
    component: EntrarComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
