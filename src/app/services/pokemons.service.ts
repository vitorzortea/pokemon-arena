import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class PokemonsService {
  private url = 'https://pokeapi.co/api/v2/';

  public idP1;
  public idP2;

  public pokemonsP1 = [];
  public pokemonsP2 = [];

  public index1 = 0;
  public index2 = 0;

  public movesP1 = Array.from({length: 6}, (e) => []);
  public movesP2 = Array.from({length: 6}, (e) => []);

  public banMoves = [];

  public typesName = [
    'normal',
    'fighting',
    'flying',
    'poison',
    'ground',
    'rock',
    'bug',
    'ghost',
    'steel',
    'fire',
    'water',
    'grass',
    'electric',
    'psychic',
    'ice',
    'dragon',
    'dark',
    'fairy',
  ];
  public types = Array.from({length: 18}, (e) => undefined);


  constructor(
    private http: HttpClient
  ) { }

  getAPI(url) {
    return this.http.get(`${url}`);
  }

  getBanMoves() {
    this.getAPI(`${this.url}move-category/13/`).subscribe(
      (res: {moves}) => {
        this.banMoves.push(res.moves.map(e => e.name));
        this.banMoves[0].splice(this.banMoves[0].indexOf('teleport'), 1);
        this.banMoves[0].splice(this.banMoves[0].indexOf('transform'), 1);
        this.banMoves[0].splice(this.banMoves[0].indexOf('splash'), 1);
        this.banMoves[0].splice(this.banMoves[0].indexOf('rest'), 1);
      },
      (error) => console.log(error)
    );
  }

  async getPokemons(id, index, pokemons) {
    await this.getAPI(`${this.url}pokemon/${id}`).toPromise().then(
      (res: any) => {
        pokemons[index] =  {
          id,
          name: res.name,
          types: res.types.map((ee) => ee.type.name),
          status: res.stats.map((ee) => ({ name: ee.stat.name, value: ee.base_stat })),
          hp: {value: res.stats[5].base_stat, porcent: 1},
          especialStatus: 'normal',
          countSleep: 0,
          moves: this.selectMoves(res.moves)
        };
      }
    ).catch();
  }

  async getMoves(move, index, arrayMoves) {
    await this.getAPI(`${this.url}move/${move}`).toPromise().then(
      (res: any) => {
        arrayMoves[index] = {
          name: res.names[2].name,
          type: res.type.name,
          slug: res.name,
          pp: res.pp,
          ppAtual: res.pp,
          power: res.power,
          target: res.target.name,
          accuracy: res.accuracy,
          stat_changes: res.stat_changes,
          meta: res.meta,
          ativo: true,
        };
      }
    ).catch();
  }

  async getTypes(type, index) {
    await this.getAPI(`${this.url}type/${type}`).toPromise().then(
      (res: any) => {
        this.types[index] = {
          type,
          doubleDamageFrom: res.damage_relations.double_damage_from.map((e) => e.name),
          doubleDamageTo: res.damage_relations.double_damage_to.map((e) => e.name),
          halfDamageFrom: res.damage_relations.half_damage_from.map((e) => e.name),
          halfDamageTo: res.damage_relations.half_damage_to.map((e) => e.name),
          noDamageFrom: res.damage_relations.no_damage_from.map((e) => e.name),
          nofDamageTo: res.damage_relations.no_damage_to.map((e) => e.name),
        };
      }
    ).catch();
  }

  selectMoves(moves) {
    return this.embaralharArray(
      moves.filter((ee) =>
        ee.version_group_details[0].move_learn_method.name === 'level-up'
      ).map(element => element.move.name)
    ).slice(0, 4);
  }





  embaralharArray(array) {
    let m = array.length;
    let t;
    let i;

    while (m) {
      i = Math.floor(Math.random() * m--);

      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }


}
