import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { UniverseInfo } from '../../interfaces/explorer-character';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, MatCardModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {
  readonly universes: UniverseInfo[] = [
    { id: 'digimon', title: 'Digimon', description: 'Consulta personajes, niveles y atributos.', image: 'https://digi-api.com/images/digimon/w/Agumon.png' },
    { id: 'dragon-ball', title: 'Dragon Ball Z', description: 'Consulta luchadores, razas y afiliaciones.', image: 'https://dragonball-api.com/characters/goku_normal.webp' },
    { id: 'pokemon', title: 'Pokémon', description: 'Consulta Pokémon, tipos y habilidades.', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' },
    { id: 'demon-slayer', title: 'Demon Slayer', description: 'Consulta personajes y estilos de combate.', image: 'https://www.demonslayer-api.com/api/v1/characters/images/1.webp' },
  ];
}
