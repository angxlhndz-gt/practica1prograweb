import {Routes} from '@angular/router';
import {DemonSlayerCharactersList} from './pages/demon-slayer-characters-list/demon-slayer-characters-list';
import {DbzCharactersList} from './pages/dbz-characters-list/dbz-characters-list';
import {DigimonList} from './pages/digimon-list/digimon-list';
import { ProductsList } from './pages/products-list/products-list';
import { HomePage } from './pages/home-page/home-page';
import { CharacterListPage } from './pages/character-list-page/character-list-page';
import { CharacterDetailPage } from './pages/character-detail-page/character-detail-page';


export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'characters/:universe/:id', component: CharacterDetailPage },
  { path: 'characters/:universe', component: CharacterListPage },
  { path: 'demon-slayer', redirectTo: 'characters/demon-slayer', pathMatch: 'full' },
  { path: 'dragon-ball', redirectTo: 'characters/dragon-ball', pathMatch: 'full' },
  { path: 'digimon-list', redirectTo: 'characters/digimon', pathMatch: 'full' },
  { path: 'pokemon', redirectTo: 'characters/pokemon', pathMatch: 'full' },
  { path: 'products-list', component: ProductsList },
  { path: '**', redirectTo: '' },
];
